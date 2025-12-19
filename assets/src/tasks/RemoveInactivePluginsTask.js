/**
 * Remove Inactive Plugins Task Provider.
 *
 * React implementation of the Remove Inactive Plugins task.
 * Migrated from classes/suggested-tasks/providers/class-remove-inactive-plugins.php
 */

import { __ } from '@wordpress/i18n';
import { TaskProvider } from '../services/TaskProvider';
import { registerTask } from '../services/taskRegistry';
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
	static isDismissable = false;
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
		return this.buildTaskDetails( taskData, {
			post_title: __( 'Remove inactive plugins', 'progress-planner' ),
			url: this.buildAdminUrl( 'plugins.php', {
				plugin_status: 'inactive',
			} ),
		} );
	}

	/**
	 * Add task actions for this task.
	 *
	 * @param {Object} taskData Task data object.
	 * @param {Array}  actions  Existing actions array.
	 * @return {Array} Modified actions array.
	 */
	addTaskActions( taskData, actions ) {
		actions.push( {
			type: 'link',
			priority: 10,
			href: this.buildAdminUrl( 'plugins.php', {
				plugin_status: 'inactive',
			} ),
			label: __( 'Go to the "Plugins" page', 'progress-planner' ),
			target: '_self',
		} );
		return actions;
	}
}

// Self-register this task provider
registerTask( RemoveInactivePluginsTask );

export default RemoveInactivePluginsTask;
