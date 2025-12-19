/**
 * Blog Description Task Provider.
 *
 * React implementation of the Blog Description (tagline) task.
 * Migrated from classes/suggested-tasks/providers/class-blog-description.php
 */

import { __ } from '@wordpress/i18n';
import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { cachedApiFetch } from '../services/apiFetchCache';

/**
 * Blog Description Task Provider class.
 */
class BlogDescriptionTask extends InteractiveTaskProvider {
	static providerId = 'core-blogdescription';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 2;
	static points = 1;
	static isDismissable = false;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/set-tagline';
	static popoverId = 'core-blogdescription';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			// Fetch WordPress settings to check if blog description is empty.
			const settings = await cachedApiFetch( {
				path: '/wp/v2/settings',
			} );

			// Task should be added if description (tagline) is empty.
			return ! settings?.description || settings.description === '';
		} catch ( error ) {
			console.error(
				'Error checking Blog Description task condition:',
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

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: __( 'Set tagline', 'progress-planner' ),
			description: __(
				'Set the tagline to make your website look more professional.',
				'progress-planner'
			),
			url: this.buildAdminUrl( 'options-general.php', {
				'pp-focus-el': taskId,
			} ),
			link_setting: {
				hook: 'options-general.php',
				iconEl: 'th:has(+td #tagline-description)',
			},
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
		return __( 'Set tagline', 'progress-planner' );
	}
}

// Self-register this task provider
registerTask( BlogDescriptionTask );

export default BlogDescriptionTask;
