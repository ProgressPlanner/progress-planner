/**
 * Task Injection Service.
 *
 * Handles evaluation and injection of React-registered tasks.
 * This replaces the PHP-based task injection logic.
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
			// Get provider ID.
			const providerId =
				provider.getProviderId?.() ||
				provider.config?.providerId ||
				provider.providerId;

			if ( ! providerId ) {
				console.warn( 'Task provider missing providerId, skipping' );
				continue;
			}

			// Check dependencies first.
			if (
				provider.areDependenciesSatisfied &&
				typeof provider.areDependenciesSatisfied === 'function'
			) {
				const dependenciesSatisfied =
					await provider.areDependenciesSatisfied( getTaskStatus );
				if ( ! dependenciesSatisfied ) {
					continue;
				}
			}

			// Evaluate if task should be added.
			if (
				! provider.shouldAddTask ||
				typeof provider.shouldAddTask !== 'function'
			) {
				console.warn(
					`Task provider "${ providerId }" missing shouldAddTask method`
				);
				continue;
			}

			const shouldAdd = await provider.shouldAddTask();
			if ( ! shouldAdd ) {
				continue;
			}

			// Get task ID.
			const taskId =
				provider.getTaskId && typeof provider.getTaskId === 'function'
					? provider.getTaskId()
					: providerId;

			// Check if task was already completed.
			if ( await wasTaskCompleted( taskId ) ) {
				continue;
			}

			// Get task details.
			if (
				! provider.getTaskDetails ||
				typeof provider.getTaskDetails !== 'function'
			) {
				console.warn(
					`Task provider "${ providerId }" missing getTaskDetails method`
				);
				continue;
			}

			const taskDetails = await provider.getTaskDetails();

			// Ensure task_id is set.
			if ( ! taskDetails.task_id ) {
				taskDetails.task_id = taskId;
			}

			// Ensure provider_id is set.
			if ( ! taskDetails.provider_id ) {
				taskDetails.provider_id = providerId;
			}

			// Create task post via REST API.
			try {
				const response = await createTaskPost( taskDetails );

				// Response will have success: true and post_id if successful.
				// If task already exists or was completed, success will be false.
				if ( response && response.success && response.post_id ) {
					injectedTasks.push( response.post_id );
				}
			} catch ( error ) {
				// Log error but continue with other tasks.
				console.warn(
					`Error creating task "${ taskDetails.task_id }":`,
					error
				);
			}
		} catch ( error ) {
			console.error(
				`Error injecting task for provider "${
					provider.providerId ||
					provider.config?.providerId ||
					'unknown'
				}":`,
				error
			);
		}
	}

	return injectedTasks;
}
