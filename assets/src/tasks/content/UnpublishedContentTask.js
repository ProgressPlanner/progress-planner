/**
 * Unpublished Content Task Provider.
 *
 * React implementation of the Unpublished Content task.
 * Migrated from classes/suggested-tasks/providers/class-unpublished-content.php
 */

import { TaskProvider } from '../../services/TaskProvider';
import { doAction } from '@wordpress/hooks';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Unpublished Content Task Provider class.
 */
class UnpublishedContentTask extends TaskProvider {
	static providerId = 'unpublished-content';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 55;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static isRepetitive = false;
	static externalLinkUrl = 'https://prpl.fyi/check-unpublished-content';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Check for unpublished content via data collector.
			const unpublishedContent = await fetchDataCollector(
				'unpublished_content'
			);
			// Task should be added if there's unpublished content.
			return (
				unpublishedContent &&
				Array.isArray( unpublishedContent ) &&
				unpublishedContent.length > 0
			);
		} catch ( error ) {
			console.error(
				'Error checking Unpublished Content task condition:',
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
		const unpublishedContent = await fetchDataCollector(
			'unpublished_content'
		);

		// Build URL to posts list with draft filter.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }edit.php?post_status=draft&post_type=post`;

		// Get count of unpublished items for description.
		const count =
			unpublishedContent && Array.isArray( unpublishedContent )
				? unpublishedContent.length
				: 0;

		const description =
			count > 0
				? `You have ${ count } unpublished ${
						count === 1 ? 'item' : 'items'
				  } that might need attention.`
				: '';

		const StaticClass = this.constructor;
		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Review unpublished content',
			description,
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url,
			url_target: '_self',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
		};
	}

	/**
	 * Add custom task actions for Unpublished Content task.
	 *
	 * Adds an "Edit" action that links to the task URL (draft posts list).
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 *
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData = [], actions = [] ) {
		// Check for URL in meta or task data
		const url = taskData.meta?.prpl_url || taskData.url || null;

		if ( url ) {
			actions.push( {
				priority: 10,
				html: `<a class="prpl-tooltip-action-text" href="${ this.escapeHtml(
					url
				) }" target="_self">Edit</a>`,
			} );
		}

		return actions;
	}
}

// Self-register this task provider
doAction(
	'prpl.tasks.register',
	UnpublishedContentTask,
	UnpublishedContentTask.priority
);

export default UnpublishedContentTask;
