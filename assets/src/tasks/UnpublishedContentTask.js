/**
 * Unpublished Content Task Provider.
 *
 * React implementation of the Unpublished Content task.
 * Migrated from classes/suggested-tasks/providers/class-unpublished-content.php
 */

import { TaskProvider } from '../services/TaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Unpublished Content Task Provider class.
 */
class UnpublishedContentTask extends TaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'unpublished-content',
			capability: 'edit_others_posts',
			isOnboardingTask: false,
			priority: 55,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			isRepetitive: false,
			externalLinkUrl: 'https://prpl.fyi/check-unpublished-content',
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

		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Review unpublished content',
			description,
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
		};
	}
}

const unpublishedContentTask = new UnpublishedContentTask();

export default unpublishedContentTask;
