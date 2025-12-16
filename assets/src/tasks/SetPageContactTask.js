/**
 * Set Page Contact Task Provider.
 *
 * React implementation of the Set Page Contact task.
 * Migrated from classes/suggested-tasks/providers/class-set-page-contact.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Set Page Contact Task Provider class.
 */
class SetPageContactTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'set-page-contact',
			capability: 'manage_options',
			isOnboardingTask: false,
			priority: 50,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			popoverId: 'set-page-contact',
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
			const response = await apiFetch( {
				path: '/progress-planner/v1/page-settings',
			} ).catch( () => null );

			if ( response && response.contact ) {
				return response.contact.isset === 'no';
			}

			return true;
		} catch ( error ) {
			console.error(
				'Error checking Set Page Contact task condition:',
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
		const url = `${ adminUrl }${ separator }edit.php?post_type=page`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Set the Contact page',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
		};

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

const setPageContactTask = new SetPageContactTask();

export default setPageContactTask;
