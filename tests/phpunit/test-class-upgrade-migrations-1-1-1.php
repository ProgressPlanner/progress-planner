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
class Upgrade_Migrations_1_1_1_Test extends \WP_UnitTestCase {

	/**
	 * Test upgrade from 1.0.0 to 1.1.0.
	 *
	 * @return void
	 */
	public function test_dataset_1() {

		// old task id => migrated task id .
		$items = [
			'update-core-202448'                  => 'update-core-202448',
			'post_id/2792|type/update-post'       => 'review-post-2792-202511',
			'post_id/2874|type/update-post'       => 'review-post-2874-202511',
			'post_id/2927|type/update-post'       => 'review-post-2927-202511',
			'post_id/2949|type/update-post'       => 'review-post-2949-202511',
			'post_id/3039|type/update-post'       => 'review-post-3039-202511',
			'date/202448|long/0|type/create-post' => 'create-post-short-202448',
			'update-core-202450'                  => 'update-core-202450',
			'post_id/4313|type/update-post'       => 'review-post-4313-202511',
			'post_id/4331|type/update-post'       => 'review-post-4331-202511',
			'post_id/4421|type/update-post'       => 'review-post-4421-202511',
			'post_id/4544|type/update-post'       => 'review-post-4544-202511',
			'post_id/2810|type/update-post'       => 'review-post-2810-202511',
			'post_id/4467|type/update-post'       => 'review-post-4467-202511',
			'update-core-202401'                  => 'update-core-202401',
			'settings-saved-202501'               => 'settings-saved-202501',
			'post_id/4530|type/update-post'       => 'review-post-4530-202511',
			'post_id/4477|type/update-post'       => 'review-post-4477-202511',
			'post_id/4569|type/update-post'       => 'review-post-4569-202511',
			'post_id/4809|type/update-post'       => 'review-post-4809-202511',
			'update-core-202502'                  => 'update-core-202502',
			'update-core-202503'                  => 'update-core-202503',
			'update-core-202504'                  => 'update-core-202504',
			'post_id/4610|type/update-post'       => 'review-post-4610-202511',
			'post_id/4847|type/update-post'       => 'review-post-4847-202511',
			'post_id/5004|type/update-post'       => 'review-post-5004-202511',
			'post_id/5070|type/update-post'       => 'review-post-5070-202511',
			'post_id/8639|type/update-post'       => 'review-post-8639-202511',
			'update-core-202505'                  => 'update-core-202505',
			'date/202505|long/1|type/create-post' => 'create-post-long-202505',
			'update-core-202506'                  => 'update-core-202506',
			'update-core-202507'                  => 'update-core-202507',
			'post_id/1237|type/review-post'       => 'review-post-1237-202511',
			'post_id/9963|type/review-post'       => 'review-post-9963-202511',
			'post_id/15391|type/review-post'      => 'review-post-15391-202511',
			'post_id/785|type/review-post'        => 'review-post-785-202511',
			'post_id/15387|type/review-post'      => 'review-post-15387-202511',
			'post_id/15413|type/review-post'      => 'review-post-15413-202511',
			'post_id/1396|type/review-post'       => 'review-post-1396-202511',
			'post_id/15417|type/review-post'      => 'review-post-15417-202511',
			'post_id/720|type/review-post'        => 'review-post-720-202511',
			'post_id/24800|type/review-post'      => 'review-post-24800-202511',
			'post_id/784|type/review-post'        => 'review-post-784-202511',
			'update-core-202508'                  => 'update-core-202508',
		];

		// Add the suggested tasks to the database.
		\update_option( 'progress_planner_suggested_tasks', [ 'completed' => array_keys( $items ) ] );

		// Create a new activity for each item.
		foreach ( $items as $item ) {
			// Check if the activity already exists.
			$activity = \progress_planner()->get_query()->query_activities(
				[
					'data_id' => $item,
				]
			);
			if ( $activity ) {
				continue;
			}
			$activity          = new \Progress_Planner\Activities\Suggested_Task();
			$activity->type    = 'completed';
			$activity->data_id = $item;

			// WIP: Try to get correct dates.
			if ( 0 === strpos( $item, 'update-core-' ) ) {
				$parts     = explode( '-', $item );
				$year_week = end( $parts );
				// Extract year and week.
				$year = substr( $year_week, 0, 4 );
				$week = substr( $year_week, 4, 2 );

				// Create a DateTime object for the first day of that week.
				$date = new \DateTime();
				$date->setISODate( $year, $week ); // Defaults to Monday.
				$activity->date = $date;
			}

			$activity->save();
		}

		// We have inserted the legacy data, now migrate the tasks.
		( new \Progress_Planner\Update\Update_111() )->run();

		// Verify the data was migrated.
		$local_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );

		// Verify that every value in the $items array is present in the $local_tasks array and has completed status.
		foreach ( $items as $item ) {
			$matching_tasks = array_filter(
				$local_tasks,
				function ( $task ) use ( $item ) {
					return $task['task_id'] === $item;
				}
			);

			$this->assertNotEmpty(
				$matching_tasks,
				sprintf( 'Task ID "%s" not found in local tasks', $item )
			);

			$task = reset( $matching_tasks );
			$this->assertEquals(
				'completed',
				$task['status'],
				sprintf( 'Task ID "%s" status is not "completed"', $item )
			);
		}

		// Verify that every value in the $items array has it's own activity.
		foreach ( $items as $item ) {
			$activity = \progress_planner()->get_query()->query_activities(
				[
					'data_id' => $item,
				]
			);
			$this->assertNotEmpty( $activity );
		}
	}
}
