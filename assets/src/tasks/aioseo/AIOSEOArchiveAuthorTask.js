/**
 * AIOSEO Archive Author Task Provider.
 *
 * React implementation of the AIOSEO noindex author archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-archive-author.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * AIOSEO Archive Author Task Provider class.
 */
class AIOSEOArchiveAuthorTask extends InteractiveTaskProvider {
	static providerId = 'aioseo-author-archive';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/aioseo-author-archive';
	static popoverId = 'aioseo-author-archive';

	/**
	 * Minimum number of authors with posts to show the task.
	 */
	static MINIMUM_AUTHOR_WITH_POSTS = 1;

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const aioseoOptions = await fetchDataCollector( 'aioseo_options' );

			// If AIOSEO is not active, don't add the task.
			if ( ! aioseoOptions ) {
				return false;
			}

			// Check if task is relevant (single author site).
			const authorCount = await fetchDataCollector( 'post_author_count' );
			if (
				authorCount > AIOSEOArchiveAuthorTask.MINIMUM_AUTHOR_WITH_POSTS
			) {
				return false;
			}

			// Show task if author archive show is true (not disabled).
			return aioseoOptions.archives?.author?.show === true;
		} catch ( error ) {
			console.error(
				'Error checking AIOSEO Archive Author task condition:',
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
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: __(
				'All in One SEO: noindex the author archive',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=aioseo-search-appearance#/archives'
			),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}

	/**
	 * Get the label for the popover action.
	 *
	 * @return {string} The action label.
	 */
	getPopoverActionLabel() {
		return __( 'Noindex', 'progress-planner' );
	}
}

// Self-register this task provider.
registerTask( AIOSEOArchiveAuthorTask );

export default AIOSEOArchiveAuthorTask;
