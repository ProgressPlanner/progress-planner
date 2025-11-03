<?php
/**
 * Unit tests for GOLDEN task system.
 *
 * @package Progress_Planner\Tests
 * @group todos
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;

// phpcs:disable Generic.Commenting.Todo.TaskFound

/**
 * Test_Todo_Golden_Tasks test case.
 *
 * Tests the GOLDEN task assignment and reset mechanism that awards
 * bonus points to the first task in the user's task list.
 *
 * @group todos
 */
class Test_Todo_Golden_Tasks extends WP_UnitTestCase {

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

		// Clear the cache to ensure fresh state.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Clean up tasks.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		parent::tear_down();
	}

	/**
	 * Test that the first task in the task list gets GOLDEN status.
	 *
	 * @return void
	 */
	public function test_golden_task_assigned_to_first_task() {
		// Create three user tasks.
		$task1_id = $this->create_user_task( 'First task', 1 );
		$task2_id = $this->create_user_task( 'Second task', 2 );
		$task3_id = $this->create_user_task( 'Third task', 3 );

		// Trigger the GOLDEN assignment.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Get the tasks and check their GOLDEN status.
		$task1 = \get_post( $task1_id );
		$task2 = \get_post( $task2_id );
		$task3 = \get_post( $task3_id );

		// First task should be GOLDEN.
		$this->assertEquals( 'GOLDEN', $task1->post_excerpt, 'First task should have GOLDEN status' );

		// Other tasks should not be GOLDEN.
		$this->assertEmpty( $task2->post_excerpt, 'Second task should not have GOLDEN status' );
		$this->assertEmpty( $task3->post_excerpt, 'Third task should not have GOLDEN status' );
	}

	/**
	 * Test that only the first task gets GOLDEN status.
	 *
	 * @return void
	 */
	public function test_only_first_task_is_golden() {
		// Create multiple tasks.
		$task_ids = [
			$this->create_user_task( 'Task 1', 1 ),
			$this->create_user_task( 'Task 2', 2 ),
			$this->create_user_task( 'Task 3', 3 ),
			$this->create_user_task( 'Task 4', 4 ),
			$this->create_user_task( 'Task 5', 5 ),
		];

		// Trigger the GOLDEN assignment.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Count how many tasks have GOLDEN status.
		$golden_count = 0;
		foreach ( $task_ids as $task_id ) {
			$task = \get_post( $task_id );
			if ( 'GOLDEN' === $task->post_excerpt ) {
				++$golden_count;
			}
		}

		// Only one task should be GOLDEN.
		$this->assertEquals( 1, $golden_count, 'Only one task should have GOLDEN status' );
	}

	/**
	 * Test that GOLDEN status updates when task order changes.
	 *
	 * @return void
	 */
	public function test_golden_task_updates_when_order_changes() {
		// Create task 2 first with higher priority (lower menu_order).
		$task2_id = $this->create_user_task( 'Task 2', 0 );
		// Create task 1 second with lower priority.
		$task1_id = $this->create_user_task( 'Task 1', 1 );

		// Trigger initial GOLDEN assignment.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Task 2 should be GOLDEN initially (it has menu_order 0).
		$task2 = \get_post( $task2_id );
		$this->assertEquals( 'GOLDEN', $task2->post_excerpt, 'Task 2 should initially be GOLDEN (menu_order 0)' );

		// Now swap the priorities.
		\wp_update_post(
			[
				'ID'         => $task1_id,
				'menu_order' => 0,
			]
		);
		\wp_update_post(
			[
				'ID'         => $task2_id,
				'menu_order' => 1,
			]
		);

		// Clear cache to allow re-run.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Clear task query cache so updated menu_order is reflected.
		\wp_cache_flush_group( 'progress_planner_get_tasks' );

		// Trigger GOLDEN reassignment.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Task 1 should now be GOLDEN, task 2 should not.
		$task1_updated = \get_post( $task1_id );
		$task2_updated = \get_post( $task2_id );

		$this->assertEquals( 'GOLDEN', $task1_updated->post_excerpt, 'Task 1 should now be GOLDEN after order swap' );
		$this->assertEmpty( $task2_updated->post_excerpt, 'Task 2 should no longer be GOLDEN after order swap' );
	}

	/**
	 * Test that cache prevents multiple runs within the same week.
	 *
	 * @return void
	 */
	public function test_golden_task_respects_weekly_cache() {
		// Create a task.
		$task_id = $this->create_user_task( 'Task 1', 1 );

		// Trigger GOLDEN assignment.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Verify task is GOLDEN.
		$task = \get_post( $task_id );
		$this->assertEquals( 'GOLDEN', $task->post_excerpt, 'Task should be GOLDEN' );

		// Manually remove GOLDEN status to test cache.
		\progress_planner()->get_suggested_tasks_db()->update_recommendation(
			$task_id,
			[ 'post_excerpt' => '' ]
		);

		// Trigger again - should not update due to cache.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Task should still be empty (not updated due to cache).
		$task_after = \get_post( $task_id );
		$this->assertEmpty( $task_after->post_excerpt, 'Task should remain empty due to cache' );

		// Clear cache and try again.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// Now it should be GOLDEN again.
		$task_final = \get_post( $task_id );
		$this->assertEquals( 'GOLDEN', $task_final->post_excerpt, 'Task should be GOLDEN after cache clear' );
	}

	/**
	 * Test that first created user task becomes GOLDEN immediately.
	 *
	 * @return void
	 */
	public function test_first_created_task_becomes_golden_immediately() {
		// Simulate REST API task creation by calling the handler directly.
		$task_id = $this->create_user_task( 'First task', 1 );

		// Get the task.
		$task = \get_post( $task_id );

		// Create a mock request.
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/recommendations' );

		// Trigger the creation handler.
		\progress_planner()->get_todo()->handle_creating_user_task( $task, $request, true );

		// Verify the task is GOLDEN.
		$task_updated = \get_post( $task_id );
		$this->assertEquals( 'GOLDEN', $task_updated->post_excerpt, 'First created task should be GOLDEN immediately' );
	}

	/**
	 * Test that no GOLDEN task is assigned when there are no tasks.
	 *
	 * @return void
	 */
	public function test_no_golden_task_when_empty() {
		// Ensure no tasks exist.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Trigger GOLDEN assignment - should not error.
		\progress_planner()->get_todo()->maybe_change_first_item_points_on_monday();

		// No assertions needed - just verify no errors occurred.
		$this->assertTrue( true, 'Should not error when no tasks exist' );
	}

	/**
	 * Helper method to create a user task.
	 *
	 * @param string $title      The task title.
	 * @param int    $menu_order The task order (lower = higher priority).
	 *
	 * @return int The task post ID.
	 */
	protected function create_user_task( $title, $menu_order = 0 ) {
		// Create a task post.
		$post_id = \wp_insert_post(
			[
				'post_type'    => 'prpl_recommendations',
				'post_title'   => $title,
				'post_status'  => 'publish',
				'post_excerpt' => '',
				'menu_order'   => $menu_order,
			]
		);

		// Assign the 'user' provider taxonomy term.
		\wp_set_object_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		return $post_id;
	}
}
