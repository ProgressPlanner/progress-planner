/**
 * Content Review Task Provider.
 *
 * React implementation of the Content Review task.
 * Migrated from classes/suggested-tasks/providers/class-content-review.php
 *
 * Note: This is a multi-task provider that creates multiple tasks.
 * Basic implementation - can be refined with proper data collection.
 */

import { TaskProvider } from '../services/TaskProvider';

/**
 * Content Review Task Provider class.
 */
class ContentReviewTask extends TaskProvider {
	static providerId = 'review-post';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 10;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static isRepetitive = true;
	static externalLinkUrl = 'https://prpl.fyi/review-post';
	static isMultiTask = true;

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		// Check if there are any posts that need review.
		// The getTasksToInject() method will return the actual list of posts.
		try {
			const tasksToInject = await this.getTasksToInject();
			return tasksToInject && tasksToInject.length > 0;
		} catch ( error ) {
			console.error(
				'Error checking Content Review task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Get tasks to inject.
	 *
	 * Returns an array of taskData items, one for each post that needs review.
	 *
	 * @return {Promise<Array>} Promise resolving to array of taskData objects.
	 */
	async getTasksToInject() {
		// TODO: Implement proper data collection to get posts that need review.
		// For now, return empty array. This should be replaced with actual data collection.
		// The PHP version queries posts older than 12 months (or 6 months for important pages).
		return [];
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
		const targetPostId = taskData?.target_post_id || null;

		if ( ! targetPostId ) {
			throw new Error(
				'ContentReviewTask requires target_post_id in taskData'
			);
		}

		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }post.php?post=${ targetPostId }&action=edit`;

		const StaticClass = this.constructor;
		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: `Review post #${ targetPostId }`,
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url,
			url_target: '_blank',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
			target_post_id: targetPostId,
		};
	}
}

export default ContentReviewTask;
