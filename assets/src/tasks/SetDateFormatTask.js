/**
 * Set Date Format Task Provider.
 *
 * React implementation of the Set Date Format task.
 * Migrated from classes/suggested-tasks/providers/class-set-date-format.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Set Date Format Task Provider class.
 */
class SetDateFormatTask extends InteractiveTaskProvider {
	static providerId = 'set-date-format';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 7;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static popoverId = 'set-date-format';

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
			// query_activities(['category' => 'suggested_task', 'data_id' => 'set-date-format'])
			// If activity doesn't exist, task should be added.
			// Also checks if date_format is 'wp_default' (default value).
			// TODO: Check activities via REST API or data collector.
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			const dateFormat = settings?.date_format || '';
			// If date_format is empty or default, show task.
			return ! dateFormat || dateFormat === 'wp_default';
		} catch ( error ) {
			console.error(
				'Error checking Set Date Format task condition:',
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
			post_title: 'Set site date format',
			description:
				'Setting the date format correctly on your site is valuable. By setting the correct date format, you ensure the dates are displayed correctly in the admin area and the front end.',
			url: this.buildAdminUrl( 'options-general.php', {
				'pp-focus-el': taskId,
			} ),
			link_setting: {
				hook: 'options-general.php',
				iconEl: 'tr:has(input[name="date_format"]) th',
			},
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction(
	'prpl.tasks.register',
	SetDateFormatTask,
	SetDateFormatTask.priority
);

export default SetDateFormatTask;
