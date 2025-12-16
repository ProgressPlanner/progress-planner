/**
 * SEO Plugin Task Provider.
 *
 * React implementation of the SEO Plugin task.
 * Migrated from classes/suggested-tasks/providers/class-seo-plugin.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * SEO Plugin Task Provider class.
 */
class SEOPluginTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'seo-plugin',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 20,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/install-seo-plugin',
			popoverId: 'seo-plugin',
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
		const taskId = this.getTaskId( taskData );

		// Build URL to plugins.php.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }plugins.php`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Install an SEO plugin',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url,
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Create singleton instance.
const seoPluginTask = new SEOPluginTask();

export default seoPluginTask;
