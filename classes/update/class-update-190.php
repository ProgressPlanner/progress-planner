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

		// Clean up old category taxonomy data.
		// This needs to run on init hook so we can register the taxonomy.
		\add_action( 'init', [ $this, 'cleanup_category_taxonomy' ], 0 );

		// Migrate task priorities to new priority system.
		// This needs to run after tasks_manager is initialized (priority 99 on init hook).
		// So we hook it to run at priority 100.
		\add_action( 'init', [ $this, 'migrate_task_priorities' ], 100 );
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

			// Get the target slug.
			$target_slug = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $prpl_task_id );

			// Check if there are any existing posts with the same slug.
			$existing_posts = \get_posts(
				[
					'post_type' => 'prpl_recommendations',
					'name'      => $target_slug,
				]
			);
			if ( ! empty( $existing_posts ) && $existing_posts[0]->ID !== $recommendation->ID ) {
				// Delete the existing post (but not if it's the current one).
				\wp_delete_post( $existing_posts[0]->ID, true );
			}

			// Only update if the slug is different from the current slug.
			if ( $recommendation->post_name !== $target_slug ) {
				\wp_update_post(
					[
						'ID'        => $recommendation->ID,
						'post_name' => $target_slug,
					]
				);
			}
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
					'SELECT meta_value FROM %i WHERE post_id = %d AND meta_key = %s',
					$wpdb->postmeta, // @phpstan-ignore-line property.nonObject
					$task->ID,
					'prpl_points'
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
	 * Clean up old category taxonomy data.
	 *
	 * The prpl_recommendations_category taxonomy has been removed in v1.9.0.
	 * This method temporarily registers the taxonomy, deletes all its terms,
	 * then unregisters it.
	 *
	 * @return void
	 */
	public function cleanup_category_taxonomy() {
		// Temporarily register the old taxonomy so we can use WordPress functions.
		\register_taxonomy(
			'prpl_recommendations_category',
			[ 'prpl_recommendations' ],
			[
				'public'       => false,
				'hierarchical' => false,
			]
		);

		// Get all terms in this taxonomy.
		$terms = \get_terms(
			[
				'taxonomy'   => 'prpl_recommendations_category',
				'hide_empty' => false,
			]
		);

		// Delete each term. WordPress will handle all related cleanup automatically.
		if ( ! \is_wp_error( $terms ) && ! empty( $terms ) ) {
			foreach ( $terms as $term ) {
				\wp_delete_term( $term->term_id, 'prpl_recommendations_category' );
			}
		}

		// Unregister the taxonomy.
		\unregister_taxonomy( 'prpl_recommendations_category' );

		// Clear WordPress caches.
		\wp_cache_flush();
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
			'core-siteicon'              => 1,
			'core-blogdescription'       => 2,
			'core-permalink-structure'   => 3,
			'email-sending'              => 4,
			'search-engine-visibility'   => 5,
			'select-timezone'            => 6,
			'set-date-format'            => 7,
			'select-locale'              => 8,
			'settings-saved'             => 10,
			'wp-debug-display'           => 10,
			'review-post'                => 10,
			'update-core'                => 20,
			'php-version'                => 25,
			'fewer-tags'                 => 32,
			'unpublished-content'        => 55,
			'remove-inactive-plugins'    => 60,
			'rename-uncategorized'       => 60,
			'remove-terms-without-posts' => 60,
			'set-valuable-post-types'    => 70,
			'update-term-description'    => 80,
			'yoast-cornerstone-workout'  => 20,
			'yoast-orphaned-content'     => 20,
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
				// Refresh the task data to ensure we have the latest menu_order value.
				$refreshed_task = \get_post( $task->ID );

				// Skip if the post no longer exists.
				if ( ! $refreshed_task ) {
					continue;
				}

				// Only update if the menu_order is different from the current priority.
				if ( (int) $refreshed_task->menu_order !== $priority ) {
					\progress_planner()->get_suggested_tasks_db()->update_recommendation(
						$refreshed_task->ID,
						[ 'menu_order' => $priority ]
					);
				}
			}
		}

		// Clear the tasks cache to ensure fresh data is loaded.
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );
	}
}
