/**
 * Hello World Task Provider.
 *
 * React implementation of the Hello World task.
 * Migrated from classes/suggested-tasks/providers/class-hello-world.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Hello World Task Provider class.
 */
class HelloWorldTask extends InteractiveTaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'hello-world',
			capability: 'edit_posts',
			isOnboardingTask: true,
			priority: 15,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/delete-hello-world-post',
			popoverId: 'hello-world',
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
			const helloWorldPostId = await fetchDataCollector(
				'hello_world_post_id'
			);
			return helloWorldPostId !== 0 && helloWorldPostId !== null;
		} catch ( error ) {
			console.error(
				'Error checking Hello World task condition:',
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
	async getTaskDetails( taskData = {} ) {
		const helloWorldPostId = await fetchDataCollector(
			'hello_world_post_id'
		);

		// Get the task ID.
		const taskId = this.getTaskId( taskData );

		// Build URL if we have a post ID.
		let url = '';
		if ( helloWorldPostId && helloWorldPostId !== 0 ) {
			// Build edit post URL - WordPress admin URL format.
			const adminUrl =
				window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
			const separator = adminUrl.endsWith( '/' ) ? '' : '/';
			url = `${ adminUrl }${ separator }post.php?post=${ helloWorldPostId }&action=edit`;
		}

		// Build description.
		// Note: The full description with post URL would require fetching the permalink from the server.
		// For now, use a simplified description that matches the PHP version's fallback.
		const description =
			helloWorldPostId && helloWorldPostId !== 0
				? '<p>On install, WordPress creates a "Hello World!" post. This post does not add value to your website and solely exists to show what a post can look like. Therefore, "Hello World!" is not needed and should be deleted.</p>'
				: 'On install, WordPress creates a "Hello World!" post. This post is not needed and should be deleted.';

		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Delete the "Hello World!" post.',
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
const helloWorldTask = new HelloWorldTask();

export default helloWorldTask;
