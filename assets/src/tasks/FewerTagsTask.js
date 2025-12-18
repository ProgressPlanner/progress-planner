/**
 * Fewer Tags Task Provider.
 *
 * React implementation of the Fewer Tags task.
 * Migrated from classes/suggested-tasks/providers/class-fewer-tags.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Fewer Tags Task Provider class.
 */
class FewerTagsTask extends InteractiveTaskProvider {
	static providerId = 'fewer-tags';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 32;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/install-fewer-tags';
	static popoverId = 'fewer-tags';

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
			// - !is_plugin_active('fewer-tags/fewer-tags.php')
			// - post_tag_count > published_post_count
			// For React, we'll fetch data collectors.
			const postTagCount = await fetchDataCollector( 'post_tag_count' );
			const publishedPostCount = await fetchDataCollector(
				'published_post_count'
			);

			if (
				postTagCount !== null &&
				publishedPostCount !== null &&
				postTagCount > publishedPostCount
			) {
				return true;
			}

			return false;
		} catch ( error ) {
			console.error( 'Error checking Fewer Tags task condition:', error );
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
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Install Fewer Tags and clean up your tags',
			url: this.buildAdminUrl( 'plugin-install.php', {
				tab: 'search',
				s: 'fewer tags',
			} ),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( FewerTagsTask );

export default FewerTagsTask;
