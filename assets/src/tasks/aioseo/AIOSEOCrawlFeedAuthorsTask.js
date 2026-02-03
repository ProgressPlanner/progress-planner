/**
 * AIOSEO Crawl Feed Authors Task Provider.
 *
 * React implementation of the AIOSEO disable author RSS feeds task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-crawl-settings-feed-authors.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * AIOSEO Crawl Feed Authors Task Provider class.
 */
class AIOSEOCrawlFeedAuthorsTask extends InteractiveTaskProvider {
	static providerId = 'aioseo-crawl-settings-feed-authors';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl =
		'https://prpl.fyi/aioseo-crawl-optimization-feed-authors';
	static popoverId = 'aioseo-crawl-settings-feed-authors';

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
				authorCount >
				AIOSEOCrawlFeedAuthorsTask.MINIMUM_AUTHOR_WITH_POSTS
			) {
				return false;
			}

			// Show task if author feeds are not disabled (authors !== false).
			return aioseoOptions.crawlCleanup?.feeds?.authors !== false;
		} catch ( error ) {
			console.error(
				'Error checking AIOSEO Crawl Feed Authors task condition:',
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
				'All in One SEO: disable author RSS feeds',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=aioseo-search-appearance#/advanced'
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
		return __( 'Disable', 'progress-planner' );
	}
}

// Self-register this task provider.
registerTask( AIOSEOCrawlFeedAuthorsTask );

export default AIOSEOCrawlFeedAuthorsTask;
