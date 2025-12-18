/**
 * Blog Description Task Provider.
 *
 * React implementation of the Blog Description (tagline) task.
 * Migrated from classes/suggested-tasks/providers/class-blog-description.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Blog Description Task Provider class.
 */
class BlogDescriptionTask extends InteractiveTaskProvider {
	static providerId = 'core-blogdescription';
	static capability = 'manage_options';
	static isOnboardingTask = true;
	static priority = 2;
	static points = 1;
	static isDismissable = true;
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
			const settings = await apiFetch( {
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

		// Build URL to options-general.php with focus element.
		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }options-general.php?pp-focus-el=${ taskId }`;

		const StaticClass = this.constructor;
		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Set tagline',
			description:
				'Set the tagline to make your website look more professional.',
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
				hook: 'options-general.php',
				iconEl: 'th:has(+td #tagline-description)',
			},
		};

		// Add popover ID for interactive tasks.
		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction(
	'prpl.tasks.register',
	BlogDescriptionTask,
	BlogDescriptionTask.priority
);

export default BlogDescriptionTask;
