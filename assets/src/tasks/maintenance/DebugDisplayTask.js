/**
 * Debug Display Task Provider.
 *
 * React implementation of the Debug Display task.
 * Migrated from classes/suggested-tasks/providers/class-debug-display.php
 *
 * Note: This requires server-side checking of PHP constants (WP_DEBUG, WP_DEBUG_DISPLAY).
 * A data collector or REST API endpoint would be needed for full implementation.
 */

import { TaskProvider } from '../../services/TaskProvider';
import { doAction } from '@wordpress/hooks';

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
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		// The PHP version checks: defined('WP_DEBUG') && WP_DEBUG && defined('WP_DEBUG_DISPLAY') && WP_DEBUG_DISPLAY
		// This requires server-side checking of PHP constants.
		// TODO: Create data collector or REST API endpoint to check WP_DEBUG and WP_DEBUG_DISPLAY.
		// For now, return false (task won't show) until data collector is implemented.
		return false;
	}

	/**
	 * Get task details.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		const taskId = this.getTaskId( taskData );

		const StaticClass = this.constructor;
		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Disable public display of PHP errors',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url: '',
			url_target: '_self',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
		};
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', DebugDisplayTask, DebugDisplayTask.priority );

export default DebugDisplayTask;
