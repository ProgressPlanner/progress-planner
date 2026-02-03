/**
 * Yoast Archive Author Task Provider.
 *
 * React implementation of the Yoast SEO disable author archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-archive-author.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Yoast Archive Author Task Provider class.
 */
class YoastArchiveAuthorTask extends InteractiveTaskProvider {
	static providerId = 'yoast-author-archive';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/yoast-author-archive';
	static popoverId = 'yoast-author-archive';

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
			const yoastOptions = await fetchDataCollector( 'yoast_options' );

			// If Yoast is not active, don't add the task.
			if ( ! yoastOptions ) {
				return false;
			}

			// Check if task is relevant (single author site).
			const authorCount = await fetchDataCollector( 'post_author_count' );
			if (
				authorCount > YoastArchiveAuthorTask.MINIMUM_AUTHOR_WITH_POSTS
			) {
				return false;
			}

			// Show task if disable-author is not true.
			return yoastOptions.wpseo_titles?.[ 'disable-author' ] !== true;
		} catch ( error ) {
			console.error(
				'Error checking Yoast Archive Author task condition:',
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
				'Yoast SEO: disable the author archive',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=wpseo_page_settings#/author-archives'
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

	/**
	 * Get focus tasks configuration.
	 *
	 * @return {Array} Array of focus task configurations.
	 */
	getFocusTasks() {
		return [
			{
				iconElement: '.yst-toggle-field__header',
				valueElement: {
					elementSelector:
						'button[data-id="input-wpseo_titles-disable-author"]',
					attributeName: 'aria-checked',
					attributeValue: 'false',
					operator: '=',
				},
			},
		];
	}
}

// Self-register this task provider.
registerTask( YoastArchiveAuthorTask );

export default YoastArchiveAuthorTask;
