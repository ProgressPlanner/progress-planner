/**
 * Permalink Structure Task Provider.
 *
 * React implementation of the Permalink Structure task.
 * Migrated from classes/suggested-tasks/providers/class-permalink-structure.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Permalink Structure Task Provider class.
 */
class PermalinkStructureTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'core-permalink-structure',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 3,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl:
				'https://prpl.fyi/change-default-permalink-structure',
			popoverId: 'core-permalink-structure',
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
			// Fetch WordPress settings to check permalink structure.
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			const permalinkStructure = settings?.permalink_structure || '';

			// Task should be added if permalink structure is the default day-based one.
			return (
				permalinkStructure === '/%year%/%monthnum%/%day%/%postname%/' ||
				permalinkStructure ===
					'/index.php/%year%/%monthnum%/%day%/%postname%/'
			);
		} catch ( error ) {
			console.error(
				'Error checking Permalink Structure task condition:',
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
		const taskId = this.getTaskId( taskData );

		// Build URL to options-permalink.php.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-permalink.php`;

		// Determine icon element based on current permalink structure.
		// This would need to be fetched from settings, but for now use default.
		const linkSetting = {
			hook: 'options-permalink.php',
			iconEl: 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]',
		};

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Set permalink structure',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			link_setting: linkSetting,
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Create singleton instance.
const permalinkStructureTask = new PermalinkStructureTask();

export default permalinkStructureTask;
