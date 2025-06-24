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
	 * @return void
	 */
	public function test_recreating_tasks_from_activities() {
		// Delete all activities.
		\progress_planner()->get_activities__query()->delete_activities(
			\progress_planner()->get_activities__query()->query_activities(
				[
					'category' => 'suggested_task',
				]
			)
		);

		// Delete all tasks.
		\progress_planner()->get_settings()->set( 'tasks', [] );

		// activity ids, we want to create task with the same ids (and populate task data).
		$activity_ids = [
			'wp-debug-display',
			'php-version',
			'search-engine-visibility',
			'update-core-202448',
			'review-post-2792-202517',
			'review-post-2874-202517',
			'review-post-2927-202517',
			'review-post-2949-202517',
			'review-post-3039-202517',
			'create-post-short-202448',
			'update-core-202450',
			'review-post-4313-202517',
			'review-post-4331-202517',
			'review-post-4421-202517',
			'review-post-4544-202517',
			'review-post-2810-202517',
			'review-post-4467-202517',
			'update-core-202401',
			'settings-saved-202501',
			'review-post-4530-202517',
			'review-post-4477-202517',
			'review-post-4569-202517',
			'review-post-4809-202517',
			'update-core-202502',
			'update-core-202503',
			'update-core-202504',
			'review-post-4610-202517',
			'review-post-4847-202517',
			'review-post-5004-202517',
			'review-post-5070-202517',
			'review-post-8639-202517',
			'update-core-202505',
			'create-post-long-202505',
			'update-core-202506',
			'update-core-202507',
			'review-post-1237-202517',
			'review-post-9963-202517',
			'review-post-15391-202517',
			'review-post-785-202517',
			'review-post-15387-202517',
			'review-post-15413-202517',
			'review-post-1396-202517',
			'review-post-15417-202517',
			'review-post-720-202517',
			'review-post-24800-202517',
			'review-post-784-202517',
			'update-core-202508',
			'rename-uncategorized-category',
			'core-permalink-structure',
			'update-core-202509',
			'yoast-author-archive',
			'yoast-format-archive',
			'yoast-crawl-settings-emoji-scripts',
			'ch-comment-policy',
		];

		// Create a new activity for each item.
		foreach ( $activity_ids as $activity_id ) {
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

		// Verify that every value in the $activity_ids array is present in the $tasks array and has completed status.
		foreach ( $activity_ids as $activity_id ) {
			$matching_tasks = \array_filter(
				$tasks,
				function ( $task ) use ( $activity_id ) {
					return isset( $task['task_id'] ) &&
						$task['task_id'] === $activity_id;
				}
			);

			$this->assertNotEmpty(
				$matching_tasks,
				\sprintf( 'Task ID "%s" not found in tasks', $activity_id )
			);

			$task = \reset( $matching_tasks );
			$this->assertEquals(
				'completed',
				$task['status'],
				\sprintf( 'Task ID "%s" status is not "completed"', $activity_id )
			);
		}
	}
}
