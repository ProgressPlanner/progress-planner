/**
 * Fewer Tags Task Provider.
 *
 * React implementation of the Fewer Tags task.
 * Migrated from classes/suggested-tasks/providers/class-fewer-tags.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Fewer Tags Task Provider class.
 */
class FewerTagsTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'fewer-tags',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 32,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/install-fewer-tags',
			popoverId: 'fewer-tags',
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
		const taskId = this.getTaskId( taskData );

		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }plugin-install.php?tab=search&s=fewer+tags`;

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Install Fewer Tags and clean up your tags',
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

const fewerTagsTask = new FewerTagsTask();

export default fewerTagsTask;
