<?php
/**
 * Unit tests for Task_Factory class.
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-data-collectors-3
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks\Task_Factory;
use Progress_Planner\Suggested_Tasks\Task;

/**
 * Suggested_Tasks_Task_Factory test case.
 *
 * Tests the Task_Factory class that creates Task instances
 * from task IDs stored in the database.
 *
 * @group suggested-tasks-data-collectors-3
 */
class Suggested_Tasks_Task_Factory_Test extends WP_UnitTestCase {

	/**
	 * Test create_task_from_id with null value.
	 */
	public function test_create_task_from_id_with_null() {
		$task = Task_Factory::create_task_from_id( null );

		$this->assertInstanceOf( Task::class, $task, 'Should return Task instance' );
		$this->assertEquals( [], $task->get_data(), 'Task should have empty data' );
	}

	/**
	 * Test create_task_from_id with invalid ID.
	 */
	public function test_create_task_from_id_with_invalid_id() {
		$task = Task_Factory::create_task_from_id( 99999 );

		$this->assertInstanceOf( Task::class, $task, 'Should return Task instance' );
		$this->assertEquals( [], $task->get_data(), 'Task should have empty data for invalid ID' );
	}

	/**
	 * Test create_task_from_id returns Task instance.
	 */
	public function test_create_task_from_id_returns_task() {
		$task = Task_Factory::create_task_from_id();

		$this->assertInstanceOf( Task::class, $task, 'Should always return Task instance' );
	}
}
