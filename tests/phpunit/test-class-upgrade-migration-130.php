<?php
/**
 * Test upgrade migrations.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Test upgrade migrations.
 */
class Upgrade_Migrations_130_Test extends \WP_UnitTestCase {

	/**
	 * Test upgrade from 1.2.0 to 1.3.0.
	 * Test recreating tasks from activities.
	 *
	 * Note: Most task providers have been migrated to React. The Update_130 migration
	 * only restores tasks that have a valid PHP provider_id. Tasks like 'wp-debug-display',
	 * 'php-version', etc. are now handled by React and won't be migrated.
	 *
	 * @return void
	 */
	public function test_recreating_tasks_from_activities() {
		// Delete all activities.
		\progress_planner()->get_activities__query()->delete_activities(
			\progress_planner()->get_activities__query()->query_activities( [ 'category' => 'suggested_task' ] )
		);

		// Delete all tasks.
		\progress_planner()->get_settings()->set( 'local_tasks', [] );

		// Activity IDs that will have a valid provider_id after migration.
		// These are tasks that are either:
		// 1. Handled specially (review-post, yoast, ch-comment).
		// 2. Have a PHP provider still registered.
		$activity_ids_with_providers = [
			'review-post-2792-202517',
			'review-post-2874-202517',
			'review-post-2927-202517',
			'review-post-2949-202517',
			'review-post-3039-202517',
			'review-post-4313-202517',
			'yoast-author-archive',
			'yoast-format-archive',
			'yoast-crawl-settings-emoji-scripts',
			'ch-comment-policy',
		];

		// Activity IDs that won't be migrated (provider migrated to React or doesn't exist in PHP).
		$activity_ids_without_providers = [
			'wp-debug-display',
			'php-version',
			'search-engine-visibility',
			'update-core-202448',
			'create-post-short-202448',
			'rename-uncategorized-category',
			'core-permalink-structure',
		];

		$all_activity_ids = \array_merge( $activity_ids_with_providers, $activity_ids_without_providers );

		// Create a new activity for each item.
		foreach ( $all_activity_ids as $activity_id ) {
			$activity          = new \Progress_Planner\Activities\Suggested_Task();
			$activity->type    = 'completed';
			$activity->data_id = $activity_id;
			$activity->date    = new \DateTime();

			$activity->save();
		}

		// We have inserted the legacy data, now migrate the tasks.
		( new \Progress_Planner\Update\Update_130() )->run();

		// Verify the data was migrated.
		$tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );

		// Verify that tasks with providers are migrated.
		foreach ( $activity_ids_with_providers as $activity_id ) {
			$matching_tasks = \array_filter( $tasks, fn( $task ) => isset( $task['task_id'] ) && $task['task_id'] === $activity_id );

			$this->assertNotEmpty(
				$matching_tasks,
				\sprintf( 'Task ID "%s" not found in tasks (expected to be migrated)', $activity_id )
			);

			$task = \reset( $matching_tasks );
			$this->assertEquals(
				'completed',
				$task['status'],
				\sprintf( 'Task ID "%s" status is not "completed"', $activity_id )
			);
		}

		// Verify that tasks without providers are NOT migrated (they're now handled by React).
		foreach ( $activity_ids_without_providers as $activity_id ) {
			$matching_tasks = \array_filter( $tasks, fn( $task ) => isset( $task['task_id'] ) && $task['task_id'] === $activity_id );

			$this->assertEmpty(
				$matching_tasks,
				\sprintf( 'Task ID "%s" should NOT be migrated (provider migrated to React)', $activity_id )
			);
		}
	}
}
