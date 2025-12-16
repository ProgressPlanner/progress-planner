/**
 * Email Sending Task Provider.
 *
 * React implementation of the Email Sending task.
 * Migrated from classes/suggested-tasks/providers/class-email-sending.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';

/**
 * Email Sending Task Provider class.
 */
class EmailSendingTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'sending-email',
			capability: 'manage_options',
			isOnboardingTask: false,
			priority: 4,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl:
				'https://prpl.fyi/check-if-your-websites-email-system-works',
			popoverId: 'sending-email',
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
		// The PHP version checks if wp_mail is filtered/overridden and if task was completed.
		// This requires server-side checking. For React, we'll return true.
		// This can be refined with proper data collector or REST API endpoint.
		return true;
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
		const url = `${ adminUrl }${ separator }admin.php?page=progress-planner`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: "Check if your website's email system works",
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

const emailSendingTask = new EmailSendingTask();

export default emailSendingTask;
