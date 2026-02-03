/**
 * AIOSEO Media Pages Task Provider.
 *
 * React implementation of the AIOSEO redirect media/attachment pages task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-media-pages.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * AIOSEO Media Pages Task Provider class.
 */
class AIOSEOMediaPagesTask extends InteractiveTaskProvider {
	static providerId = 'aioseo-media-pages';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/aioseo-media-pages';
	static popoverId = 'aioseo-media-pages';

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

			// Show task if redirect attachment URLs is not set to 'attachment'.
			return (
				aioseoOptions.attachment?.redirectAttachmentUrls !==
				'attachment'
			);
		} catch ( error ) {
			console.error(
				'Error checking AIOSEO Media Pages task condition:',
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
				'All in One SEO: redirect media/attachment pages to attachment',
				'progress-planner'
			),
			url: this.buildAdminUrl(
				'admin.php?page=aioseo-search-appearance#/media'
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
		return __( 'Redirect', 'progress-planner' );
	}
}

// Self-register this task provider.
registerTask( AIOSEOMediaPagesTask );

export default AIOSEOMediaPagesTask;
