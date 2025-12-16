/**
 * Disable Comments Task Provider.
 *
 * React implementation of the Disable Comments task.
 * Migrated from classes/suggested-tasks/providers/class-disable-comments.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Disable Comments Task Provider class.
 */
class DisableCommentsTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'disable-comments',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 9,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/disable-comments',
			popoverId: 'disable-comments',
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
			// The PHP version checks:
			// - !is_plugin_activated('comment-free-zone')
			// - wp_count_comments()->approved < 10
			// - get_default_comment_status() === 'open'
			// For React, we'll check comment status via REST API.
			// Plugin check and comment count would need data collector or REST endpoint.
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			// Check if default comment status is 'open'.
			const defaultCommentStatus =
				settings?.default_comment_status || 'open';
			return defaultCommentStatus === 'open';
		} catch ( error ) {
			console.error(
				'Error checking Disable Comments task condition:',
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
		const url = `${ adminUrl }${ separator }options-discussion.php`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Disable comments',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
			link_setting: {
				hook: 'options-discussion.php',
				iconEl: 'label[for="default_comment_status"]',
			},
		};

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

const disableCommentsTask = new DisableCommentsTask();

export default disableCommentsTask;
