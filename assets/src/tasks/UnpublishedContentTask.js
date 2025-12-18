/**
 * Unpublished Content Task Provider.
 *
 * React implementation of the Unpublished Content task.
 * Migrated from classes/suggested-tasks/providers/class-unpublished-content.php
 */

import { TaskProvider } from '../services/TaskProvider';
import { doAction } from '@wordpress/hooks';
import { fetchDataCollector } from '../hooks/useTasksApi';

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
		const unpublishedContent = await fetchDataCollector(
			'unpublished_content'
		);

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

		return this.buildTaskDetails( taskData, {
			post_title: 'Review unpublished content',
			description,
			url: this.buildAdminUrl( 'edit.php', {
				post_status: 'draft',
				post_type: 'post',
			} ),
		} );
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
