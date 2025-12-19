/**
 * Yoast Archive Format Task Provider.
 *
 * React implementation of the Yoast SEO disable format archives task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-archive-format.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Yoast Archive Format Task Provider class.
 */
class YoastArchiveFormatTask extends InteractiveTaskProvider {
	static providerId = 'yoast-format-archive';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/yoast-format-archive';
	static popoverId = 'yoast-format-archive';

	/**
	 * Minimum number of posts with format to show the task.
	 */
	static MINIMUM_POSTS_WITH_FORMAT = 3;

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

			// Check if task is relevant (few posts with format).
			const formatCount = await fetchDataCollector(
				'archive_format_count'
			);
			if (
				formatCount > YoastArchiveFormatTask.MINIMUM_POSTS_WITH_FORMAT
			) {
				return false;
			}

			// Show task if disable-post_format is not true.
			return (
				yoastOptions.wpseo_titles?.[ 'disable-post_format' ] !== true
			);
		} catch ( error ) {
			console.error(
				'Error checking Yoast Archive Format task condition:',
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
				'Yoast SEO: disable the format archives',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=wpseo_page_settings#/format-archives'
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
						'button[data-id="input-wpseo_titles-disable-post_format"]',
					attributeName: 'aria-checked',
					attributeValue: 'false',
					operator: '=',
				},
			},
		];
	}
}

// Self-register this task provider.
registerTask( YoastArchiveFormatTask );

export default YoastArchiveFormatTask;
