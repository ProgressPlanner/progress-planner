<?php
/**
 * Update class for version 1.9.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.9.0.
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
		// Delete the 'progress_planner_pro_license_key' entry from wp_options table.
		$this->migrate_recommendations_slugs();

		// Migrate the golden task.
		$this->migrate_golden_todo_task();
	}

	/**
	 * Migrate the recommendations slugs.
	 *
	 * @return void
	 */
	private function migrate_recommendations_slugs() {
		// Get all recommendations.
		$recommendations = \progress_planner()->get_suggested_tasks_db()->get();
		foreach ( $recommendations as $recommendation ) {
			// Get the `prpl_task_id` meta.
			$prpl_task_id = \get_post_meta( $recommendation->ID, 'prpl_task_id', true );
			if ( ! $prpl_task_id ) {
				continue;
			}

			// Check if there are any existing posts with the same slug.
			$existing_posts = \get_posts(
				[
					'post_type' => 'prpl_recommendations',
					'name'      => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $prpl_task_id ),
				]
			);
			if ( ! empty( $existing_posts ) ) {
				// Delete the existing post.
				\wp_delete_post( $existing_posts[0]->ID, true );
			}

			// Set the slug.
			\wp_update_post(
				[
					'ID'        => $recommendation->ID,
					'post_name' => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $prpl_task_id ),
				]
			);
		}
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
