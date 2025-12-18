/**
 * Site Icon Task Provider.
 *
 * React implementation of the Site Icon task.
 * Migrated from classes/suggested-tasks/providers/class-site-icon.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Site Icon Task Provider class.
 */
class SiteIconTask extends InteractiveTaskProvider {
	static providerId = 'core-siteicon';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 1;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/set-site-icon';
	static popoverId = 'core-siteicon';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Fetch WordPress settings to check if site_icon is set.
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			// Task should be added if site_icon is empty or 0.
			const siteIcon = settings?.site_icon;
			return ! siteIcon || siteIcon === '' || siteIcon === '0';
		} catch ( error ) {
			console.error( 'Error checking Site Icon task condition:', error );
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
		const taskId = this.getTaskId( taskData );

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Set site icon',
			url: this.buildAdminUrl( 'options-general.php', {
				'pp-focus-el': taskId,
			} ),
			link_setting: {
				hook: 'options-general.php',
				iconEl: '.site-icon-section th',
			},
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', SiteIconTask, SiteIconTask.priority );

export default SiteIconTask;
