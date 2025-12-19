/**
 * AIOSEO Archive Date Task Provider.
 *
 * React implementation of the AIOSEO noindex date archive task.
 * Migrated from classes/suggested-tasks/providers/integrations/aioseo/class-archive-date.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../../services/InteractiveTaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * AIOSEO Archive Date Task Provider class.
 */
class AIOSEOArchiveDateTask extends InteractiveTaskProvider {
	static providerId = 'aioseo-date-archive';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/aioseo-date-archive';
	static popoverId = 'aioseo-date-archive';

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

			// Check if task is relevant (permalink doesn't have date tokens).
			const permalinkHasDate =
				await fetchDataCollector( 'permalink_has_date' );
			if ( permalinkHasDate ) {
				return false;
			}

			// Show task if date archive show is true (not disabled).
			return aioseoOptions.archives?.date?.show === true;
		} catch ( error ) {
			console.error(
				'Error checking AIOSEO Archive Date task condition:',
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
				'All in One SEO: noindex the date archive',
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
registerTask( AIOSEOArchiveDateTask );

export default AIOSEOArchiveDateTask;
