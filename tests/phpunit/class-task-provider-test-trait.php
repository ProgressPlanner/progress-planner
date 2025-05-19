<?php
/**
 * Class Task_Provider_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

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
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		parent::tear_down();

		// Delete tasks.
		\progress_planner()->get_suggested_tasks()->delete_all_recommendations();
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

		// WIP, get_tasks_to_inject() is injecting tasks.
		$tasks = $this->task_provider->get_tasks_to_inject();

		// Verify that the task(s) are in the suggested tasks.
		$pending_tasks = (array) \progress_planner()->get_suggested_tasks()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider'    => $this->task_provider_id,
			]
		);

		// Assert that task is in the pending tasks.
		$this->assertTrue( has_term( $this->task_provider_id, 'prpl_recommendations_provider', $pending_tasks[0]['ID'] ) );

		// Complete the task.
		$this->complete_task();

		// Change the task status to pending celebration for all completed tasks.
		foreach ( \progress_planner()->get_suggested_tasks()->get_tasks_manager()->evaluate_tasks() as $task ) {
			// Change the task status to pending celebration.
			\progress_planner()->get_suggested_tasks()->update_recommendation(
				$task->get_data()['ID'],
				[ 'post_status' => 'pending_celebration' ]
			);

			// In production we insert an activity here.
		}

		// Verify that the task(s) we're testing is pending celebration.
		foreach ( $tasks as $post_id ) {
			$this->assertTrue( 'pending_celebration' === \get_post_status( $post_id ) );
		}

		// Verify that the task(s) we're testing is completed.
		foreach ( $tasks as $post_id ) {
			\progress_planner()->get_suggested_tasks()->update_recommendation(
				$post_id,
				[ 'post_status' => 'trash' ]
			);
			$this->assertTrue( 'trash' === \get_post_status( $post_id ) );
		}
	}
}
