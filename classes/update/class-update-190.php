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

		// Clean up old category taxonomy data.
		$this->cleanup_category_taxonomy();

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
	 * This method removes all related data from the database.
	 *
	 * @return void
	 */
	private function cleanup_category_taxonomy() {
		global $wpdb;

		// Get term taxonomy IDs for the old category taxonomy.
		$term_taxonomy_ids = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				'SELECT term_taxonomy_id FROM %i WHERE taxonomy = %s',
				$wpdb->term_taxonomy, // @phpstan-ignore-line property.nonObject
				'prpl_recommendations_category'
			)
		);

		if ( empty( $term_taxonomy_ids ) ) {
			return; // Nothing to clean up.
		}

		// Remove term relationships.
		$placeholders = \implode( ',', \array_fill( 0, \count( $term_taxonomy_ids ), '%d' ) );
		$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"DELETE FROM %i WHERE term_taxonomy_id IN ($placeholders)", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- $placeholders contains format specifiers
				$wpdb->term_relationships, // @phpstan-ignore-line property.nonObject
				...$term_taxonomy_ids
			)
		);

		// Get term IDs before deleting term taxonomy entries.
		$term_ids = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				'SELECT term_id FROM %i WHERE taxonomy = %s',
				$wpdb->term_taxonomy, // @phpstan-ignore-line property.nonObject
				'prpl_recommendations_category'
			)
		);

		// Remove term taxonomy entries.
		$wpdb->delete( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->term_taxonomy, // @phpstan-ignore-line property.nonObject
			[ 'taxonomy' => 'prpl_recommendations_category' ],
			[ '%s' ]
		);

		// Remove orphaned terms that are no longer used by any taxonomy.
		if ( ! empty( $term_ids ) ) {
			$term_placeholders = \implode( ',', \array_fill( 0, \count( $term_ids ), '%d' ) );
			$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare(
					"DELETE FROM %i WHERE term_id IN ($term_placeholders) AND term_id NOT IN (SELECT DISTINCT term_id FROM %i)", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- $term_placeholders contains format specifiers
					$wpdb->terms, // @phpstan-ignore-line property.nonObject
					$wpdb->term_taxonomy, // @phpstan-ignore-line property.nonObject
					...$term_ids
				)
			);
		}

		// Clean up term meta for deleted terms.
		if ( ! empty( $term_ids ) ) {
			$term_placeholders = \implode( ',', \array_fill( 0, \count( $term_ids ), '%d' ) );
			$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$wpdb->prepare(
					"DELETE FROM %i WHERE term_id IN ($term_placeholders) AND term_id NOT IN (SELECT DISTINCT term_id FROM %i)", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- $term_placeholders contains format specifiers
					$wpdb->termmeta, // @phpstan-ignore-line property.nonObject
					$wpdb->terms, // @phpstan-ignore-line property.nonObject
					...$term_ids
				)
			);
		}

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
