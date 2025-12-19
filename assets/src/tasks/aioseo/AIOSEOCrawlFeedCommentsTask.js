/**
 * AIOSEO Crawl Feed Comments Task Provider.
 *
 * React implementation of the AIOSEO disable comment RSS feeds task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-crawl-settings-feed-comments.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * AIOSEO Crawl Feed Comments Task Provider class.
 */
class AIOSEOCrawlFeedCommentsTask extends InteractiveTaskProvider {
	static providerId = 'aioseo-crawl-settings-feed-comments';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl =
		'https://prpl.fyi/aioseo-crawl-optimization-feed-comments';
	static popoverId = 'aioseo-crawl-settings-feed-comments';

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

			// Show task if either globalComments or postComments feeds are enabled.
			const globalComments =
				aioseoOptions.crawlCleanup?.feeds?.globalComments;
			const postComments =
				aioseoOptions.crawlCleanup?.feeds?.postComments;

			// If both are false (disabled), task is complete.
			if ( globalComments === false && postComments === false ) {
				return false;
			}

			return true;
		} catch ( error ) {
			console.error(
				'Error checking AIOSEO Crawl Feed Comments task condition:',
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
				'All in One SEO: disable comment RSS feeds',
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
registerTask( AIOSEOCrawlFeedCommentsTask );

export default AIOSEOCrawlFeedCommentsTask;
