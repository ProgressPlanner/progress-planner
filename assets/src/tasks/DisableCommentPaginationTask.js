/**
 * Disable Comment Pagination Task Provider.
 *
 * React implementation of the Disable Comment Pagination task.
 * Migrated from classes/suggested-tasks/providers/class-disable-comment-pagination.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { cachedApiFetch } from '../services/apiFetchCache';

/**
 * Disable Comment Pagination Task Provider class.
 */
class DisableCommentPaginationTask extends InteractiveTaskProvider {
	static providerId = 'disable-comment-pagination';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 10;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/disable-comment-pagination';
	static popoverId = 'disable-comment-pagination';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Check if dependencies are satisfied (disable-comments task must be completed).
			// For now, we'll check if page_comments is enabled, which is the condition.
			// The dependency check would require checking task completion status via REST API.
			const settings = await cachedApiFetch( {
				path: '/wp/v2/settings',
			} );

			// Task should be added if page_comments option is enabled (true).
			// Note: The PHP version checks dependencies via are_dependencies_satisfied(),
			// but for React we'll rely on the simple condition check.
			return settings?.page_comments === true;
		} catch ( error ) {
			console.error(
				'Error checking Disable Comment Pagination task condition:',
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
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Disable comment pagination',
			url: this.buildAdminUrl( 'options-discussion.php' ),
			link_setting: {
				hook: 'options-discussion.php',
				iconEl: 'label[for="page_comments"]',
			},
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( DisableCommentPaginationTask );

export default DisableCommentPaginationTask;
