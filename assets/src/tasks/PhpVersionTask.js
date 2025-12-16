/**
 * PHP Version Task Provider.
 *
 * React implementation of the PHP Version task.
 * Migrated from classes/suggested-tasks/providers/class-php-version.php
 *
 * Note: This requires server-side checking of PHP version.
 * A data collector or REST API endpoint would be needed for full implementation.
 */

import { TaskProvider } from '../services/TaskProvider';

/**
 * PHP Version Task Provider class.
 */
class PhpVersionTask extends TaskProvider {
	/**
	 * Constructor.
	 */
	constructor() {
		super( {
			providerId: 'php-version',
			capability: 'manage_options',
			isOnboardingTask: true,
			priority: 25,
			points: 1,
			isDismissable: true,
			isSnoozable: true,
			externalLinkUrl: 'https://prpl.fyi/update-php-version',
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
		// The PHP version checks: version_compare(phpversion(), '8.2', '<')
		// This requires server-side checking of PHP version.
		// TODO: Create data collector or REST API endpoint to check PHP version.
		// For now, return false (task won't show) until data collector is implemented.
		return false;
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

		return {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Update PHP version',
			description: '',
			priority: this.getPriority(),
			points: this.getPoints(),
			parent: this.config.parent,
			url: '',
			url_target: '_self',
			dismissable: this.config.isDismissable,
			external_link_url: this.config.externalLinkUrl,
		};
	}
}

const phpVersionTask = new PhpVersionTask();

export default phpVersionTask;
