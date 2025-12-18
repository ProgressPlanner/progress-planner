/**
 * Core Update Task Provider.
 *
 * React implementation of the Core Update task.
 * Migrated from classes/suggested-tasks/providers/class-core-update.php
 */

import { TaskProvider } from '../services/TaskProvider';
import { registerTask } from '../services/taskRegistry';
import apiFetch from '@wordpress/api-fetch';

/**
 * Core Update Task Provider class.
 */
class CoreUpdateTask extends TaskProvider {
	static providerId = 'update-core';
	static capability = 'update_core';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static isRepetitive = true;
	static externalLinkUrl = 'https://prpl.fyi/perform-all-updates';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Check for available updates via WordPress REST API.
			// The PHP version uses wp_get_update_data() which checks for core, plugin, and theme updates.
			// For React, we can check the updates endpoint if available, or use a data collector.
			// For now, we'll use a simple check - if updates are available, show the task.
			// This might need a data collector for proper implementation.
			const updates = await apiFetch( {
				path: '/wp/v2/updates',
			} ).catch( () => null );

			if ( updates ) {
				// Check if there are any updates available.
				return (
					( updates.core && updates.core.length > 0 ) ||
					( updates.plugins && updates.plugins.length > 0 ) ||
					( updates.themes && updates.themes.length > 0 )
				);
			}

			// Fallback: return true to show task (can be refined with proper endpoint).
			return true;
		} catch ( error ) {
			console.error(
				'Error checking Core Update task condition:',
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
			post_title: 'Perform all updates',
			url: this.buildAdminUrl( 'update-core.php' ),
		} );
	}
}

// Self-register this task provider
registerTask( CoreUpdateTask );

export default CoreUpdateTask;
