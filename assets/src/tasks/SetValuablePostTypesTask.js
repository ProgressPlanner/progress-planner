/**
 * Set Valuable Post Types Task Provider.
 *
 * React implementation of the Set Valuable Post Types task.
 * Migrated from classes/suggested-tasks/providers/class-set-valuable-post-types.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';

/**
 * Set Valuable Post Types Task Provider class.
 */
class SetValuablePostTypesTask extends InteractiveTaskProvider {
	static providerId = 'set-valuable-post-types';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 70;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/valuable-content';
	static popoverId = 'set-valuable-post-types';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		// The PHP version checks if public post types have changed.
		// This is complex logic that monitors post type changes.
		// For React, we'll return true to show the task.
		// This can be refined with proper REST API endpoint or data collector.
		return true;
	}

	/**
	 * Get task details.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<Object>} Promise resolving to task details object.
	 */
	// eslint-disable-next-line no-unused-vars
	async getTaskDetails( taskData = {} ) {
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Set valuable content types',
			url: this.buildAdminUrl( 'admin.php', {
				page: 'progress-planner',
			} ),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( SetValuablePostTypesTask );

export default SetValuablePostTypesTask;
