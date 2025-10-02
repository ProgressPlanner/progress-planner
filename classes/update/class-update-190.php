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
}
