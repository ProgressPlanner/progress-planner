/**
 * Task Registry Service.
 *
 * Central registry for React task providers with batched evaluation.
 * Tasks register via `registerTask()` but are only evaluated on-demand.
 * Uses batch API calls for task creation to improve performance.
 */

import { addFilter, applyFilters } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';
import { createTasksBatch } from '../hooks/useTasksApi';

/**
 * Registry storage for task provider classes.
 * Populated during import, before any evaluation.
 *
 * @type {Map<string, Function>}
 */
const taskProviders = new Map();

/**
 * Pre-fetched existing task slugs from the database (all statuses).
 * Used to avoid per-task existence checks and skip completed/snoozed tasks.
 *
 * @type {Map<string, Object>}
 */
let existingTasksCache = new Map();

/**
 * Sorted array of task classes by priority.
 * Computed once after all tasks are registered.
 *
 * @type {Array<{TaskClass: Function, priority: number, providerId: string}>}
 */
let sortedTaskClasses = [];

/**
 * Evaluation state tracking.
 */
const evaluationState = {
	isPreFetchComplete: false,
	isEvaluating: false,
	currentIndex: 0,
};

/**
 * Buffer size for pre-evaluated tasks.
 */
const BUFFER_SIZE = 3;

/**
 * Batch size for task creation requests.
 */
const BATCH_SIZE = 5;

/**
 * Register a task class for lazy evaluation.
 * This collects the task class without triggering any evaluation.
 *
 * @param {Function} TaskClass The task class to register.
 */
export function registerTask( TaskClass ) {
	const providerId = TaskClass.providerId;
	if ( ! providerId ) {
		console.warn( 'Task class missing providerId, skipping:', TaskClass );
		return;
	}

	const priority = TaskClass.priority || 50;

	addFilter(
		'prpl.tasks.classes',
		`prpl/task/${ providerId }`,
		( taskClasses ) => {
			if ( ! taskClasses.has( providerId ) ) {
				taskClasses.set( providerId, { TaskClass, priority } );
			}
			return taskClasses;
		},
		priority
	);

	// Also store in taskProviders for getTaskProviderClass/Instance
	taskProviders.set( providerId, TaskClass );
}

/**
 * Pre-fetch all existing task recommendations from the database.
 * Fetches ALL statuses (publish, trash, future) to know what's completed/snoozed.
 *
 * @return {Promise<Map<string, Object>>} Map of slug -> task data with status info.
 */
async function preFetchExistingTasks() {
	try {
		const response = await apiFetch( {
			// Fetch all statuses to know completed/snoozed tasks too
			path: '/wp/v2/prpl_recommendations?status=publish,trash,future&per_page=100&_embed=true',
		} );

		const tasksMap = new Map();
		if ( Array.isArray( response ) ) {
			response.forEach( ( task ) => {
				if ( task.slug ) {
					tasksMap.set( task.slug, {
						...task,
						_existsInDb: true,
						_isActive: task.status === 'publish',
					} );
				}
			} );
		}

		return tasksMap;
	} catch ( error ) {
		console.error( 'Error pre-fetching existing tasks:', error );
		return new Map();
	}
}

/**
 * Initialize the sorted task classes array.
 * Called once after all tasks have registered.
 */
function initializeSortedTaskClasses() {
	const registered = applyFilters( 'prpl.tasks.classes', new Map() );

	sortedTaskClasses = Array.from( registered.entries() )
		.map( ( [ providerId, { TaskClass, priority } ] ) => ( {
			TaskClass,
			priority,
			providerId,
		} ) )
		.sort( ( a, b ) => a.priority - b.priority );
}

/**
 * Evaluate tasks with batched creation for improved performance.
 *
 * Flow:
 * 1. Pre-fetch ALL existing tasks (all statuses)
 * 2. Evaluate each task provider (skip completed/snoozed)
 * 3. Immediately render existing active tasks
 * 4. Batch create new tasks (5 at a time), render as batches complete
 *
 * @param {number}   targetCount Number of tasks needed (visible + buffer).
 * @param {Function} onTaskReady Callback when a task is ready: (taskData, priority) => void.
 * @return {Promise<{complete: boolean, tasksAdded: number}>} Evaluation result.
 */
