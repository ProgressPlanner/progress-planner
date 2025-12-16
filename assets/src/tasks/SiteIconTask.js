/**
 * Site Icon Task Provider.
 *
 * React implementation of the Site Icon task.
 * Migrated from classes/suggested-tasks/providers/class-site-icon.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Site Icon Task Provider class.
 */
class SiteIconTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'core-siteicon',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 1,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/set-site-icon',
			popoverId: 'core-siteicon',
		} );
	}

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

		// Build URL to options-general.php with focus element.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-general.php?pp-focus-el=${ taskId }`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Set site icon',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			link_setting: {
				hook: 'options-general.php',
				iconEl: '.site-icon-section th',
			},
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Create singleton instance.
const siteIconTask = new SiteIconTask();

export default siteIconTask;
