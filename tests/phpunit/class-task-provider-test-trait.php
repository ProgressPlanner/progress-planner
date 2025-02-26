<?php
/**
 * Class Task_Provider_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Local_Tasks_Manager;
use Progress_Planner\Suggested_Tasks;

/**
 * Task provider test case.
 */
trait Task_Provider_Test_Trait {

	/**
	 * The task provider instance.
	 *
	 * @var Task_Provider
	 */
	protected $task_provider;

	/**
	 * The suggested tasks instance.
	 *
	 * @var Suggested_Tasks
	 */
	protected $suggested_tasks;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		// Set the current user to the admin user.
		wp_set_current_user( 1 );
	}

	/**
	 * Tear down the test.
	 *
	 * @return void
	 */
	public static function tearDownAfterClass(): void { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		// Reset the current user.
		wp_set_current_user( 0 );
	}

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Get the task provider.
		$this->task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $this->task_provider_id );

		// Get the suggested tasks instance.
		$this->suggested_tasks = \progress_planner()->get_suggested_tasks();
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		parent::tear_down();

		// Delete local tasks.
		\progress_planner()->get_settings()->set( 'local_tasks', [] );

		// Delete suggested tasks.
		delete_option( Suggested_Tasks::OPTION_NAME );
	}

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	abstract protected function complete_task();

	/**
	 * Test transforming task data to task id and back.
	 *
	 * @return void
	 */
	public function test_task_provider() {

		// Test that the blog description is empty.
		$this->assertTrue( $this->task_provider->should_add_task() );

		// Get all tasks to inject.
		$tasks = $this->task_provider->get_tasks_to_inject();

		// Add the task(s) to the local suggested tasks.
		foreach ( $tasks as $task ) {
			$this->suggested_tasks->get_local()->add_pending_task( $task['task_id'] );
		}

		// Verify that the task(s) are in the local suggested tasks.
		$pending_tasks = (array) $this->suggested_tasks->get_local()->get_pending_tasks();
		foreach ( $tasks as $task ) {
			$this->assertContains( $task['task_id'], $pending_tasks );
		}

		// Complete the task.
		$this->complete_task();

		// Change the task status to pending celebration for all completed tasks.
		foreach ( $this->suggested_tasks->get_local()->evaluate_tasks() as $task_id ) {
			// Change the task status to pending celebration.
			$this->suggested_tasks->mark_task_as_pending_celebration( $task_id );

			// In production we insert an activity here.
		}

		// Verify that the task(s) we're testing is pending celebration.
		foreach ( $tasks as $task ) {
			$this->assertTrue(
				$this->suggested_tasks->check_task_condition(
					[
						'type'    => 'pending_celebration',
						'task_id' => $task['task_id'],
					]
				)
			);
		}

		// Verify that the task(s) we're testing is completed.
		foreach ( $tasks as $task ) {
			$this->suggested_tasks->transition_task_status( $task['task_id'], 'pending_celebration', 'completed' );
			$this->assertTrue(
				$this->suggested_tasks->check_task_condition(
					[
						'type'    => 'completed',
						'task_id' => $task['task_id'],
					]
				)
			);
		}
	}
}