export async function evaluateTasksUntil( targetCount, onTaskReady ) {
	// Phase 0: Pre-fetch ALL existing tasks (all statuses)
	if ( ! evaluationState.isPreFetchComplete ) {
		existingTasksCache = await preFetchExistingTasks();
		evaluationState.isPreFetchComplete = true;
		initializeSortedTaskClasses();
	}

	// Prevent concurrent evaluation
	if ( evaluationState.isEvaluating ) {
		return { complete: false, tasksAdded: 0 };
	}

	evaluationState.isEvaluating = true;
	let tasksAdded = 0;

	try {
		// Phase 1: Evaluate tasks - collect existing and tasks to create
		const existingTasks = []; // Already in DB with status=publish
		const tasksToCreate = []; // Need to be created

		while ( evaluationState.currentIndex < sortedTaskClasses.length ) {
			const { TaskClass, priority } =
				sortedTaskClasses[ evaluationState.currentIndex ];
			evaluationState.currentIndex++;

			const result = await evaluateForCollection( TaskClass, priority );

			if ( result.existing ) {
				existingTasks.push( result.existing );
			}
			if ( result.toCreate ) {
				tasksToCreate.push( result.toCreate );
			}
		}

		// Sort by priority (high priority = lower number = first)
		existingTasks.sort( ( a, b ) => a.priority - b.priority );
		tasksToCreate.sort( ( a, b ) => a.priority - b.priority );

		// Phase 2: Immediately render existing tasks (no API calls needed!)
		for ( const { task, priority } of existingTasks ) {
			onTaskReady( task, priority );
			tasksAdded++;
		}

		// Phase 3: Batch create new tasks, render as batches complete
		for ( let i = 0; i < tasksToCreate.length; i += BATCH_SIZE ) {
			const batch = tasksToCreate.slice( i, i + BATCH_SIZE );
			const taskDetails = batch.map( ( b ) => b.taskDetails );

			try {
				// Create batch (returns full task data)
				const response = await createTasksBatch( taskDetails );

				if ( response.success && response.tasks ) {
					response.tasks.forEach( ( result, idx ) => {
						if ( result.success && result.task ) {
							const { priority, taskId } = batch[ idx ];
							// Ensure priority is set
							if ( result.task.prpl_priority === undefined ) {
								result.task.prpl_priority = priority;
							}
							existingTasksCache.set( taskId, result.task );
							onTaskReady( result.task, priority );
							tasksAdded++;
						}
					} );
				}
			} catch ( error ) {
				console.error( 'Error creating task batch:', error );
			}
		}
	} finally {
		evaluationState.isEvaluating = false;
	}

	return {
		complete: evaluationState.currentIndex >= sortedTaskClasses.length,
		tasksAdded,
	};
}

/**
 * Evaluate a task class and determine if it exists or needs creation.
 *
 * IMPORTANT: shouldAddTask() still runs full server-side evaluation
 * (via data-collectors). The only "quick skip" is for tasks we KNOW
 * are completed/snoozed from the all-statuses prefetch.
 *
 * @param {Function} TaskClass The task class to evaluate.
 * @param {number}   priority  The task priority.
 * @return {Promise<Object>} Result with 'existing' or 'toCreate' property.
 */
async function evaluateForCollection( TaskClass, priority ) {
	const providerId = TaskClass.providerId;

	try {
		const taskInstance = new TaskClass();

		// Handle multi-task providers
		const isMultiTask = TaskClass.isMultiTask || false;
		const hasGetTasksToInject =
			taskInstance.getTasksToInject &&
			typeof taskInstance.getTasksToInject === 'function';

		if ( isMultiTask || hasGetTasksToInject ) {
			// Multi-task providers need special handling
			return await evaluateMultiTaskProvider(
				taskInstance,
				TaskClass,
				priority
			);
		}

		// Single-task provider
		const taskId = taskInstance.getTaskId?.() || providerId;

		// QUICK SKIP: Check if task was already completed/snoozed
		const cached = existingTasksCache.get( taskId );
		if ( cached && ! cached._isActive ) {
			// Task was completed (trash) or snoozed (future) - skip entirely
			return {};
		}

		// FULL EVALUATION: shouldAddTask() runs data-collector checks (server-side)
		if ( ! taskInstance.shouldAddTask ) {
			return {};
		}
		const shouldAdd = await taskInstance.shouldAddTask();
		if ( ! shouldAdd ) {
			return {};
		}

		// Task should be shown - check if it exists in DB
		if ( cached && cached._isActive ) {
			// Active task already exists - return for immediate rendering
			if ( cached.prpl_priority === undefined ) {
				cached.prpl_priority = priority;
			}
			return { existing: { task: cached, priority } };
		}

		// Task doesn't exist - collect details for batch creation
		if ( ! taskInstance.getTaskDetails ) {
			return {};
		}
		const taskDetails = await taskInstance.getTaskDetails();
		if ( ! taskDetails ) {
			return {};
		}

		// Ensure required fields
		taskDetails.task_id = taskDetails.task_id || taskId;
		taskDetails.provider_id = taskDetails.provider_id || providerId;

		return {
			toCreate: { taskDetails, priority, taskId },
		};
	} catch ( error ) {
		console.error( `Error evaluating task "${ providerId }":`, error );
		return {};
	}
}

