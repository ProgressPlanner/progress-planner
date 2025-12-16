<?php
/**
 * Class WP_CLI_Task_Command_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\WP_CLI\Task_Command;

/**
 * WP-CLI Task Command test case.
 *
 * Tests the WP-CLI task command methods directly within PHPUnit.
 * These tests verify the command logic works correctly by checking
 * database state changes rather than CLI output.
 */
class WP_CLI_Task_Command_Test extends \WP_UnitTestCase {

	/**
	 * Test task ID used for create/get/update/delete tests.
	 *
	 * @var string
	 */
	private $test_task_id = 'phpunit-cli-test-task';

	/**
	 * The command instance.
	 *
	 * @var Task_Command|null
	 */
	private $command;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// Skip tests if WP-CLI is not available.
		if ( ! \class_exists( 'WP_CLI' ) ) {
			$this->markTestSkipped( 'WP-CLI is not available in this environment.' );
		}

		// Load WP-CLI utils if not already loaded.
		if ( ! \function_exists( 'WP_CLI\Utils\format_items' ) ) {
			$utils_file = PROGRESS_PLANNER_DIR . '/vendor/wp-cli/wp-cli/php/utils.php';
			if ( \file_exists( $utils_file ) ) {
				require_once $utils_file;
			}
		}

		// Enable capture_exit so WP_CLI::error() throws ExitException instead of exit().
		$reflection = new \ReflectionClass( 'WP_CLI' );
		$property   = $reflection->getProperty( 'capture_exit' );
		$property->setAccessible( true );
		$property->setValue( null, true );

