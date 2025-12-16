/**
 * Set Page About Task Provider.
 *
 * React implementation of the Set Page About task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-about.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Set Page About Task Provider class.
 */
class SetPageAboutTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'set-page-about',
			capability: 'manage_options',
			isOnboardingTask: false,
			priority: 50,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			popoverId: 'set-page-about',
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

			// Fallback: return true to show task (can be refined when endpoint is available).
			return true;
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
		const taskId = this.getTaskId( taskData );

		// Build URL to pages list.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }edit.php?post_type=page`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Set the About page',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Create singleton instance.
const setPageAboutTask = new SetPageAboutTask();

export default setPageAboutTask;
