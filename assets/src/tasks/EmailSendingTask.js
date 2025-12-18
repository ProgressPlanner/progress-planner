/**
 * Email Sending Task Provider.
 *
 * React implementation of the Email Sending task.
 * Migrated from classes/suggested-tasks/providers/class-email-sending.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';

/**
 * Email Sending Task Provider class.
 */
class EmailSendingTask extends InteractiveTaskProvider {
	static providerId = 'sending-email';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 4;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl =
		'https://prpl.fyi/check-if-your-websites-email-system-works';
	static popoverId = 'sending-email';

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
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: "Check if your website's email system works",
			url: this.buildAdminUrl( 'admin.php', {
				page: 'progress-planner',
			} ),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( EmailSendingTask );

export default EmailSendingTask;
