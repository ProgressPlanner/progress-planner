/**
 * SEO Plugin Task Provider.
 *
 * React implementation of the SEO Plugin task.
 * Migrated from classes/suggested-tasks/providers/class-seo-plugin.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * SEO Plugin Task Provider class.
 */
class SEOPluginTask extends InteractiveTaskProvider {
	static providerId = 'seo-plugin';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 20;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/install-seo-plugin';
	static popoverId = 'seo-plugin';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Check if SEO plugin is installed via data collector.
			const seoPluginInstalled = await fetchDataCollector(
				'seo_plugin_installed'
			);
			// Task should be added if no SEO plugin is detected.
			return ! seoPluginInstalled;
		} catch ( error ) {
			console.error( 'Error checking SEO Plugin task condition:', error );
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
			post_title: 'Install an SEO plugin',
			url: this.buildAdminUrl( 'plugins.php' ),
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
registerTask( SEOPluginTask );

export default SEOPluginTask;