/**
 * Evaluate a multi-task provider (one that injects multiple tasks).
 *
 * @param {Object}   taskInstance The task instance.
 * @param {Function} TaskClass    The task class.
 * @param {number}   priority     The task priority.
 * @return {Promise<Object>} Result with existing tasks and tasks to create.
 */
async function evaluateMultiTaskProvider( taskInstance, TaskClass, priority ) {
	const providerId = TaskClass.providerId;
	const existing = [];
	const toCreate = [];

	try {
		// Check if any tasks should be added
		if ( taskInstance.shouldAddTask ) {
			const shouldAdd = await taskInstance.shouldAddTask();
			if ( ! shouldAdd ) {
				return {};
			}
		}

		const tasksToInject = await taskInstance.getTasksToInject();
		if ( ! Array.isArray( tasksToInject ) ) {
			return {};
		}

		for ( const taskData of tasksToInject ) {
			const taskId = taskInstance.getTaskId?.( taskData ) || providerId;

			// Check cache
			const cached = existingTasksCache.get( taskId );
			if ( cached ) {
				if ( cached._isActive ) {
					if ( cached.prpl_priority === undefined ) {
						cached.prpl_priority = priority;
					}
					existing.push( { task: cached, priority } );
				}
				// Skip completed/snoozed
				continue;
			}

			// Need to create - get details
			if ( taskInstance.getTaskDetails ) {
				const taskDetails =
					await taskInstance.getTaskDetails( taskData );
				if ( taskDetails ) {
					taskDetails.task_id = taskDetails.task_id || taskId;
					taskDetails.provider_id =
						taskDetails.provider_id || providerId;
					toCreate.push( { taskDetails, priority, taskId } );
				}
			}
		}

		// Return combined results
		if ( existing.length === 1 && toCreate.length === 0 ) {
			return { existing: existing[ 0 ] };
		}
		if ( existing.length === 0 && toCreate.length === 1 ) {
			return { toCreate: toCreate[ 0 ] };
		}

		// For multiple results, we need to handle them specially
		// Return first existing if any, otherwise first to create
		if ( existing.length > 0 ) {
			return { existing: existing[ 0 ] };
		}
		if ( toCreate.length > 0 ) {
			return { toCreate: toCreate[ 0 ] };
		}

		return {};
	} catch ( error ) {
		console.error(
			`Error evaluating multi-task provider "${ providerId }":`,
			error
		);
		return {};
	}
}

/**
 * Reset evaluation state (useful for testing).
 */
export function resetEvaluationState() {
	evaluationState.isPreFetchComplete = false;
	evaluationState.isEvaluating = false;
	evaluationState.currentIndex = 0;
	existingTasksCache = new Map();
	sortedTaskClasses = [];
}

/**
 * Get evaluation progress information.
 *
 * @return {Object} Progress info: { current, total, complete }.
 */
export function getEvaluationProgress() {
	return {
		current: evaluationState.currentIndex,
		total: sortedTaskClasses.length,
		complete: evaluationState.currentIndex >= sortedTaskClasses.length,
		isEvaluating: evaluationState.isEvaluating,
	};
}

/**
 * Check if there are more tasks to evaluate.
 *
 * @return {boolean} True if more tasks can be evaluated.
 */
export function hasMoreTasksToEvaluate() {
	// If not initialized yet, assume there are more
	if ( ! evaluationState.isPreFetchComplete ) {
		return true;
	}
	return evaluationState.currentIndex < sortedTaskClasses.length;
}

/**
 * Get a task provider class by provider ID.
 *
 * @param {string} providerId The provider ID.
 * @return {Function|null} The task provider class, or null if not found.
 */
export function getTaskProviderClass( providerId ) {
	if ( ! providerId ) {
		return null;
	}
	return taskProviders.get( providerId ) || null;
}

/**
 * Get a task provider instance by provider ID.
 *
 * @param {string} providerId The provider ID.
 * @return {Object|null} The task provider instance, or null if not found.
 */
export function getTaskProviderInstance( providerId ) {
	if ( ! providerId ) {
		return null;
	}
	const TaskClass = getTaskProviderClass( providerId );
	if ( ! TaskClass ) {
		return null;
	}
	try {
		return new TaskClass();
	} catch ( error ) {
		console.error(
			`Error creating instance of task provider "${ providerId }":`,
			error
		);
		return null;
	}
}

/**
 * Get the buffer size constant.
 *
 * @return {number} Buffer size.
 */
export function getBufferSize() {
	return BUFFER_SIZE;
}
