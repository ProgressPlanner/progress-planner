<?php
/**
 * Todo Integration Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Todo integration test case.
 */
class Todo_Integration_Test extends Integration_Test_Case {

	/**
	 * Test GOLDEN task assignment with real posts.
	 *
	 * @return void
	 */
	public function test_golden_task_assignment_with_real_posts() {
		// Clear cache to ensure fresh execution.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Create user tasks.
		$task_1 = $this->create_test_user_task(
			[
				'post_title' => 'Task 1',
				'menu_order' => 1,
			]
		);

		$task_2 = $this->create_test_user_task(
			[
				'post_title' => 'Task 2',
				'menu_order' => 2,
			]
		);

		// Trigger GOLDEN task assignment.
		$todo = \progress_planner()->get_todo();
		$todo->maybe_change_first_item_points_on_monday();

		// Verify first task has GOLDEN status.
		$post_1 = \get_post( $task_1 );
		$this->assertEquals( 'GOLDEN', $post_1->post_excerpt );

		// Verify second task does not have GOLDEN status.
		$post_2 = \get_post( $task_2 );
		$this->assertEquals( '', $post_2->post_excerpt );
	}

	/**
	 * Test weekly reset respects cache.
	 *
	 * @return void
	 */
	public function test_weekly_reset_respects_cache() {
		// Set cache to prevent execution.
		$next_monday = new \DateTime( 'monday next week' );
		\progress_planner()->get_utils__cache()->set(
			'todo_points_change_on_monday',
			$next_monday->getTimestamp(),
			WEEK_IN_SECONDS
		);

		$task_id = $this->create_test_user_task();

		// Clear post_excerpt first.
		\wp_update_post(
			[
				'ID'           => $task_id,
				'post_excerpt' => '',
			]
		);

		// Trigger method.
		$todo = \progress_planner()->get_todo();
		$todo->maybe_change_first_item_points_on_monday();

		// Verify task was NOT updated (cache prevented execution).
		$post = \get_post( $task_id );
		$this->assertEquals( '', $post->post_excerpt );
	}

	/**
	 * Test user task creation assigns post_name.
	 *
	 * @return void
	 */
	public function test_user_task_creation_assigns_post_name() {
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'New User Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		$request = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );

		// Simulate creating a new task.
		$todo = \progress_planner()->get_todo();
		$todo->handle_creating_user_task( \get_post( $post_id ), $request, true );

		$post = \get_post( $post_id );
		$this->assertEquals( 'user-' . $post_id, $post->post_name );
	}
}

