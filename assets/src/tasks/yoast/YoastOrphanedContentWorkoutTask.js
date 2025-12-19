/**
 * Yoast Orphaned Content Workout Task Provider.
 *
 * React implementation of the Yoast SEO Orphaned Content Workout task.
 * Migrated from classes/suggested-tasks/providers/integrations/yoast/class-orphaned-content-workout.php
 *
 * Note: This is a Premium-only task that requires Yoast SEO Premium.
 * The task auto-dismissal when workout is completed is handled server-side
 * via the update_option_wpseo_premium hook in PHP.
 */

import { __ } from '@wordpress/i18n';
import { TaskProvider } from '../../services/TaskProvider';
import { registerTask } from '../../services/taskRegistry';
import { fetchDataCollector } from '../../hooks/useTasksApi';

/**
 * Yoast Orphaned Content Workout Task Provider class.
 */
class YoastOrphanedContentWorkoutTask extends TaskProvider {
	static providerId = 'yoast-orphaned-content-workout';
	static capability = 'edit_others_posts';
	static isOnboardingTask = false;
	static priority = 20;
	static points = 3;
	static isDismissable = true;
	static isSnoozable = true;
	static isRepetitive = true;
	static externalLinkUrl = 'https://prpl.fyi/run-orphaned-content-workout';

	/**
	 * Check if the task should be added.
	 *
	 * @param {Object} taskData Optional task-specific data.
	 * @return {Promise<boolean>} Promise resolving to true if task should be added.
	 */
	// eslint-disable-next-line no-unused-vars
	async shouldAddTask( taskData = {} ) {
		try {
			const premiumStatus = await fetchDataCollector(
				'yoast_premium_status'
			);

			// Only show task if Yoast Premium is active.
			if ( ! premiumStatus?.active ) {
				return false;
			}

			// Task dismissal is handled by the TaskProvider infrastructure.
			// The PHP side handles auto-dismissal when workout is completed.
			return true;
		} catch ( error ) {
			console.error(
				'Error checking Yoast Orphaned Content Workout task condition:',
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
		return this.buildTaskDetails( taskData, {
			post_title: __(
				"Yoast SEO: do Yoast SEO's Orphaned Content Workout",
				'progress-planner'
			),
			url: this.buildAdminUrl( 'admin.php?page=wpseo_workouts#orphaned' ),
		} );
	}

	/**
	 * Add custom task actions.
	 *
	 * @param {Object} taskData The task data.
	 * @param {Array}  actions  The existing actions array.
	 * @return {Array} The modified actions array.
	 */
	addTaskActions( taskData, actions ) {
		// Add "Run workout" link action with high priority.
		actions.push( {
			type: 'link',
			priority: 10,
			label: __( 'Run workout', 'progress-planner' ),
			url: this.buildAdminUrl( 'admin.php?page=wpseo_workouts#orphaned' ),
			target: '_self',
		} );

		return actions;
	}
}

// Self-register this task provider.
registerTask( YoastOrphanedContentWorkoutTask );

export default YoastOrphanedContentWorkoutTask;
