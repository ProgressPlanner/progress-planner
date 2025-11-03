<?php
/**
 * Class Activities_Suggested_Task_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activities\Suggested_Task;
use Progress_Planner\Activities\Query;

/**
 * Activities_Suggested_Task_Test test case.

 * @group activities
 */
class Activities_Suggested_Task_Test extends \WP_UnitTestCase {

	/**
	 * Suggested_Task instance.
	 *
	 * @var Suggested_Task
	 */
	protected $activity;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->activity = new Suggested_Task();

		// Clean up any existing activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );
	}

	/**
	 * Cleanup after test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );

		parent::tearDown();
	}

	/**
	 * Test that category is set to 'suggested_task'.
	 *
	 * @return void
	 */
	public function test_category_is_suggested_task() {
		$this->assertEquals( 'suggested_task', $this->activity->category );
	}

	/**
	 * Test that points_config is set to 1.
	 *
	 * @return void
	 */
	public function test_points_config() {
		$this->assertEquals( 1, Suggested_Task::$points_config );
	}

	/**
	 * Test save method creates new activity.
	 *
	 * @return void
	 */
	public function test_save_creates_activity() {
		$this->activity->type    = 'task_completed';
		$this->activity->data_id = 'test-task-123';
		$this->activity->user_id = 1;

		$this->activity->save();

		$results = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'task_completed',
			]
		);

		$this->assertCount( 1, $results );
		$this->assertEquals( 'test-task-123', $results[0]->data_id );
	}

	/**
	 * Test save method sets date if not provided.
	 *
	 * @return void
	 */
	public function test_save_sets_date() {
		$this->activity->type    = 'task_completed';
		$this->activity->data_id = 'test-task-date';
		$this->activity->user_id = 1;
		// Don't set date - should be auto-set.

		$this->activity->save();

		$results = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => 'test-task-date',
			]
		);

		$this->assertCount( 1, $results );
		$this->assertInstanceOf( \DateTime::class, $results[0]->date );
	}

	/**
	 * Test save method sets user_id if not provided.
	 *
	 * @return void
	 */
	public function test_save_sets_user_id() {
		$user_id = $this->factory->user->create();
		\wp_set_current_user( $user_id );

		$this->activity->type    = 'task_completed';
		$this->activity->data_id = 'test-task-user';
		// Don't set user_id - should be auto-set to current user.

		$this->activity->save();

		$results = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => 'test-task-user',
			]
		);

		$this->assertCount( 1, $results );
		$this->assertEquals( $user_id, $results[0]->user_id );
	}

	/**
	 * Test save method updates existing activity.
	 *
	 * @return void
	 */
	public function test_save_updates_activity() {
		$this->activity->type    = 'task_completed';
		$this->activity->data_id = 'test-task-update';
		$this->activity->user_id = 1;

		$this->activity->save();

		$results = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => 'test-task-update',
			]
		);

		$this->assertCount( 1, $results );
		$activity_id = $results[0]->id;

		// Update the activity.
		$this->activity->id   = $activity_id;
		$this->activity->type = 'task_updated';
		$this->activity->save();

		$updated_results = \progress_planner()->get_activities__query()->query_activities(
			[
				'id' => $activity_id,
			]
		);

		$this->assertCount( 1, $updated_results );
		$this->assertEquals( 'task_updated', $updated_results[0]->type );
	}

	/**
	 * Test get_points returns default value of 1.
	 *
	 * @return void
	 */
	public function test_get_points_default() {
		$this->activity->data_id = 'nonexistent-task';

		$date   = new \DateTime();
		$points = $this->activity->get_points( $date );

		$this->assertEquals( 1, $points );
	}

	/**
	 * Test get_points retrieves points from task.
	 *
	 * @return void
	 */
	public function test_get_points_from_task() {
		// Create a task with custom points.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task with Points',
				'task_id'     => 'test-task-points',
				'provider_id' => 'test-provider',
				'points'      => 5,
			]
		);

		$this->activity->data_id = 'test-task-points';

		$date   = new \DateTime();
		$points = $this->activity->get_points( $date );

		$this->assertEquals( 5, $points );

		// Clean up.
		\wp_delete_post( $task_id, true );
	}

	/**
	 * Test get_points caches the result.
	 *
	 * @return void
	 */
	public function test_get_points_caching() {
		// Create a task.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task Cache',
				'task_id'     => 'test-task-cache',
				'provider_id' => 'test-provider',
				'points'      => 3,
			]
		);

		$this->activity->data_id = 'test-task-cache';
		$date                    = new \DateTime();

		// First call - should query the database.
		$points1 = $this->activity->get_points( $date );
		$this->assertEquals( 3, $points1 );

		// Second call with same date - should use cache.
		$points2 = $this->activity->get_points( $date );
		$this->assertEquals( 3, $points2 );

		// Verify the cache is set.
		$date_ymd = $date->format( 'Ymd' );
		$this->assertArrayHasKey( $date_ymd, $this->activity->points );

		// Clean up.
		\wp_delete_post( $task_id, true );
	}

	/**
	 * Test that save triggers the progress_planner_activity_saved action.
	 *
	 * @return void
	 */
	public function test_save_triggers_action() {
		$action_fired   = false;
		$saved_activity = null;

		\add_action(
			'progress_planner_activity_saved',
			function ( $activity ) use ( &$action_fired, &$saved_activity ) {
				$action_fired   = true;
				$saved_activity = $activity;
			}
		);

		$this->activity->type    = 'task_action_test';
		$this->activity->data_id = 'test-action';
		$this->activity->user_id = 1;

		$this->activity->save();

		$this->assertTrue( $action_fired, 'Action should have been fired' );
		$this->assertInstanceOf( Suggested_Task::class, $saved_activity );
	}

	/**
	 * Test that class extends Activity.
	 *
	 * @return void
	 */
	public function test_extends_activity() {
		$this->assertInstanceOf( \Progress_Planner\Activities\Activity::class, $this->activity );
	}

	/**
	 * Test get_points with different dates returns cached values per date.
	 *
	 * @return void
	 */
	public function test_get_points_per_date_caching() {
		$this->activity->data_id = 'test-multi-date';

		$date1 = new \DateTime( '2024-01-01' );
		$date2 = new \DateTime( '2024-01-02' );

		$points1 = $this->activity->get_points( $date1 );
		$points2 = $this->activity->get_points( $date2 );

		// Both should be 1 (default) but cached separately.
		$this->assertEquals( 1, $points1 );
		$this->assertEquals( 1, $points2 );

		// Verify both dates are cached.
		$this->assertArrayHasKey( $date1->format( 'Ymd' ), $this->activity->points );
		$this->assertArrayHasKey( $date2->format( 'Ymd' ), $this->activity->points );
	}
}
