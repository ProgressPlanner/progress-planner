/**
 * Task Registry Service.
 *
 * Central registry for React task providers. Tasks self-register via WordPress hooks.
 * This replaces the PHP-based task registration system.
 */

import { addAction } from '@wordpress/hooks';
import { createTaskPost } from '../hooks/useTasksApi';

/**
 * Registry storage for task providers.
 *
 * @type {Map<string, Object>}
 */
const taskProviders = new Map();

/**
 * Callback function for rendering a task into the DOM.
 * This is set by the widget and called when tasks are ready to render.
 *
 * @type {Function|null}
 */
let taskRenderCallback = null;

/**
 * Queue of tasks waiting to be rendered (when callback is not ready yet).
 *
 * @type {Array<{taskData: Object, priority: number}>}
 */
const taskRenderQueue = [];

/**
 * Register a task provider.
 *
 * @param {Function|Object} providerConfig The task provider class or instance.
 * @return {void}
 */
export function registerTaskProvider( providerConfig ) {
	// Support classes (with static properties), instances, and plain objects
	let providerId = null;

	// Check if it's a class (constructor function) with static providerId
	if ( typeof providerConfig === 'function' && providerConfig.providerId ) {
		providerId = providerConfig.providerId;
	}
	// Check if it's an instance with getProviderId method
	else if (
		providerConfig.getProviderId &&
		typeof providerConfig.getProviderId === 'function'
	) {
		providerId = providerConfig.getProviderId();
	}
	// Check for direct providerId property (plain object or instance)
	else if ( providerConfig.providerId ) {
		providerId = providerConfig.providerId;
	}

	if ( ! providerId ) {
		console.error(
			'Task provider registration failed: providerId is required',
			providerConfig
		);
		return;
	}

	if ( taskProviders.has( providerId ) ) {
		console.warn(
			`Task provider "${ providerId }" is already registered. Overwriting.`
		);
	}

	taskProviders.set( providerId, providerConfig );
}

/**
 * Get a registered task provider.
 *
 * @param {string} providerId The provider ID.
 * @return {Object|undefined} The task provider configuration or undefined.
 */
export function getTaskProvider( providerId ) {
	return taskProviders.get( providerId );
}

/**
 * Get all registered task providers.
 *
 * @return {Array<Object>} Array of task provider configurations.
 */
export function getAllTaskProviders() {
	return Array.from( taskProviders.values() );
}

/**
 * Check if a task provider is registered.
 *
 * @param {string} providerId The provider ID.
 * @return {boolean} True if registered, false otherwise.
 */
export function isTaskProviderRegistered( providerId ) {
	return taskProviders.has( providerId );
}

/**
 * Set the callback function for rendering tasks.
 *
 * @param {Function} callback The callback function that receives task data and renders it.
 * @return {void}
 */
export function setTaskRenderCallback( callback ) {
	taskRenderCallback = callback;

	// Process queued tasks if callback is now available
	if ( callback && taskRenderQueue.length > 0 ) {
		taskRenderQueue.forEach( ( { taskData, priority } ) => {
			callback( taskData, priority );
		} );
		// Clear the queue
		taskRenderQueue.length = 0;
	}
}

/**
 * Set the container element for rendering tasks.
 * Note: Currently not used, but kept for future use if needed.
 *
 * @param {HTMLElement} container The container element.
 * @return {void}
 */
export function setTaskContainer( container ) {
	// Container is stored for potential future use
	// Currently, the widget handles rendering directly via callback
	// eslint-disable-next-line no-unused-vars
	const _container = container;
}

/**
 * Check if a task post exists in the database.
 *
 * @param {string} taskId The task ID to check (becomes post_name/slug).
 * @return {Promise<Object|null>} Promise resolving to task data if exists, null otherwise.
 */
async function checkTaskExists( taskId ) {
	try {
		// Import apiFetch dynamically to avoid circular dependencies
		const { default: apiFetch } = await import( '@wordpress/api-fetch' );

		// Try to fetch the task by slug (task_id becomes post_name)
		// WordPress REST API allows fetching by slug
		try {
			const task = await apiFetch( {
				path: `/wp/v2/prpl_recommendations?slug=${ encodeURIComponent(
					taskId
				) }&status=publish`,
			} );

			// apiFetch returns an array for collection endpoints
			if ( Array.isArray( task ) && task.length > 0 ) {
				return task[ 0 ];
			}

			return null;
		} catch ( fetchError ) {
			// Task doesn't exist or error fetching
			return null;
		}
	} catch ( error ) {
		console.error( 'Error checking if task exists:', error );
		return null;
	}
}

/**
 * Handle task lifecycle: evaluate, create post if needed, and render.
 *
 * @param {Function} TaskClass The task provider class.
 * @param {number}   priority  The task priority (for sorting).
 * @return {Promise<void>}
 */
