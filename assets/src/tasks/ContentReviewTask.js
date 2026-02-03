/**
 * Content Review Task Provider.
 *
 * React implementation of the Content Review task.
 * Migrated from classes/suggested-tasks/providers/class-content-review.php
 *
 * Multi-task provider that creates tasks for posts that need review.
 * Important pages are checked after 6 months, regular posts after 12 months.
 */

import { __, sprintf } from '@wordpress/i18n';
import { TaskProvider } from '../services/TaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

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
		try {
			const postsForReview = await fetchDataCollector(
				'old_posts_for_review'
			);

			if ( ! postsForReview || postsForReview.length === 0 ) {
				return [];
			}

			// Map posts to taskData objects for multi-task injection.
			return postsForReview.map( ( post ) => ( {
				target_post_id: post.ID,
				target_post_title: post.post_title,
				target_post_type: post.post_type,
			} ) );
		} catch ( error ) {
			console.error( 'Error getting posts for review:', error );
			return [];
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
		const targetPostId = taskData?.target_post_id || null;
		const targetPostTitle = taskData?.target_post_title || null;

		if ( ! targetPostId ) {
			throw new Error(
				'ContentReviewTask requires target_post_id in taskData'
			);
		}

		// Use post title if available, otherwise fall back to generic title.
		const postTitle = targetPostTitle
			? sprintf(
					/* translators: %s: post title */
					__( 'Review: %s', 'progress-planner' ),
					targetPostTitle
			  )
			: sprintf(
					/* translators: %d: post ID */
					__( 'Review post #%d', 'progress-planner' ),
					targetPostId
			  );

		return this.buildTaskDetails( taskData, {
			post_title: postTitle,
			url: this.buildAdminUrl( 'post.php', {
				post: targetPostId,
				action: 'edit',
			} ),
			url_target: '_blank',
			target_post_id: targetPostId,
		} );
	}

	/**
	 * Add custom task actions for Content Review task.
	 *
	 * Adds a "Review" action that links to the post edit page.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 *
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData = [], actions = [] ) {
		const targetPostId =
			taskData.target_post_id || taskData.meta?.target_post_id || null;

		if ( targetPostId ) {
			actions.push( {
				type: 'link',
				priority: 10,
				href: this.buildAdminUrl( 'post.php', {
					action: 'edit',
					post: targetPostId,
				} ),
				label: __( 'Review', 'progress-planner' ),
				target: '_self',
			} );
		}

		return actions;
	}
}

// Self-register this task provider
registerTask( ContentReviewTask );

export default ContentReviewTask;
