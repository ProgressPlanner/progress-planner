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
class Upgrade_Migrations_111_Test extends \WP_UnitTestCase {

	/**
	 * Test upgrade from 1.0.0 to 1.1.0.
	 *
	 * @return void
	 */
	public function test_dataset_1() {
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

		// Delete all suggested tasks.
		\delete_option( 'progress_planner_suggested_tasks' );

		// old task id => [ migrated task id, date used when inserting the activity ].
		$migration_map = [
			'update-core-202448'                  => [
				'task_id' => 'update-core-202448',
				'date'    => '2024-11-25',
			],
			'post_id/2792|type/update-post'       => [
				'task_id' => 'review-post-2792-202411',
				'date'    => '2024-03-11',
			],
			'post_id/2874|type/update-post'       => [
				'task_id' => 'review-post-2874-202412',
				'date'    => '2024-03-18',
			],
			'post_id/2927|type/update-post'       => [
				'task_id' => 'review-post-2927-202413',
				'date'    => '2024-03-25',
			],
			'post_id/2949|type/update-post'       => [
				'task_id' => 'review-post-2949-202415',
				'date'    => '2024-04-08',
			],
			'post_id/3039|type/update-post'       => [
				'task_id' => 'review-post-3039-202416',
				'date'    => '2024-04-15',
			],
			'date/202448|long/0|type/create-post' => [
				'task_id' => 'create-post-short-202448',
				'date'    => '2024-11-25',
			],
			'update-core-202450'                  => [
				'task_id' => 'update-core-202450',
				'date'    => '2024-12-09',
			],
			'post_id/4313|type/update-post'       => [
				'task_id' => 'review-post-4313-202417',
				'date'    => '2024-04-22',
			],
			'post_id/4331|type/update-post'       => [
				'task_id' => 'review-post-4331-202418',
				'date'    => '2024-04-29',
			],
			'post_id/4421|type/update-post'       => [
				'task_id' => 'review-post-4421-202419',
				'date'    => '2024-05-06',
			],
			'post_id/4544|type/update-post'       => [
				'task_id' => 'review-post-4544-202420',
				'date'    => '2024-05-13',
			],
			'post_id/2810|type/update-post'       => [
				'task_id' => 'review-post-2810-202421',
				'date'    => '2024-05-20',
			],
			'post_id/4467|type/update-post'       => [
				'task_id' => 'review-post-4467-202422',
				'date'    => '2024-05-27',
			],
			'update-core-202401'                  => [
				'task_id' => 'update-core-202401',
				'date'    => '2024-01-01',
			],
			'settings-saved-202501'               => [
				'task_id' => 'settings-saved-202501',
				'date'    => '2024-12-30',
			],
			'post_id/4530|type/update-post'       => [
				'task_id' => 'review-post-4530-202423',
				'date'    => '2024-06-03',
			],
			'post_id/4477|type/update-post'       => [
				'task_id' => 'review-post-4477-202424',
				'date'    => '2024-06-10',
			],
			'post_id/4569|type/update-post'       => [
				'task_id' => 'review-post-4569-202425',
				'date'    => '2024-06-17',
			],
			'post_id/4809|type/update-post'       => [
				'task_id' => 'review-post-4809-202426',
				'date'    => '2024-06-24',
			],
			'update-core-202502'                  => [
				'task_id' => 'update-core-202502',
				'date'    => '2025-01-06',
			],
			'update-core-202503'                  => [
				'task_id' => 'update-core-202503',
				'date'    => '2025-01-13',
			],
			'update-core-202504'                  => [
				'task_id' => 'update-core-202504',
				'date'    => '2025-01-20',
			],
			'post_id/4610|type/update-post'       => [
				'task_id' => 'review-post-4610-202427',
				'date'    => '2024-07-01',
			],
			'post_id/4847|type/update-post'       => [
				'task_id' => 'review-post-4847-202428',
				'date'    => '2024-07-08',
			],
			'post_id/5004|type/update-post'       => [
				'task_id' => 'review-post-5004-202429',
				'date'    => '2024-07-15',
			],
			'post_id/5070|type/update-post'       => [
				'task_id' => 'review-post-5070-202430',
				'date'    => '2024-07-22',
			],
			'post_id/8639|type/update-post'       => [
				'task_id' => 'review-post-8639-202431',
				'date'    => '2024-07-29',
			],
			'update-core-202505'                  => [
				'task_id' => 'update-core-202505',
				'date'    => '2025-01-27',
			],
			'date/202505|long/1|type/create-post' => [
				'task_id' => 'create-post-long-202505',
				'date'    => '2025-01-27',
			],
			'update-core-202506'                  => [
				'task_id' => 'update-core-202506',
				'date'    => '2025-02-03',
			],
			'update-core-202507'                  => [
				'task_id' => 'update-core-202507',
				'date'    => '2025-02-10',
			],
			'post_id/1237|type/review-post'       => [
				'task_id' => 'review-post-1237-202501',
				'date'    => '2025-01-01',
			],
			'post_id/9963|type/review-post'       => [
				'task_id' => 'review-post-9963-202502',
				'date'    => '2025-01-06',
			],
			'post_id/15391|type/review-post'      => [
				'task_id' => 'review-post-15391-202503',
				'date'    => '2025-01-13',
			],
			'post_id/785|type/review-post'        => [
				'task_id' => 'review-post-785-202504',
				'date'    => '2025-01-20',
			],
			'post_id/15387|type/review-post'      => [
				'task_id' => 'review-post-15387-202505',
				'date'    => '2025-01-27',
			],
			'post_id/15413|type/review-post'      => [
				'task_id' => 'review-post-15413-202506',
				'date'    => '2025-02-03',
			],
			'post_id/1396|type/review-post'       => [
				'task_id' => 'review-post-1396-202507',
				'date'    => '2025-02-10',
			],
			'post_id/15417|type/review-post'      => [
				'task_id' => 'review-post-15417-202508',
				'date'    => '2025-02-17',
			],
			'post_id/720|type/review-post'        => [
				'task_id' => 'review-post-720-202509',
				'date'    => '2025-02-24',
			],
			'post_id/24800|type/review-post'      => [
				'task_id' => 'review-post-24800-202510',
				'date'    => '2025-03-03',
			],
			'post_id/784|type/review-post'        => [
				'task_id' => 'review-post-784-202511',
				'date'    => '2025-03-10',
			],
			'update-core-202508'                  => [
				'task_id' => 'update-core-202508',
				'date'    => '2025-02-17',
			],
		];

		// Add the suggested tasks to the database.
		\update_option( 'progress_planner_suggested_tasks', [ 'completed' => \array_keys( $migration_map ) ] );

		// Create a new activity for each item.
		foreach ( $migration_map as $old_task_id => $item ) {
			// Check if the activity already exists.
			$activity = \progress_planner()->get_activities__query()->query_activities(
				[
					'data_id' => $old_task_id,
				]
			);
			if ( $activity ) {
				continue;
			}
			$activity          = new \Progress_Planner\Activities\Suggested_Task();
			$activity->type    = 'completed';
			$activity->data_id = $old_task_id;

			$activity->date = \DateTime::createFromFormat( 'Y-m-d', $item['date'] );

			$activity->save();
		}

		// We have inserted the legacy data, now migrate the tasks.
		( new \Progress_Planner\Update\Update_111() )->run();

		// Verify the data was migrated.
		$tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );

		// Verify that every value in the $items array is present in the $tasks array and has completed status.
		foreach ( $migration_map as $item ) {
			$matching_tasks = \array_filter(
				$tasks,
				function ( $task ) use ( $item ) {
					return isset( $task['task_id'] ) &&
						isset( $item['task_id'] ) &&
						$task['task_id'] === $item['task_id'];
				}
			);

			$this->assertNotEmpty(
				$matching_tasks,
				\sprintf( 'Task ID "%s" not found in tasks', $item['task_id'] )
			);

			$task = \reset( $matching_tasks );
			$this->assertEquals(
				'completed',
				$task['status'],
				\sprintf( 'Task ID "%s" status is not "completed"', $item['task_id'] )
			);
		}

		// Verify that every value in the $items array has it's own activity.
		foreach ( $migration_map as $item ) {
			$activity = \progress_planner()->get_activities__query()->query_activities(
				[
					'data_id' => $item['task_id'],
				]
			);
			$this->assertNotEmpty( $activity );
		}
	}
}
