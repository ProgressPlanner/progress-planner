/**
 * Yoast Crawl Emoji Scripts Task Provider.
 *
 * React implementation of the Yoast SEO remove emoji scripts task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-crawl-settings-emoji-scripts.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Yoast Crawl Emoji Scripts Task Provider class.
 */
class YoastCrawlEmojiScriptsTask extends InteractiveTaskProvider {
	static providerId = 'yoast-crawl-settings-emoji-scripts';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl =
		'https://prpl.fyi/yoast-crawl-optimization-emoji-scripts';
	static popoverId = 'yoast-crawl-settings-emoji-scripts';

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

			// Show task if remove_emoji_scripts is not enabled.
			return ! yoastOptions.wpseo?.remove_emoji_scripts;
		} catch ( error ) {
			console.error(
				'Error checking Yoast Crawl Emoji Scripts task condition:',
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
				'Yoast SEO: remove emoji scripts',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=wpseo_page_settings#/crawl-optimization#input-wpseo-remove_emoji_scripts'
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
		return __( 'Remove', 'progress-planner' );
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
						'button[data-id="input-wpseo-remove_emoji_scripts"]',
					attributeName: 'aria-checked',
					attributeValue: 'true',
					operator: '=',
				},
			},
		];
	}
}

// Self-register this task provider.
registerTask( YoastCrawlEmojiScriptsTask );

export default YoastCrawlEmojiScriptsTask;
