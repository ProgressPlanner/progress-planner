/**
 * Reduce Autoloaded Options Task Provider.
 *
 * React implementation of the Reduce Autoloaded Options task.
 * Migrated from classes/suggested-tasks/providers/class-reduce-autoloaded-options.php
 */

import { InteractiveTaskProvider } from '../services/InteractiveTaskProvider';
import { doAction } from '@wordpress/hooks';

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
		const taskDetails = this.buildTaskDetails( taskData, {
			post_title: 'Reduce number of autoloaded options',
			url: this.buildAdminUrl( 'plugin-install.php', {
				tab: 'search',
				s: 'aaa option optimizer',
			} ),
		} );

		return this.addPopoverIdToTaskDetails( taskDetails );
	}
}

// Self-register this task provider
doAction(
	'prpl.tasks.register',
	ReduceAutoloadedOptionsTask,
	ReduceAutoloadedOptionsTask.priority
);

export default ReduceAutoloadedOptionsTask;
