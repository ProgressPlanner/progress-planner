<?php
/**
 * Update class for version 1.9.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.7.2.
 *
 * @package Progress_Planner
 */
class Update_190 {

	const VERSION = '1.9.0';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Migrate the golden task.
		$this->migrate_golden_todo_task();

		// Migrate task priorities to new priority system.
		// This needs to run after tasks_manager is initialized (priority 99 on init hook).
		// So we hook it to run at priority 100.
		\add_action( 'init', [ $this, 'migrate_task_priorities' ], 100 );
	}

	/**
	 * Migrate the golden task.
	 *
	 * @return void
	 */
	private function migrate_golden_todo_task() {
		// Get all user tasks.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => 'user' ] );

		// Loop through tasks and update the `post_excerpt` if the `prpl_points` meta is set to 1.
		global $wpdb;
		foreach ( $tasks as $task ) {
			// Get the `prpl_points` meta.
			// We'll be getting the value directly from the database since the post-meta is no longer used.
			$points = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare(
					"SELECT meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key = 'prpl_points'", // @phpstan-ignore-line property.nonObject
					$task->ID
				)
			);
			if ( 1 === (int) $points ) {
				\progress_planner()->get_suggested_tasks_db()->update_recommendation(
					$task->ID,
					[ 'post_excerpt' => 'GOLDEN' ]
				);
			}
		}
	}

	/**
	 * Migrate task priorities to the new priority system.
	 *
	 * Updates the menu_order of existing tasks to match their provider's current priority value.
	 * This ensures that tasks display in the correct order after priority constants were introduced.
	 *
	 * @return void
	 */
	public function migrate_task_priorities() {
		// Map of provider_id => new priority value.
		// This is hardcoded to avoid dependency on tasks_manager being initialized.
		$priority_map = [
			'update-core'                => 0,  // PRIORITY_CRITICAL.
			'wp-debug-display'           => 5,  // PRIORITY_CRITICAL + 5.
			'settings-saved'             => 10, // PRIORITY_URGENT.
			'email-sending'              => 11, // PRIORITY_URGENT + 1.
			'search-engine-visibility'   => 12, // PRIORITY_URGENT + 2.
			'php-version'                => 13, // PRIORITY_URGENT + 3.
			'core-permalink-structure'   => 20, // PRIORITY_HIGH.
			'unpublished-content'        => 30, // PRIORITY_HIGH + 10.
			'fewer-tags'                 => 32, // PRIORITY_HIGH + 12.
			'core-blogdescription'       => 45, // PRIORITY_NORMAL - 5.
			'core-siteicon'              => 45, // PRIORITY_NORMAL - 5.
			'select-locale'              => 46, // PRIORITY_NORMAL - 4.
			'select-timezone'            => 46, // PRIORITY_NORMAL - 4.
			'set-date-format'            => 46, // PRIORITY_NORMAL - 4.
			'review-post'                => 60, // PRIORITY_LOW.
			'remove-terms-without-posts' => 60, // PRIORITY_LOW.
			'set-valuable-post-types'    => 70, // PRIORITY_LOW + 10.
			'update-term-description'    => 80, // PRIORITY_OPTIONAL.
			'yoast-cornerstone-workout'  => 90, // PRIORITY_OPTIONAL + 10.
			'yoast-orphaned-content'     => 90, // PRIORITY_OPTIONAL + 10.
		];

		// Loop through each provider and update its tasks.
		foreach ( $priority_map as $provider_id => $priority ) {
			// Get all tasks for this provider.
			$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[
					'provider_id' => $provider_id,
					'post_status' => [ 'publish', 'trash', 'draft', 'future', 'pending' ],
				]
			);

			// Update the menu_order for each task.
			foreach ( $tasks as $task ) {
				// Only update if the menu_order is different from the current priority.
				if ( (int) $task->menu_order !== $priority ) {
					\progress_planner()->get_suggested_tasks_db()->update_recommendation(
						$task->ID,
						[ 'menu_order' => $priority ]
					);
				}
			}
		}

		// Clear the tasks cache to ensure fresh data is loaded.
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );
	}
}
