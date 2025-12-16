/**
 * Search Engine Visibility Task Provider.
 *
 * React implementation of the Search Engine Visibility task.
 * Migrated from classes/suggested-tasks/providers/class-search-engine-visibility.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import apiFetch from '@wordpress/api-fetch';

/**
 * Search Engine Visibility Task Provider class.
 */
class SearchEngineVisibilityTask extends InteractiveTaskProvider {
	static providerId = 'search-engine-visibility';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 5;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/blog-indexing-settings';
	static popoverId = 'search-engine-visibility';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Fetch WordPress settings to check if blog_public is 0 (discouraged).
			const settings = await apiFetch( {
				path: '/wp/v2/settings',
			} );

			// Task should be added if blog_public is 0 (search engines discouraged).
			return settings?.blog_public === 0 || settings?.blog_public === '0';
		} catch ( error ) {
			console.error(
				'Error checking Search Engine Visibility task condition:',
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

		// Build URL to options-reading.php.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-reading.php`;

		const StaticClass = this.constructor;
		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Allow your site to be indexed by search engines',
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
			link_setting: {
				hook: 'options-reading.php',
				iconEl: 'label[for="blog_public"]',
			},
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

export default SearchEngineVisibilityTask;
