/**
 * Task Registry Service.
 *
 * Central registry for React task providers with lazy evaluation.
 * Tasks register via `registerTask()` but are only evaluated on-demand.
 */

import { addFilter, applyFilters } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';
import { createTaskPost } from '../hooks/useTasksApi';

/**
 * Registry storage for task provider classes.
 * Populated during import, before any evaluation.
 *
 * @type {Map<string, Function>}
 */
const taskProviders = new Map();

/**
 * Pre-fetched existing task slugs from the database.
 * Used to avoid per-task existence checks.
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
 * Called once before evaluation begins.
 *
 * @return {Promise<Map<string, Object>>} Map of slug -> task data.
 */
async function preFetchExistingTasks() {
	try {
		const response = await apiFetch( {
			path: '/wp/v2/prpl_recommendations?status=publish&per_page=100&_embed=true',
		} );

		const tasksMap = new Map();
		if ( Array.isArray( response ) ) {
			response.forEach( ( task ) => {
				if ( task.slug ) {
					tasksMap.set( task.slug, task );
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
 * Evaluate tasks lazily until we have enough ready to display.
 *
 * @param {number}   targetCount Number of tasks needed (visible + buffer).
 * @param {Function} onTaskReady Callback when a task is ready: (taskData, priority) => void.
 * @return {Promise<{complete: boolean, tasksAdded: number}>} Evaluation result.
 */
export async function evaluateTasksUntil( targetCount, onTaskReady ) {
	// Pre-fetch existing tasks if not done
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
		while (
			tasksAdded < targetCount &&
			evaluationState.currentIndex < sortedTaskClasses.length
		) {
			const { TaskClass, priority } =
				sortedTaskClasses[ evaluationState.currentIndex ];
			evaluationState.currentIndex++;

			const results = await evaluateSingleTask( TaskClass, priority );

			if ( results.tasks && results.tasks.length > 0 ) {
				for ( const taskData of results.tasks ) {
					onTaskReady( taskData, priority );
					tasksAdded++;
				}
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
 * Evaluate a single task provider.
 *
 * @param {Function} TaskClass The task class to evaluate.
 * @param {number}   priority  The task priority.
 * @return {Promise<{tasks: Array}>} Evaluated task data.
 */
async function evaluateSingleTask( TaskClass, priority ) {
	const providerId = TaskClass.providerId;
	const tasks = [];

	try {
		const taskInstance = new TaskClass();

		// Check if task should be added
		if (
			! taskInstance.shouldAddTask ||
			typeof taskInstance.shouldAddTask !== 'function'
		) {
			return { tasks };
		}

		const shouldAdd = await taskInstance.shouldAddTask();
		if ( ! shouldAdd ) {
			return { tasks };
		}

		// Handle multi-task providers
		const isMultiTask = TaskClass.isMultiTask || false;
		const hasGetTasksToInject =
			taskInstance.getTasksToInject &&
			typeof taskInstance.getTasksToInject === 'function';

		if ( isMultiTask || hasGetTasksToInject ) {
			if ( ! hasGetTasksToInject ) {
				return { tasks };
			}

			const tasksToInject = await taskInstance.getTasksToInject();
			if ( ! Array.isArray( tasksToInject ) ) {
				return { tasks };
			}

			// Process each task in parallel for multi-task providers
			const results = await Promise.all(
				tasksToInject.map( ( taskData ) =>
					processSingleTask(
						taskInstance,
						taskData,
						TaskClass,
						priority
					)
				)
			);

			results.forEach( ( result ) => {
				if ( result ) {
					tasks.push( result );
				}
			} );
		} else {
			// Single-task provider
			const result = await processSingleTask(
				taskInstance,
				{},
				TaskClass,
				priority
			);
			if ( result ) {
				tasks.push( result );
			}
		}
	} catch ( error ) {
		console.error(
			`Error evaluating task provider "${ providerId }":`,
			error
		);
	}

	return { tasks };
}

/**
 * Process a single task: check existence in cache, create if needed.
 *
 * @param {Object}   taskInstance The task instance.
 * @param {Object}   taskData     Optional task-specific data.
 * @param {Function} TaskClass    The task class.
 * @param {number}   priority     The task priority.
 * @return {Promise<Object|null>} Task data if successful, null otherwise.
 */
async function processSingleTask(
	taskInstance,
	taskData,
	TaskClass,
	priority
) {
	try {
		// Get task ID
		const taskId =
			taskInstance.getTaskId &&
			typeof taskInstance.getTaskId === 'function'
				? taskInstance.getTaskId( taskData )
				: TaskClass.providerId;

		// Check pre-fetched cache first (no API call needed!)
		if ( existingTasksCache.has( taskId ) ) {
			const existingTask = existingTasksCache.get( taskId );
			// Ensure priority is set
			if ( existingTask.prpl_priority === undefined ) {
				existingTask.prpl_priority = priority;
			}
			return existingTask;
		}

		// Task doesn't exist, get details and create it
		if (
			! taskInstance.getTaskDetails ||
			typeof taskInstance.getTaskDetails !== 'function'
		) {
			console.warn(
				`Task provider "${ TaskClass.providerId }" missing getTaskDetails method`
			);
			return null;
		}

		const taskDetails = await taskInstance.getTaskDetails( taskData );

		// Ensure required fields
		if ( ! taskDetails.task_id ) {
			taskDetails.task_id = taskId;
		}
		if ( ! taskDetails.provider_id ) {
			taskDetails.provider_id = TaskClass.providerId;
		}

		// Create task post
		try {
			const response = await createTaskPost( taskDetails );

			if ( response && response.success && response.post_id ) {
				// Fetch the created task to get full data
				const createdTask = await fetchTaskBySlug( taskId );
				if ( createdTask ) {
					// Ensure priority is set
					if ( createdTask.prpl_priority === undefined ) {
						createdTask.prpl_priority = priority;
					}
					// Add to cache for future reference
					existingTasksCache.set( taskId, createdTask );
					return createdTask;
				}
			}
		} catch ( error ) {
			console.warn(
				`Error creating task "${ taskDetails.task_id }":`,
				error
			);
		}

		return null;
	} catch ( error ) {
		console.error( 'Error processing task:', error );
		return null;
	}
}

/**
 * Fetch a task by its slug.
 *
 * @param {string} slug The task slug.
 * @return {Promise<Object|null>} Task data or null.
 */
async function fetchTaskBySlug( slug ) {
	try {
		const response = await apiFetch( {
			path: `/wp/v2/prpl_recommendations?slug=${ encodeURIComponent(
				slug
			) }&status=publish&_embed=true`,
		} );

		if ( Array.isArray( response ) && response.length > 0 ) {
			return response[ 0 ];
		}
		return null;
	} catch ( error ) {
		console.error( `Error fetching task "${ slug }":`, error );
		return null;
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
