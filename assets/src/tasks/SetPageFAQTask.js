/**
 * Set Page FAQ Task Provider.
 *
 * React implementation of the Set Page FAQ task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-faq.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Set Page FAQ Task Provider class.
 */
class SetPageFAQTask extends InteractiveTaskProvider {
	static providerId = 'set-page-faq';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static popoverId = 'set-page-faq';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Check page settings via Progress Planner REST API.
			const response = await apiFetch( {
				path: '/progress-planner/v1/page-settings',
			} ).catch( () => null );

			if ( response && response.faq ) {
				return response.faq.isset === 'no';
			}

			// Fallback: return true to show task.
			return true;
		} catch ( error ) {
			console.error(
				'Error checking Set Page FAQ task condition:',
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
			post_title: 'Set the FAQ page',
			url: this.buildAdminUrl( 'edit.php', { post_type: 'page' } ),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', SetPageFAQTask, SetPageFAQTask.priority );

export default SetPageFAQTask;
