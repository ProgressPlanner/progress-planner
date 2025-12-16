/**
 * Reduce Autoloaded Options Task Provider.
 *
 * React implementation of the Reduce Autoloaded Options task.
 * Migrated from classes/suggested-tasks/providers/class-reduce-autoloaded-options.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';

/**
 * Reduce Autoloaded Options Task Provider class.
 */
class ReduceAutoloadedOptionsTask extends InteractiveTaskProvider {
	static providerId = 'reduce-autoloaded-options';
	static capability = 'manage_options';
	static isOnboardingTask = false;
	static priority = 50;
	static points = 1;
	static isDismissable = true;
	static isSnoozable = true;
	static popoverId = 'reduce-autoloaded-options';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		// The PHP version checks:
		// - !is_plugin_active('aaa-option-optimizer/aaa-option-optimizer.php')
		// - get_autoloaded_options_count() > 500
		// This requires server-side checking (database query and plugin check).
		// TODO: Create data collector or REST API endpoint.
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

		const adminUrl =
			window.prplSuggestedTasksConfig?.adminUrl || '/wp-admin/';
		const separator = adminUrl.endsWith( '/' ) ? '' : '/';
		const url = `${ adminUrl }${ separator }plugin-install.php?tab=search&s=aaa+option+optimizer`;

		const StaticClass = this.constructor;
		const taskDetails = {
			task_id: taskId,
			provider_id: this.getProviderId(),
			post_title: 'Reduce number of autoloaded options',
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

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

export default ReduceAutoloadedOptionsTask;
