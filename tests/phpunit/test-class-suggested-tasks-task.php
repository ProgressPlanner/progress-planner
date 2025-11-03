<?php
/**
 * Unit tests for Task class.
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 * @group suggested-tasks-data-collectors-3
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks\Task;

/**
 * Suggested_Tasks_Task test case.
 *
 * Tests the Task class that represents a suggested task
 * with various properties and methods for task management.
 */
class Suggested_Tasks_Task_Test extends WP_UnitTestCase {

	/**
	 * Test task constructor and get_data.
	 */
	public function test_constructor_and_get_data() {
		$data = [
			'ID'         => 123,
			'post_title' => 'Test Task',
			'priority'   => 50,
		];

		$task = new Task( $data );

		$this->assertEquals( $data, $task->get_data(), 'Task data should match constructor input' );
	}

	/**
	 * Test set_data method.
	 */
	public function test_set_data() {
		$task = new Task( [ 'ID' => 123 ] );

		$new_data = [
			'ID'         => 456,
			'post_title' => 'Updated Task',
		];

		$task->set_data( $new_data );

		$this->assertEquals( $new_data, $task->get_data(), 'Task data should be updated' );
	}

	/**
	 * Test magic getter.
	 */
	public function test_magic_getter() {
		$data = [
			'ID'         => 123,
			'post_title' => 'Test Task',
			'priority'   => 50,
		];

		$task = new Task( $data );

		$this->assertEquals( 123, $task->ID, 'Magic getter should return ID' );
		$this->assertEquals( 'Test Task', $task->post_title, 'Magic getter should return post_title' );
		$this->assertEquals( 50, $task->priority, 'Magic getter should return priority' );
		$this->assertNull( $task->nonexistent, 'Magic getter should return null for nonexistent property' );
	}

	/**
	 * Test is_snoozed method.
	 */
	public function test_is_snoozed() {
		// Test snoozed task.
		$snoozed_task = new Task( [ 'post_status' => 'future' ] );
		$this->assertTrue( $snoozed_task->is_snoozed(), 'Task with future status should be snoozed' );

		// Test non-snoozed task.
		$active_task = new Task( [ 'post_status' => 'publish' ] );
		$this->assertFalse( $active_task->is_snoozed(), 'Task with publish status should not be snoozed' );

		// Test task without status.
		$no_status_task = new Task( [] );
		$this->assertFalse( $no_status_task->is_snoozed(), 'Task without status should not be snoozed' );
	}

	/**
	 * Test snoozed_until method.
	 */
	public function test_snoozed_until() {
		// Test task with valid date.
		$date     = '2025-12-31 23:59:59';
		$task     = new Task( [ 'post_date' => $date ] );
		$result   = $task->snoozed_until();
		$expected = \DateTime::createFromFormat( 'Y-m-d H:i:s', $date );

		$this->assertInstanceOf( \DateTime::class, $result, 'Should return DateTime object' );
		$this->assertEquals( $expected->format( 'Y-m-d H:i:s' ), $result->format( 'Y-m-d H:i:s' ), 'Dates should match' );

		// Test task without date.
		$no_date_task = new Task( [] );
		$this->assertNull( $no_date_task->snoozed_until(), 'Should return null when no post_date' );

		// Test task with invalid date format.
		$invalid_date_task = new Task( [ 'post_date' => 'invalid-date' ] );
		$this->assertFalse( $invalid_date_task->snoozed_until(), 'Should return false for invalid date format' );
	}

	/**
	 * Test is_completed method.
	 */
	public function test_is_completed() {
		// Test trash status (completed).
		$trash_task = new Task( [ 'post_status' => 'trash' ] );
		$this->assertTrue( $trash_task->is_completed(), 'Task with trash status should be completed' );

		// Test pending status (completed - celebration mode).
		$pending_task = new Task( [ 'post_status' => 'pending' ] );
		$this->assertTrue( $pending_task->is_completed(), 'Task with pending status should be completed' );

		// Test publish status (not completed).
		$active_task = new Task( [ 'post_status' => 'publish' ] );
		$this->assertFalse( $active_task->is_completed(), 'Task with publish status should not be completed' );

		// Test future status (not completed).
		$snoozed_task = new Task( [ 'post_status' => 'future' ] );
		$this->assertFalse( $snoozed_task->is_completed(), 'Task with future status should not be completed' );
	}

	/**
	 * Test get_provider_id method.
	 */
	public function test_get_provider_id() {
		// Test with provider object.
		$provider       = new \stdClass();
		$provider->slug = 'test-provider';
		$task           = new Task( [ 'provider' => $provider ] );

		$this->assertEquals( 'test-provider', $task->get_provider_id(), 'Should return provider slug' );

		// Test without provider.
		$no_provider_task = new Task( [] );
		$this->assertEquals( '', $no_provider_task->get_provider_id(), 'Should return empty string when no provider' );
	}

	/**
	 * Test get_task_id method.
	 */
	public function test_get_task_id() {
		// Test with task_id.
		$task = new Task( [ 'task_id' => 'task-123' ] );
		$this->assertEquals( 'task-123', $task->get_task_id(), 'Should return task_id' );

		// Test without task_id.
		$no_id_task = new Task( [] );
		$this->assertEquals( '', $no_id_task->get_task_id(), 'Should return empty string when no task_id' );
	}

	/**
	 * Test update method (without database interaction).
	 */
	public function test_update_without_id() {
		$task = new Task( [ 'title' => 'Original' ] );
		$task->update( [ 'title' => 'Updated' ] );

		$this->assertEquals( [ 'title' => 'Updated' ], $task->get_data(), 'Data should be updated even without ID' );
	}

	/**
	 * Test delete method (without database interaction).
	 */
	public function test_delete_without_id() {
		$task = new Task( [ 'title' => 'Test Task' ] );
		$task->delete();

		$this->assertEquals( [], $task->get_data(), 'Data should be cleared after delete' );
	}

	/**
	 * Test get_rest_formatted_data with invalid post.
	 */
	public function test_get_rest_formatted_data_invalid_post() {
		$task   = new Task( [] );
		$result = $task->get_rest_formatted_data( 99999 );

		$this->assertEquals( [], $result, 'Should return empty array for invalid post ID' );
	}

	/**
	 * Test get_rest_formatted_data with valid post.
	 */
	public function test_get_rest_formatted_data_valid_post() {
		// Create a test post.
		$post_id = $this->factory->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		$task   = new Task( [ 'ID' => $post_id ] );
		$result = $task->get_rest_formatted_data();

		$this->assertIsArray( $result, 'Should return array' );
		$this->assertArrayHasKey( 'id', $result, 'Should have id key' );
		$this->assertEquals( $post_id, $result['id'], 'ID should match' );
	}
}
