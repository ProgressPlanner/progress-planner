/**
 * Content Create Task Provider.
 *
 * React implementation of the Content Create task.
 * Migrated from classes/suggested-tasks/providers/class-content-create.php
 */

import { TaskProvider } from '../services/TaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Content Create Task Provider class.
 */
class ContentCreateTask extends TaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'create-post',
			capability: 'edit_others_posts',
			isOnboardingTask: false,
			priority: 50,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			isRepetitive: true,
			externalLinkUrl: 'https://prpl.fyi/valuable-content',
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
			// Check when the last post was published.
			// The PHP version checks if last published post is older than 30 days.
			// For React, we'll fetch the last published post data.
			const lastPublishedPost = await fetchDataCollector(
				'last_published_post_id'
			);

			if ( ! lastPublishedPost || ! lastPublishedPost.post_id ) {
				// No posts published, should show task.
				return true;
			}

			// Check if post is older than 30 days.
			// The data collector might return the post date, but for now we'll return true.
			// This can be refined when we have the full data structure.
			return true;
		} catch ( error ) {
			console.error(
				'Error checking Content Create task condition:',
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

		// Get last published post data if available.
		const lastPublishedPost = await fetchDataCollector(
			'last_published_post_id'
		);
		const targetPostId = lastPublishedPost?.post_id || null;

		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Create valuable content',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url: 'https://prpl.fyi/valuable-content',
			url_target: '_blank',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			target_post_id: targetPostId,
		};
	}
}

const contentCreateTask = new ContentCreateTask();

export default contentCreateTask;