async function handleTaskLifecycle( TaskClass, priority = 50 ) {
	const providerId = TaskClass.providerId;
	if ( ! providerId ) {
		console.warn( 'Task class missing providerId, skipping:', TaskClass );
		return;
	}

	// Skip if already registered
	if ( taskProviders.has( providerId ) ) {
		return;
	}

	// Register the provider
	taskProviders.set( providerId, TaskClass );

	try {
		// Create instance
		const taskInstance = new TaskClass();

		// Check dependencies
		if (
			taskInstance.areDependenciesSatisfied &&
			typeof taskInstance.areDependenciesSatisfied === 'function'
		) {
			// For now, skip dependency checking - can be implemented later
			// const dependenciesSatisfied = await taskInstance.areDependenciesSatisfied( getTaskStatus );
			// if ( ! dependenciesSatisfied ) {
			// 	return;
			// }
		}

		// Check if task should be added
		if (
			! taskInstance.shouldAddTask ||
			typeof taskInstance.shouldAddTask !== 'function'
		) {
			console.warn(
				`Task provider "${ providerId }" missing shouldAddTask method`
			);
			return;
		}

		const shouldAdd = await taskInstance.shouldAddTask();
		if ( ! shouldAdd ) {
			return;
		}

		// Handle multi-task providers
		const isMultiTask =
			TaskClass.isMultiTask !== undefined ? TaskClass.isMultiTask : false;
		const hasGetTasksToInject =
			taskInstance.getTasksToInject &&
			typeof taskInstance.getTasksToInject === 'function';

		if ( isMultiTask || hasGetTasksToInject ) {
			if ( ! hasGetTasksToInject ) {
				console.warn(
					`Multi-task provider "${ providerId }" missing getTasksToInject method`
				);
				return;
			}

			const tasksToInject = await taskInstance.getTasksToInject();
			if ( ! Array.isArray( tasksToInject ) ) {
				console.warn(
					`getTasksToInject() for provider "${ providerId }" must return an array`
				);
				return;
			}

			// Process each task
			for ( const taskData of tasksToInject ) {
				await processTask(
					taskInstance,
					taskData,
					TaskClass,
					priority
				);
			}
		} else {
			// Single-task provider
			await processTask( taskInstance, {}, TaskClass, priority );
		}
	} catch ( error ) {
		console.error(
			`Error handling lifecycle for task provider "${ providerId }":`,
			error
		);
	}
}

/**
 * Process a single task: check existence, create if needed, render.
 *
 * @param {Object}   taskInstance The task instance.
 * @param {Object}   taskData     Optional task-specific data.
 * @param {Function} TaskClass    The task class.
 * @param {number}   priority     The task priority (for sorting).
 * @return {Promise<void>}
 */
async function processTask( taskInstance, taskData, TaskClass, priority = 50 ) {
	try {
		// Get task ID
		const taskId =
			taskInstance.getTaskId &&
			typeof taskInstance.getTaskId === 'function'
				? taskInstance.getTaskId( taskData )
				: TaskClass.providerId;

		// Check if task already exists
		const existingTask = await checkTaskExists( taskId );
		if ( existingTask ) {
			// Ensure priority is set on existing task
			if ( existingTask.prpl_priority === undefined ) {
				existingTask.prpl_priority = priority;
			}

			// Task exists, render it (or queue if callback not ready)
			if ( taskRenderCallback ) {
				taskRenderCallback( existingTask, priority );
			} else {
				// Queue for later rendering
				taskRenderQueue.push( { taskData: existingTask, priority } );
			}
			return;
		}

		// Get task details
		if (
			! taskInstance.getTaskDetails ||
			typeof taskInstance.getTaskDetails !== 'function'
		) {
			console.warn(
				`Task provider "${ TaskClass.providerId }" missing getTaskDetails method`
			);
			return;
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
				// Task created, now fetch it to render
				const createdTask = await checkTaskExists( taskId );
				if ( createdTask ) {
					// Ensure priority is set on newly created task
					if ( createdTask.prpl_priority === undefined ) {
						createdTask.prpl_priority = priority;
					}

					// Render it (or queue if callback not ready)
					if ( taskRenderCallback ) {
						taskRenderCallback( createdTask, priority );
					} else {
						// Queue for later rendering
						taskRenderQueue.push( {
							taskData: createdTask,
							priority,
						} );
					}
				}
			}
		} catch ( error ) {
			console.warn(
				`Error creating task "${ taskDetails.task_id }":`,
				error
			);
		}
	} catch ( error ) {
		console.error( 'Error processing task:', error );
	}
}

/**
 * Initialize the task registry to listen for registration actions.
 *
 * @return {void}
 */
function init() {
	// Listen for task registration actions
	// Note: We use a fixed priority here. Tasks pass their priority as a parameter.
	addAction(
		'prpl.tasks.register',
		'prpl/task-registry',
		( TaskClass, priority = 50 ) => {
			// Handle task lifecycle with the task's priority
			handleTaskLifecycle( TaskClass, priority ).catch( ( error ) => {
				console.error( 'Error in task lifecycle:', error );
			} );
		},
		10 // Fixed priority for the listener
	);
}

// Initialize on module load
init();
