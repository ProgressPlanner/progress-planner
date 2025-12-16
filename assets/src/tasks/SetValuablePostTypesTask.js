/**
 * Set Valuable Post Types Task Provider.
 *
 * React implementation of the Set Valuable Post Types task.
 * Migrated from classes/suggested-tasks/providers/class-set-valuable-post-types.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';

/**
 * Set Valuable Post Types Task Provider class.
 */
class SetValuablePostTypesTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'set-valuable-post-types',
			capability: 'manage_options',
			isOnboardingTask: false,
			priority: 70,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/valuable-content',
			popoverId: 'set-valuable-post-types',
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
		// The PHP version checks if public post types have changed.
		// This is complex logic that monitors post type changes.
		// For React, we'll return true to show the task.
		// This can be refined with proper REST API endpoint or data collector.
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
			post_title: 'Set valuable content types',
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

const setValuablePostTypesTask = new SetValuablePostTypesTask();

export default setValuablePostTypesTask;
