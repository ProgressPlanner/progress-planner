<?php
/**
 * Unit tests for distributed locking mechanism in task creation.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;

/**
 * Test_Suggested_Tasks_DB_Locking test case.
 *
 * Tests the distributed locking mechanism that prevents race conditions
 * when multiple processes attempt to create the same task simultaneously.
 */
class Test_Suggested_Tasks_DB_Locking extends WP_UnitTestCase {

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Set current user to admin.
		\wp_set_current_user( 1 );

		// Clean up any existing tasks.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Clean up any locks.
		$this->cleanup_locks();
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Clean up tasks.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Clean up locks.
		$this->cleanup_locks();

		parent::tear_down();
	}

	/**
	 * Test that lock prevents duplicate task creation.
	 *
	 * @return void
	 */
	public function test_lock_prevents_duplicate_task_creation() {
		$task_data = [
			'task_id'     => 'test-task-lock-' . \uniqid(),
			'post_title'  => 'Test Task Lock',
			'description' => 'Testing lock mechanism',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		// Create the task.
		$task_id_1 = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertGreaterThan( 0, $task_id_1, 'First task should be created successfully' );

		// Try to create the same task again - should return existing task ID (lock prevents duplicate).
		$task_id_2 = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertEquals( $task_id_1, $task_id_2, 'Second attempt should return existing task ID' );

		// Verify both IDs point to the same task post.
		$this->assertEquals( $task_id_1, $task_id_2, 'Lock should prevent duplicate task creation by returning same ID' );
	}

	/**
	 * Test that lock is acquired before task creation.
	 *
	 * @return void
	 */
	public function test_lock_is_acquired() {
		$task_id   = 'test-task-acquire-lock';
		$lock_key  = 'prpl_task_lock_' . $task_id;
		$task_data = [
			'task_id'     => $task_id,
			'post_title'  => 'Test Lock Acquisition',
			'description' => 'Testing that lock is acquired',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		// Manually acquire the lock to simulate another process holding it.
		\add_option( $lock_key, \time(), '', false );

		// Try to create the task - should fail due to lock.
		$result = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertEquals( 0, $result, 'Task creation should fail when lock is held' );

		// Release the lock.
		\delete_option( $lock_key );

		// Try again - should succeed now.
		$result_after = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertGreaterThan( 0, $result_after, 'Task creation should succeed after lock is released' );
	}

	/**
	 * Test that stale locks are cleaned up after 30 seconds.
	 *
	 * @return void
	 */
	public function test_stale_lock_cleanup() {
		$task_id  = 'test-task-stale-lock';
		$lock_key = 'prpl_task_lock_' . $task_id;

		// Create a stale lock (more than 30 seconds old).
		$stale_timestamp = \time() - 35;
		\add_option( $lock_key, $stale_timestamp, '', false );

		// Verify lock exists and is stale.
		$lock_value = \get_option( $lock_key );
		$this->assertEquals( $stale_timestamp, $lock_value, 'Stale lock should exist' );
		$this->assertLessThan( \time() - 30, $lock_value, 'Lock should be older than 30 seconds' );

		// Try to create a task - should succeed by overriding stale lock.
		$task_data = [
			'task_id'     => $task_id,
			'post_title'  => 'Test Stale Lock',
			'description' => 'Testing stale lock cleanup',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		$task_id_result = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertGreaterThan( 0, $task_id_result, 'Task should be created after stale lock cleanup' );

		// Verify task was created.
		$task = \get_post( $task_id_result );
		$this->assertNotNull( $task, 'Task should exist' );
		$this->assertEquals( 'Test Stale Lock', $task->post_title, 'Task title should match' );
	}

	/**
	 * Test that fresh locks (less than 30 seconds) are not overridden.
	 *
	 * @return void
	 */
	public function test_fresh_lock_is_not_overridden() {
		$task_id  = 'test-task-fresh-lock';
		$lock_key = 'prpl_task_lock_' . $task_id;

		// Create a fresh lock (less than 30 seconds old).
		$fresh_timestamp = \time() - 10;
		\add_option( $lock_key, $fresh_timestamp, '', false );

		// Try to create a task - should fail because lock is fresh.
		$task_data = [
			'task_id'     => $task_id,
			'post_title'  => 'Test Fresh Lock',
			'description' => 'Testing fresh lock protection',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		$result = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertEquals( 0, $result, 'Task creation should fail when fresh lock exists' );

		// Verify lock still has the original value.
		$lock_value = \get_option( $lock_key );
		$this->assertEquals( $fresh_timestamp, $lock_value, 'Lock should retain original timestamp' );
	}

	/**
	 * Test that lock is released after successful task creation.
	 *
	 * @return void
	 */
	public function test_lock_is_released_after_creation() {
		$task_id  = 'test-task-release-lock';
		$lock_key = 'prpl_task_lock_' . $task_id;

		$task_data = [
			'task_id'     => $task_id,
			'post_title'  => 'Test Lock Release',
			'description' => 'Testing lock release',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		// Create task.
		$task_id_result = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertGreaterThan( 0, $task_id_result, 'Task should be created' );

		// Verify lock was released.
		$lock_value = \get_option( $lock_key );
		$this->assertFalse( $lock_value, 'Lock should be released after task creation' );
	}

	/**
	 * Test that lock is released when task already exists.
	 *
	 * @return void
	 */
	public function test_lock_is_released_when_task_exists() {
		$task_id  = 'test-task-exists-lock';
		$lock_key = 'prpl_task_lock_' . $task_id;

		$task_data = [
			'task_id'     => $task_id,
			'post_title'  => 'Test Existing Task Lock',
			'description' => 'Testing lock release for existing task',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		// Create task first.
		$first_task_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertGreaterThan( 0, $first_task_id, 'First task should be created' );

		// Verify lock was released.
		$this->assertFalse( \get_option( $lock_key ), 'Lock should be released after first creation' );

		// Try to create same task again.
		$second_task_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertEquals( $first_task_id, $second_task_id, 'Should return existing task ID' );

		// Verify lock is still released (not left hanging).
		$this->assertFalse( \get_option( $lock_key ), 'Lock should remain released' );
	}

	/**
	 * Test concurrent task creation attempts.
	 *
	 * Simulates multiple processes trying to create the same task.
	 *
	 * @return void
	 */
	public function test_concurrent_task_creation() {
		$task_id = 'test-task-concurrent-' . \uniqid();

		$task_data = [
			'task_id'     => $task_id,
			'post_title'  => 'Test Concurrent Creation',
			'description' => 'Testing concurrent task creation',
			'priority'    => 50,
			'provider_id' => 'test-provider',
		];

		// Simulate 5 concurrent creation attempts.
		$created_ids = [];
		for ( $i = 0; $i < 5; $i++ ) {
			$result = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
			if ( $result > 0 ) {
				$created_ids[] = $result;
			}
		}

		// All successful attempts should return the same ID (lock working correctly).
		$unique_ids = \array_unique( $created_ids );
		$this->assertCount( 1, $unique_ids, 'All creation attempts should return the same task ID' );

		// Verify the task was created successfully.
		$final_task = \get_post( $created_ids[0] );
		$this->assertNotNull( $final_task, 'Task should exist' );
		$this->assertEquals( $task_id, $final_task->post_name, 'Task slug should match' );
	}

	/**
	 * Clean up any lock options.
	 *
	 * @return void
	 */
	protected function cleanup_locks() {
		global $wpdb;

		// Delete all lock options.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
				$wpdb->esc_like( 'prpl_task_lock_' ) . '%'
			)
		);
	}
}
