/**
 * Yoast Fix Orphaned Content Task Provider.
 *
 * React implementation of the Yoast SEO fix orphaned content task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-fix-orphaned-content.php
 *
 * Note: This is a multi-task provider that creates one task per orphaned post.
 * Orphaned posts are posts without internal links pointing to them.
 */

import { __, sprintf } from '@wordpress/i18n';
import { TaskProvider } from '../../services/TaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Yoast Fix Orphaned Content Task Provider class.
 */
class YoastFixOrphanedContentTask extends TaskProvider {
	static providerId = 'yoast-fix-orphaned-content';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/fix-orphaned-content';
	static isMultiTask = true;

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const tasksToInject = await this.getTasksToInject();
			return tasksToInject && tasksToInject.length > 0;
		} catch ( error ) {
			console.error(
				'Error checking Yoast Fix Orphaned Content task condition:',
				error
			);
			return false;
		}
	}

	/**
	 * Get tasks to inject.
	 *
	 * Returns an array of taskData items, one for each orphaned post.
	 *
	 * @return {Promise<Array>} Promise resolving to array of taskData objects.
	 */
	async getTasksToInject() {
		try {
			const orphanedContent = await fetchDataCollector(
				'yoast_orphaned_content'
			);

			if ( ! orphanedContent ) {
				return [];
			}

			// Normalize to array.
			const orphanedArray = Array.isArray( orphanedContent )
				? orphanedContent
				: [ orphanedContent ];

			if ( orphanedArray.length === 0 ) {
				return [];
			}

			// Return array of taskData objects, one per orphaned post.
			return orphanedArray.map( ( post ) => ( {
				target_post_id: post.ID || post.id || post.post_id,
				target_post_title: post.post_title || post.title || '',
			} ) );
		} catch ( error ) {
			console.error(
				'Error getting tasks to inject for Yoast Fix Orphaned Content:',
				error
			);
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
		const targetPostTitle = taskData?.target_post_title || '';

		if ( ! targetPostId ) {
			throw new Error(
				'YoastFixOrphanedContentTask requires target_post_id in taskData'
			);
		}

		return this.buildTaskDetails( taskData, {
			post_title: sprintf(
				/* translators: %s: Post title. */
				__(
					'Yoast SEO: add internal links to article "%s"!',
					'progress-planner'
				),
				targetPostTitle
			),
			url: this.buildAdminUrl( 'post.php', {
				post: targetPostId,
				action: 'edit',
			} ),
			url_target: '_blank',
			target_post_id: targetPostId,
			target_post_title: targetPostTitle,
		} );
	}

	/**
	 * Add custom task actions.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData, actions ) {
		// Add "Learn more" link action.
		actions.push( {
			type: 'link',
			priority: 10,
			label: __(
				'Learn more about internal linking',
				'progress-planner'
			),
			url: 'https://prpl.fyi/fix-orphaned-content',
			target: '_blank',
		} );

		return actions;
	}
}

// Self-register this task provider.
registerTask( YoastFixOrphanedContentTask );

export default YoastFixOrphanedContentTask;
