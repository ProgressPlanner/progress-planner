/**
 * Select Timezone Task Provider.
 *
 * React implementation of the Select Timezone task.
 * Migrated from classes/suggested-tasks/providers/class-select-timezone.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Select Timezone Task Provider class.
 */
class SelectTimezoneTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'select-timezone',
			capability: 'manage_options',
			isOnboardingTask: false,
			priority: 6,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/set-timezone',
			popoverId: 'select-timezone',
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
			// The PHP version checks activities:
			// query_activities(['category' => 'suggested_task', 'data_id' => 'select-timezone'])
			// If activity doesn't exist, task should be added.
			// TODO: Check activities via REST API or data collector.
			// For now, check if timezone is set to UTC (default).
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			const timezoneString = settings?.timezone_string || '';
			// If timezone_string is empty or UTC, show task.
			return ! timezoneString || timezoneString === 'UTC';
		} catch ( error ) {
			console.error(
				'Error checking Select Timezone task condition:',
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

		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-general.php?pp-focus-el=${ taskId }`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Set site timezone',
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
				iconEl: 'label[for="timezone_string"]',
			},
		};

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

const selectTimezoneTask = new SelectTimezoneTask();

export default selectTimezoneTask;
