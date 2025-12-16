/**
 * Remove Inactive Plugins Task Provider.
 *
 * React implementation of the Remove Inactive Plugins task.
 * Migrated from classes/suggested-tasks/providers/class-remove-inactive-plugins.php
 */

import { TaskProvider } from '../services/TaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Remove Inactive Plugins Task Provider class.
 */
class RemoveInactivePluginsTask extends TaskProvider {
	static providerId = 'remove-inactive-plugins';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 60;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/remove-inactive-plugins';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const inactivePluginsCount = await fetchDataCollector(
				'inactive_plugins_count'
			);
			return inactivePluginsCount > 0;
		} catch ( error ) {
			console.error(
				'Error checking Remove Inactive Plugins task condition:',
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

		// Build URL to plugins.php with inactive filter.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }plugins.php?plugin_status=inactive`;

		const StaticClass = this.constructor;
		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Remove inactive plugins',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: StaticClass.parent || 0,
			url,
			url_target: '_self',
			dismissable:
				StaticClass.isDismissable !== undefined
					? StaticClass.isDismissable
					: this.config.isDismissable,
			external_link_url:
				StaticClass.externalLinkUrl || this.config.externalLinkUrl,
		};
	}
}

export default RemoveInactivePluginsTask;
