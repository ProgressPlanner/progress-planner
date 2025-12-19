/**
 * Select Timezone Task Provider.
 *
 * React implementation of the Select Timezone task.
 * Migrated from classes/suggested-tasks/providers/class-select-timezone.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { cachedApiFetch } from '../services/apiFetchCache';

/**
 * Select Timezone Task Provider class.
 */
class SelectTimezoneTask extends InteractiveTaskProvider {
	static providerId = 'select-timezone';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 6;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/set-timezone';
	static popoverId = 'select-timezone';

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
			const settings = await cachedApiFetch( {
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

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: __( 'Set site timezone', 'progress-planner' ),
			url: this.buildAdminUrl( 'options-general.php', {
				'pp-focus-el': taskId,
			} ),
			link_setting: {
				hook: 'options-general.php',
				iconEl: 'label[for="timezone_string"]',
			},
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}

	/**
	 * Get the label for the popover action.
	 *
	 * @return {string} The action label.
	 */
	getPopoverActionLabel() {
		return __( 'Select timezone', 'progress-planner' );
	}
}

// Self-register this task provider
registerTask( SelectTimezoneTask );

export default SelectTimezoneTask;
