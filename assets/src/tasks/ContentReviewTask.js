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
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'review-post',
			capability: 'edit_others_posts',
			isOnboardingTask: false,
			priority: 10,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			isRepetitive: true,
			externalLinkUrl: 'https://prpl.fyi/review-post',
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
		// The PHP version creates multiple tasks for posts that need review.
		// This is complex multi-task logic that requires:
		// - Querying posts that need review
		// - Creating multiple tasks (one per post)
		// For React, this would need special handling.
		// TODO: Implement multi-task provider pattern for React.
		// For now, return false (task won't show) until multi-task pattern is implemented.
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

		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: `Review post #${ targetPostId }`,
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_blank',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			target_post_id: targetPostId,
		};
	}
}

const contentReviewTask = new ContentReviewTask();

export default contentReviewTask;
