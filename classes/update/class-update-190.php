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
					'name'      => $prpl_task_id,
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
					'post_name' => $prpl_task_id,
				]
			);
		}
	}
}
