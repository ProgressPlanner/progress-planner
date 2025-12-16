/**
 * Improve PDF Handling Task Provider.
 *
 * React implementation of the Improve PDF Handling task.
 * Migrated from classes/suggested-tasks/providers/class-improve-pdf-handling.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';

/**
 * Improve PDF Handling Task Provider class.
 */
class ImprovePdfHandlingTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'improve-pdf-handling',
			capability: 'manage_options',
			isOnboardingTask: false,
			priority: 1,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/improve-pdf-handling',
			popoverId: 'improve-pdf-handling',
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
		// The PHP version checks if there are more than 10 PDF files.
		// This requires querying attachments with mime type 'application/pdf'.
		// For React, we'll return true to show the task.
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
			post_title: 'Improve PDF handling',
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

const improvePdfHandlingTask = new ImprovePdfHandlingTask();

export default improvePdfHandlingTask;
