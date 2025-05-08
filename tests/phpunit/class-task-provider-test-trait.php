<?php
/**
 * Class Task_Provider_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

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
		$this->task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $this->task_provider_id );

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

		// Delete tasks.
		\progress_planner()->get_cpt_recommendations()->delete_all_recommendations();
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

		// Add the task(s) to the suggested tasks.
		foreach ( $tasks as $task ) {
			\progress_planner()->get_cpt_recommendations()->add( $task );
		}

		// Verify that the task(s) are in the suggested tasks.
		$pending_tasks = (array) \progress_planner()->get_settings()->get( 'tasks', [] );
		foreach ( $tasks as $task ) {
			$item_found = false;
			foreach ( $pending_tasks as $pending_task ) {
				if ( $pending_task['task_id'] === $task['task_id'] ) {
					$item_found = true;
					break;
				}
			}
			$this->assertTrue( $item_found );
		}

		// Complete the task.
		$this->complete_task();

		// Change the task status to pending celebration for all completed tasks.
		foreach ( $this->suggested_tasks->get_tasks_manager()->evaluate_tasks() as $task ) {
			// Change the task status to pending celebration.
			\progress_planner()->get_cpt_recommendations()->update_recommendation(
				$task->get_data()['ID'],
				[ 'post_status' => 'pending_celebration' ]
			);

			// In production we insert an activity here.
		}

		// Verify that the task(s) we're testing is pending celebration.
		foreach ( $tasks as $task ) {
			$this->assertTrue(
				$this->suggested_tasks->check_task_condition(
					[
						'status'  => 'pending_celebration',
						'task_id' => $task['task_id'],
					]
				)
			);
		}

		// Verify that the task(s) we're testing is completed.
		foreach ( $tasks as $task ) {
			\progress_planner()->get_cpt_recommendations()->transition_task_status( $task['task_id'], 'pending_celebration', 'completed' );
			$this->assertTrue(
				$this->suggested_tasks->check_task_condition(
					[
						'status'  => 'completed',
						'task_id' => $task['task_id'],
					]
				)
			);
		}
	}
}
