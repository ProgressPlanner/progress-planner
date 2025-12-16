/**
 * SEO Plugin Task Provider.
 *
 * React implementation of the SEO Plugin task.
 * Migrated from classes/suggested-tasks/providers/class-seo-plugin.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
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
	static isDismissable = true;
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
		const taskId = this.getTaskId( taskData );

		// Build URL to plugins.php.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }plugins.php`;

		const StaticClass = this.constructor;
		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Install an SEO plugin',
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

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction( 'prpl.tasks.register', SEOPluginTask, SEOPluginTask.priority );

export default SEOPluginTask;
