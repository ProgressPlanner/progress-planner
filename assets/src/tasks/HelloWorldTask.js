/**
 * Hello World Task Provider.
 *
 * React implementation of the Hello World task.
 * Migrated from classes/suggested-tasks/providers/class-hello-world.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { registerTask } from '../services/taskRegistry';
import { fetchDataCollector } from '../hooks/useTasksApi';

/**
 * Hello World Task Provider class.
 */
class HelloWorldTask extends InteractiveTaskProvider {
	static providerId = 'hello-world';
	static capability = 'edit_posts';
	static isOnboardingTask = true;
	static priority = 15;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static externalLinkUrl = 'https://prpl.fyi/delete-hello-world-post';
	static popoverId = 'hello-world';

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

		// Build URL if we have a post ID.
		const url =
			helloWorldPostId && helloWorldPostId !== 0
				? this.buildAdminUrl( 'post.php', {
						post: helloWorldPostId,
						action: 'edit',
				  } )
				: '';

		// Build description.
		const description =
			helloWorldPostId && helloWorldPostId !== 0
				? '<p>On install, WordPress creates a "Hello World!" post. This post does not add value to your website and solely exists to show what a post can look like. Therefore, "Hello World!" is not needed and should be deleted.</p>'
				: 'On install, WordPress creates a "Hello World!" post. This post is not needed and should be deleted.';

		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Delete the "Hello World!" post.',
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
		return 'Delete';
	}
}

// Self-register this task provider
registerTask( HelloWorldTask );

export default HelloWorldTask;
