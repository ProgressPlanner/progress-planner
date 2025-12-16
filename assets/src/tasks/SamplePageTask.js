/**
 * Sample Page Task Provider.
 *
 * React implementation of the Sample Page task.
 * Migrated from classes/suggested-tasks/providers/class-sample-page.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Sample Page Task Provider class.
 */
class SamplePageTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'sample-page',
			capability: 'edit_pages',
			isOnboardingTask: true,
			priority: 14,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/delete-sample-page',
			popoverId: 'sample-page',
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
			const samplePageId = await fetchDataCollector( 'sample_page_id' );
			return samplePageId !== 0 && samplePageId !== null;
		} catch ( error ) {
			console.error(
				'Error checking Sample Page task condition:',
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
		const samplePageId = await fetchDataCollector( 'sample_page_id' );

		// Get the task ID.
		const taskId = this.getTaskId( taskData );

		// Build URL if we have a page ID.
		let url = '';
		if ( samplePageId && samplePageId !== 0 ) {
			// Build edit page URL - WordPress admin URL format.
			const adminUrl =
				window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
			const separator = adminUrl.endsWith( '/' ) ? '' : '/';
			url = `${ adminUrl }${ separator }post.php?post=${ samplePageId }&action=edit`;
		}

		// Build description.
		// Note: The full description with page URL would require fetching the permalink from the server.
		// For now, use a simplified description that matches the PHP version's fallback.
		const description =
			samplePageId && samplePageId !== 0
				? '<p>On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.</p>'
				: 'On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.';

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Delete "Sample Page"',
			description,
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
const samplePageTask = new SamplePageTask();

export default samplePageTask;