		$this->command = new Task_Command();
	}

	/**
	 * Clean up test task after tests.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up test task if it exists.
		if ( $this->command ) {
			$this->delete_test_task( $this->test_task_id );
		}
		parent::tearDown();
	}

	/**
	 * Helper to delete a test task silently.
	 *
	 * @param string $task_id Task ID to delete.
	 * @return void
	 */
	private function delete_test_task( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
		if ( ! empty( $tasks ) ) {
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $tasks[0]->ID );
		}
	}

	/**
	 * Helper to create a test task directly in database.
	 *
	 * @param string $task_id Task ID.
	 * @param string $title   Task title.
	 * @return void
	 */
	private function create_test_task( $task_id, $title = 'PHPUnit CLI Test Task' ) {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => $task_id,
				'post_title'  => $title,
				'description' => 'Test description',
				'points'      => 1,
				'provider_id' => 'collaborator',
				'status'      => 'pending',
			]
		);
	}

	/**
	 * Helper to get a task from database.
	 *
	 * @param string $task_id Task ID.
	 * @return object|null
	 */
	private function get_test_task( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
		return ! empty( $tasks ) ? $tasks[0] : null;
	}

	/**
	 * Run a command method while suppressing output.
	 *
	 * @param callable $callback The callback to run.
	 * @return mixed The exception thrown, or null if none.
	 */
	private function run_command( callable $callback ) {
		$exception = null;
		\ob_start();
		try {
			$callback();
		} catch ( \Exception $e ) {
			$exception = $e;
		}
		\ob_end_clean();
		return $exception;
	}

	/**
	 * Test that task list command runs without errors.
	 *
	 * @return void
	 */
	public function test_task_list() {
		// Create a task first.
		$this->create_test_task( $this->test_task_id );

		// The list method should run without throwing exceptions.
		$exception = $this->run_command( fn() => $this->command->list( [], [ 'format' => 'json' ] ) );

		$this->assertNull( $exception, 'List command should not throw an exception' );
	}

	/**
	 * Test that task list with table format runs without errors.
	 *
	 * @return void
	 */
	public function test_task_list_table_format() {
		// Create a task first so we have something to list.
		$this->create_test_task( $this->test_task_id );

		$exception = $this->run_command( fn() => $this->command->list( [], [ 'format' => 'table' ] ) );

		$this->assertNull( $exception, 'List command with table format should not throw an exception' );
	}

	/**
	 * Test task create command.
	 *
	 * @return void
	 */
	public function test_task_create() {
		$this->run_command(
			fn() => $this->command->create(
				[],
				[
					'task_id' => $this->test_task_id,
					'title'   => 'PHPUnit CLI Test Task',
				]
			)
		);

		// Verify task was created in database.
		$task = $this->get_test_task( $this->test_task_id );
		$this->assertNotNull( $task, 'Task should exist in database after create' );
		$this->assertEquals( $this->test_task_id, $task->task_id, 'Task ID should match' );
	}

	/**
	 * Test task create without required fields fails.
	 *
	 * @return void
	 */
	public function test_task_create_without_required_fields() {
		$exception = $this->run_command( fn() => $this->command->create( [], [] ) );

		// WP_CLI::error() throws ExitException.
		$this->assertInstanceOf( \WP_CLI\ExitException::class, $exception, 'Should throw ExitException for missing required fields' );
	}

	/**
	 * Test task get command.
	 *
	 * @return void
	 */
	public function test_task_get() {
		// First create a task.
		$this->create_test_task( $this->test_task_id );

		// Get should run without exception.
		$exception = $this->run_command( fn() => $this->command->get( [ $this->test_task_id ], [ 'format' => 'json' ] ) );

		$this->assertNull( $exception, 'Get command should not throw an exception for existing task' );
	}

	/**
	 * Test task get with non-existent task.
	 *
	 * @return void
	 */
	public function test_task_get_not_found() {
		$exception = $this->run_command( fn() => $this->command->get( [ 'non-existent-task-12345' ], [] ) );

		// WP_CLI::error() throws ExitException for not found.
		$this->assertInstanceOf( \WP_CLI\ExitException::class, $exception, 'Should throw ExitException for non-existent task' );
	}

	/**
	 * Test task update command.
	 *
	 * @return void
	 */
	public function test_task_update() {
		// First create a task.
		$this->create_test_task( $this->test_task_id );

		// Update should run without exception.
		$exception = $this->run_command( fn() => $this->command->update( [ $this->test_task_id ], [ 'post_status' => 'draft' ] ) );

		$this->assertNull( $exception, 'Update command should not throw an exception' );
	}

	/**
	 * Test task delete command.
	 *
	 * @return void
	 */
	public function test_task_delete() {
		// First create a task.
		$this->create_test_task( $this->test_task_id );

		// Verify task exists.
		$task = $this->get_test_task( $this->test_task_id );
		$this->assertNotNull( $task, 'Task should exist before delete' );

		// Now delete it.
		$this->run_command( fn() => $this->command->delete( [ $this->test_task_id ], [] ) );

		// Verify it's deleted.
		$task = $this->get_test_task( $this->test_task_id );
		$this->assertNull( $task, 'Task should be deleted from database' );
	}

	/**
	 * Test full CRUD cycle.
	 *
	 * @return void
	 */
	public function test_full_crud_cycle() {
		$task_id = 'phpunit-crud-test-' . \time();

		// Create.
		$this->run_command(
			fn() => $this->command->create(
				[],
				[
					'task_id'     => $task_id,
					'title'       => 'CRUD Test Task',
					'description' => 'Testing full CRUD cycle',
				]
			)
		);
		$task = $this->get_test_task( $task_id );
		$this->assertNotNull( $task, 'Task should exist after create' );

		// Read (get) - should not throw.
		$exception = $this->run_command( fn() => $this->command->get( [ $task_id ], [ 'format' => 'json' ] ) );
		$this->assertNull( $exception, 'Get should not throw for existing task' );

		// Update - should not throw.
		$exception = $this->run_command( fn() => $this->command->update( [ $task_id ], [ 'post_status' => 'draft' ] ) );
		$this->assertNull( $exception, 'Update should not throw' );

		// Delete.
		$this->run_command( fn() => $this->command->delete( [ $task_id ], [] ) );
		$task = $this->get_test_task( $task_id );
		$this->assertNull( $task, 'Task should be deleted after delete command' );
	}
}
