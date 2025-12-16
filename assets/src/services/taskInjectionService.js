/**
 * Task Injection Service.
 *
 * @deprecated This service is no longer used. Tasks now self-register via
 * WordPress hooks and handle their own lifecycle through taskRegistry.
 * See: assets/src/services/taskRegistry.js for the new streaming architecture.
 *
 * This file is kept for reference but should not be imported or used.
 * All task lifecycle management is now handled by taskRegistry.js.
 */

import { getAllTaskProviders } from './taskRegistry';
import { createTaskPost } from '../hooks/useTasksApi';

/**
 * Check if a task was already completed.
 *
 * @param {string} taskId The task ID.
 * @return {Promise<boolean>} Promise resolving to true if task was completed.
 */
// eslint-disable-next-line no-unused-vars
async function wasTaskCompleted( taskId ) {
	// This would need to query completed tasks history.
	// For now, we rely on the server-side check in the evaluation endpoint.
	return false;
}

/**
 * Get task status by task ID.
 *
 * @param {string} taskId The task ID.
 * @return {Promise<string>} Promise resolving to task status.
 */
// eslint-disable-next-line no-unused-vars
async function getTaskStatus( taskId ) {
	// This would query existing tasks to check status.
	// For now, return 'unknown' as placeholder.
	return 'unknown';
}

/**
 * Inject tasks from all registered task providers.
 *
 * Evaluates each registered task provider and creates task posts for tasks that should be added.
 * This is called when the SuggestedTasks widget mounts and periodically to check for new tasks.
 *
 * @return {Promise<Array>} Promise resolving to array of created task post IDs.
 */
export async function injectTasks() {
	const providers = getAllTaskProviders();
	const injectedTasks = [];

	for ( const provider of providers ) {
		try {
			// Handle both classes and instances
			const ProviderClass =
				typeof provider === 'function'
					? provider
					: provider.constructor;
			const providerInstance =
				typeof provider === 'function' ? new provider() : provider;

			// Get provider ID from static property or instance method
			const providerId =
				ProviderClass.providerId ||
				providerInstance.getProviderId?.() ||
				providerInstance.config?.providerId ||
				providerInstance.providerId ||
				provider.providerId;

			if ( ! providerId ) {
				console.warn( 'Task provider missing providerId, skipping' );
				continue;
			}

			// Check if this is a multi-task provider
			const isMultiTask =
				ProviderClass.isMultiTask !== undefined
					? ProviderClass.isMultiTask
					: providerInstance.config?.isMultiTask || false;
			const hasGetTasksToInject =
				providerInstance.getTasksToInject &&
				typeof providerInstance.getTasksToInject === 'function';

			// Check dependencies first.
			if (
				providerInstance.areDependenciesSatisfied &&
				typeof providerInstance.areDependenciesSatisfied === 'function'
			) {
				const dependenciesSatisfied =
					await providerInstance.areDependenciesSatisfied(
						getTaskStatus
					);
				if ( ! dependenciesSatisfied ) {
					continue;
				}
			}

			// Evaluate if task should be added.
			if (
				! providerInstance.shouldAddTask ||
				typeof providerInstance.shouldAddTask !== 'function'
			) {
				console.warn(
					`Task provider "${ providerId }" missing shouldAddTask method`
				);
				continue;
			}

			const shouldAdd = await providerInstance.shouldAddTask();
			if ( ! shouldAdd ) {
				continue;
			}

			// Handle multi-task providers
			if ( isMultiTask || hasGetTasksToInject ) {
				if ( ! hasGetTasksToInject ) {
					console.warn(
						`Multi-task provider "${ providerId }" missing getTasksToInject method`
					);
					continue;
				}

				// Get array of taskData items
				const tasksToInject = await providerInstance.getTasksToInject();

				if ( ! Array.isArray( tasksToInject ) ) {
					console.warn(
						`getTasksToInject() for provider "${ providerId }" must return an array`
					);
					continue;
				}

				// Create a task for each taskData item
				for ( const taskData of tasksToInject ) {
					try {
						// Get task ID for this specific task
						const taskId =
							providerInstance.getTaskId &&
							typeof providerInstance.getTaskId === 'function'
								? providerInstance.getTaskId( taskData )
								: `${ providerId }-${
										taskData.target_post_id ||
										taskData.target_term_id ||
										'unknown'
								  }`;

						// Check if task was already completed
						if ( await wasTaskCompleted( taskId ) ) {
							continue;
						}

						// Get task details for this specific task
						if (
							! providerInstance.getTaskDetails ||
							typeof providerInstance.getTaskDetails !==
								'function'
						) {
							console.warn(
								`Task provider "${ providerId }" missing getTaskDetails method`
							);
							continue;
						}

						const taskDetails =
							await providerInstance.getTaskDetails( taskData );

						// Ensure task_id is set
						if ( ! taskDetails.task_id ) {
							taskDetails.task_id = taskId;
						}

						// Ensure provider_id is set
						if ( ! taskDetails.provider_id ) {
							taskDetails.provider_id = providerId;
						}

						// Create task post via REST API
						try {
							const response =
								await createTaskPost( taskDetails );

							if (
								response &&
								response.success &&
								response.post_id
							) {
								injectedTasks.push( response.post_id );
							}
						} catch ( error ) {
							console.warn(
								`Error creating task "${ taskDetails.task_id }":`,
								error
							);
						}
					} catch ( error ) {
						console.warn(
							`Error processing task data for provider "${ providerId }":`,
							error
						);
					}
				}
			} else {
				// Single-task provider - existing behavior
				// Get task ID
				const taskId =
					providerInstance.getTaskId &&
					typeof providerInstance.getTaskId === 'function'
						? providerInstance.getTaskId()
						: providerId;

				// Check if task was already completed
				if ( await wasTaskCompleted( taskId ) ) {
					continue;
				}

				// Get task details
				if (
					! providerInstance.getTaskDetails ||
					typeof providerInstance.getTaskDetails !== 'function'
				) {
					console.warn(
						`Task provider "${ providerId }" missing getTaskDetails method`
					);
					continue;
				}

				const taskDetails = await providerInstance.getTaskDetails();

				// Ensure task_id is set
				if ( ! taskDetails.task_id ) {
					taskDetails.task_id = taskId;
				}

				// Ensure provider_id is set
				if ( ! taskDetails.provider_id ) {
					taskDetails.provider_id = providerId;
				}

				// Create task post via REST API
				try {
					const response = await createTaskPost( taskDetails );

					if ( response && response.success && response.post_id ) {
						injectedTasks.push( response.post_id );
					}
				} catch ( error ) {
					console.warn(
						`Error creating task "${ taskDetails.task_id }":`,
						error
					);
				}
			}
		} catch ( error ) {
			console.error(
				`Error injecting task for provider "${
					provider.providerId ||
					provider.config?.providerId ||
					( typeof provider === 'function'
						? provider.providerId
						: 'unknown' )
				}":`,
				error
			);
		}
	}

	return injectedTasks;
}
