/**
 * Set Page About Task Provider.
 *
 * React implementation of the Set Page About task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-about.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import apiFetch from '@wordpress/api-fetch';

/**
 * Set Page About Task Provider class.
 */
class SetPageAboutTask extends InteractiveTaskProvider {
	static providerId = 'set-page-about';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static popoverId = 'set-page-about';

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
			// The PHP version uses progress_planner()->get_admin__page_settings()->get_settings()
			// which checks if pages[PAGE_NAME]['isset'] === 'no'
			// For now, we'll need to create a data collector or REST endpoint for this.
			// As a temporary solution, we'll check via a custom endpoint if available.
			// TODO: Create data collector or REST endpoint for page settings.
			const response = await apiFetch( {
				path: '/progress-planner/v1/page-settings',
			} ).catch( () => null );

			if ( response && response.about ) {
				return response.about.isset === 'no';
			}

			// If API fails or about not in response, don't show the task.
			return false;
		} catch ( error ) {
			console.error(
				'Error checking Set Page About task condition:',
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
			post_title: 'Set the About page',
			url: this.buildAdminUrl( 'edit.php', { post_type: 'page' } ),
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( SetPageAboutTask );

export default SetPageAboutTask;
