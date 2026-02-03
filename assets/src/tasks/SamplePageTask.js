/**
 * Sample Page Task Provider.
 *
 * React implementation of the Sample Page task.
 * Migrated from classes/suggested-tasks/providers/class-sample-page.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Sample Page Task Provider class.
 */
class SamplePageTask extends InteractiveTaskProvider {
	static providerId = 'sample-page';
	static capability = 'edit_pages';
	static isOnboardingTask = true;
	static priority = 14;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/delete-sample-page';
	static popoverId = 'sample-page';

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

		// Build URL if we have a page ID.
		const url =
			samplePageId && samplePageId !== 0
				? this.buildAdminUrl( 'post.php', {
						post: samplePageId,
						action: 'edit',
				  } )
				: '';

		// Build description.
		const description =
			samplePageId && samplePageId !== 0
				? '<p>' +
				  __(
						'On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.',
						'progress-planner'
				  ) +
				  '</p>'
				: __(
						'On install, WordPress creates a "Sample Page" page. This page does not add value to your website and solely exists to show what a page can look like. Therefore, "Sample Page" is not needed and should be deleted.',
						'progress-planner'
				  );

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: __( 'Delete "Sample Page"', 'progress-planner' ),
			description,
			url,
		} );

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}

	/**
	 * Get the label for the popover action.
	 *
	 * @return {string} The action label.
	 */
	getPopoverActionLabel() {
		return __( 'Delete', 'progress-planner' );
	}
}

// Self-register this task provider
registerTask( SamplePageTask );

export default SamplePageTask;
