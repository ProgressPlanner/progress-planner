/**
 * Debug Display Task Provider.
 *
 * React implementation of the Debug Display task.
 * Migrated from classes/suggested-tasks/providers/class-debug-display.php
 *
 * Checks if WP_DEBUG and WP_DEBUG_DISPLAY are both enabled (security concern).
 */

import { TaskProvider } from '../services/TaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Debug Display Task Provider class.
 */
class DebugDisplayTask extends TaskProvider {
	static providerId = 'wp-debug-display';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 10;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/set-wp-debug';

	/**
	 * Check if the task should be added.
	 *
	 * Task should be added if both WP_DEBUG and WP_DEBUG_DISPLAY are enabled.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const debugStatus = await fetchDataCollector( 'wp_debug_status' );

			if ( ! debugStatus ) {
				return false;
			}

			// Task should be shown if debug display is publicly visible.
			return debugStatus.should_fix === true;
		} catch ( error ) {
			console.error(
				'Error checking Debug Display task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Get task details.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		return this.buildTaskDetails( taskData, {
			post_title: 'Disable public display of PHP errors',
		} );
	}
}

// Self-register this task provider
registerTask( DebugDisplayTask );

export default DebugDisplayTask;
