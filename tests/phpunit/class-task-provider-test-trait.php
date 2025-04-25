<?php
/**
 * Class Task_Provider_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Recommendations;

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
	 * The recommendations instance.
	 *
	 * @var Recommendations
	 */
	protected $recommendations;

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
		$this->task_provider = \progress_planner()->get_recommendations()->get_local()->get_task_provider( $this->task_provider_id );

		// Get the recommendations instance.
		$this->recommendations = \progress_planner()->get_recommendations();
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		parent::tear_down();

		// Delete all posts in the 'prpl_recommendations' post type.
		foreach ( get_posts(
			[
				'post_type'      => 'prpl_recommendations',
				'posts_per_page' => -1,
			]
		) as $post ) {
			wp_delete_post( $post->ID, true );
		}
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
			$this->recommendations->get_local()->add_pending_task( $task );
		}

		// Verify that the task(s) are in the local suggested tasks.
		$pending_tasks = (array) \progress_planner()->get_settings()->get( 'local_tasks', [] );
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
		foreach ( $this->recommendations->get_local()->evaluate_tasks() as $task ) {
			// Change the task status to pending celebration.
			\progress_planner()->get_recommendations()->mark_task_as( 'pending_celebration', $task->get_data()['task_id'] );

			// In production we insert an activity here.
		}

		// Verify that the task(s) we're testing is pending celebration.
		foreach ( $tasks as $task ) {
			$this->assertEquals( 'draft', get_post_status( $task['task_id'] ) );
		}

		// Verify that the task(s) we're testing is completed.
		foreach ( $tasks as $task ) {
			$this->recommendations->transition_task_status( (int) $task['task_id'], 'draft', 'trash' );
			$this->assertEquals( 'trash', get_post_status( $task['task_id'] ) );
		}
	}
}
