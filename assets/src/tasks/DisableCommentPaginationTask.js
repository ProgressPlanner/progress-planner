/**
 * Disable Comment Pagination Task Provider.
 *
 * React implementation of the Disable Comment Pagination task.
 * Migrated from classes/suggested-tasks/providers/class-disable-comment-pagination.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Disable Comment Pagination Task Provider class.
 */
class DisableCommentPaginationTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'disable-comment-pagination',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 10,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/disable-comment-pagination',
			popoverId: 'disable-comment-pagination',
		} );
	}

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
			const settings = await apiFetch( {
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
		const taskId = this.getTaskId( taskData );

		// Build URL to options-discussion.php.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-discussion.php`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Disable comment pagination',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			link_setting: {
				hook: 'options-discussion.php',
				iconEl: 'label[for="page_comments"]',
			},
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Create singleton instance.
const disableCommentPaginationTask = new DisableCommentPaginationTask();

export default disableCommentPaginationTask;
