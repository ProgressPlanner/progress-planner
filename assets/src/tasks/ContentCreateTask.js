/**
 * Content Create Task Provider.
 *
 * React implementation of the Content Create task.
 * Migrated from classes/suggested-tasks/providers/class-content-create.php
 */

import { TaskProvider } from '../services/TaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Content Create Task Provider class.
 */
class ContentCreateTask extends TaskProvider {
	static providerId = 'create-post';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static isRepetitive = true;
	static externalLinkUrl = 'https://prpl.fyi/valuable-content';

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
		// Get last published post data if available.
		const lastPublishedPost = await fetchDataCollector(
			'last_published_post_id'
		);
		const targetPostId = lastPublishedPost?.post_id || null;

		return this.buildTaskDetails( taskData, {
			post_title: 'Create valuable content',
			url: 'https://prpl.fyi/valuable-content',
			url_target: '_blank',
			target_post_id: targetPostId,
		} );
	}
}

// Self-register this task provider
registerTask( ContentCreateTask );

export default ContentCreateTask;
