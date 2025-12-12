<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Class Todo_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Todo;

/**
 * Todo test case.
 */
class Todo_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Todo
	 */
	private $todo_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->todo_instance = new Todo();
	}

	/**
	 * Test maybe_change_first_item_points_on_monday assigns GOLDEN to first task.
	 *
	 * @return void
	 */
	public function test_maybe_change_first_item_points_on_monday_assigns_golden() {
		// Create user tasks.
		$task_1 = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Task 1',
				'post_status' => 'publish',
				'menu_order'  => 1,
			]
		);

		$task_2 = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Task 2',
				'post_status' => 'publish',
				'menu_order'  => 2,
			]
		);

		\wp_set_post_terms( $task_1, 'user', 'prpl_recommendations_provider' );
		\wp_set_post_terms( $task_2, 'user', 'prpl_recommendations_provider' );

		// Clear cache to force execution.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Trigger the method.
		$this->todo_instance->maybe_change_first_item_points_on_monday();

		// Verify first task has GOLDEN status.
		$post_1 = \get_post( $task_1 );
		$this->assertEquals( 'GOLDEN', $post_1->post_excerpt );

		// Verify second task does not have GOLDEN status.
		$post_2 = \get_post( $task_2 );
		$this->assertEquals( '', $post_2->post_excerpt );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday respects cache.
	 *
	 * @return void
	 */
	public function test_maybe_change_first_item_points_on_monday_respects_cache() {
		// Create a task.
		$task_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $task_id, 'user', 'prpl_recommendations_provider' );

		// Set cache to prevent execution.
		$next_monday = new \DateTime( 'monday next week' );
		\progress_planner()->get_utils__cache()->set(
			'todo_points_change_on_monday',
			$next_monday->getTimestamp(),
			WEEK_IN_SECONDS
		);

		// Clear the post_excerpt first.
		\wp_update_post(
			[
				'ID'           => $task_id,
				'post_excerpt' => '',
			]
		);

		// Trigger the method.
		$this->todo_instance->maybe_change_first_item_points_on_monday();

		// Verify task was not updated (cache prevented execution).
		$post = \get_post( $task_id );
		$this->assertEquals( '', $post->post_excerpt );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday with no tasks.
	 *
	 * @return void
	 */
	public function test_maybe_change_first_item_points_on_monday_no_tasks() {
		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Should not throw an error.
		$this->todo_instance->maybe_change_first_item_points_on_monday();

		$this->assertTrue( true );
	}

	/**
	 * Test handle_creating_user_task assigns post_name.
	 *
	 * @return void
	 */
	public function test_handle_creating_user_task_assigns_post_name() {
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
		$this->todo_instance->handle_creating_user_task( \get_post( $post_id ), $request, true );

		$post = \get_post( $post_id );
		$this->assertEquals( 'user-' . $post_id, $post->post_name );
	}

	/**
	 * Test handle_creating_user_task assigns GOLDEN to first task.
	 *
	 * @return void
	 */
	public function test_handle_creating_user_task_first_task_golden() {
		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'First User Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		$request = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );

		// Simulate creating the first task.
		$this->todo_instance->handle_creating_user_task( \get_post( $post_id ), $request, true );

		$post = \get_post( $post_id );
		$this->assertEquals( 'GOLDEN', $post->post_excerpt );
	}

	/**
	 * Test handle_creating_user_task does not assign GOLDEN to subsequent tasks.
	 *
	 * @return void
	 */
	public function test_handle_creating_user_task_subsequent_task_not_golden() {
		// Create first task.
		$first_task_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'First Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $first_task_id, 'user', 'prpl_recommendations_provider' );

		// Create second task.
		$second_task_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Second Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $second_task_id, 'user', 'prpl_recommendations_provider' );

		$request = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );

		// Simulate creating the second task.
		$this->todo_instance->handle_creating_user_task( \get_post( $second_task_id ), $request, true );

		$post = \get_post( $second_task_id );
		$this->assertNotEquals( 'GOLDEN', $post->post_excerpt );
	}

	/**
	 * Test handle_creating_user_task ignores non-user tasks.
	 *
	 * @return void
	 */
	public function test_handle_creating_user_task_ignores_non_user_tasks() {
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Non-User Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $post_id, 'other-provider', 'prpl_recommendations_provider' );

		$request = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );

		// Should not modify the task.
		$this->todo_instance->handle_creating_user_task( \get_post( $post_id ), $request, true );

		$post = \get_post( $post_id );
		$this->assertNotEquals( 'user-' . $post_id, $post->post_name );
	}

	/**
	 * Test handle_creating_user_task ignores updates (not creating).
	 *
	 * @return void
	 */
	public function test_handle_creating_user_task_ignores_updates() {
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'User Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		$request = new \WP_REST_Request( 'PUT', '/wp/v2/prpl_recommendations/' . $post_id );

		// Simulate updating (not creating).
		$this->todo_instance->handle_creating_user_task( \get_post( $post_id ), $request, false );

		$post = \get_post( $post_id );
		$this->assertNotEquals( 'user-' . $post_id, $post->post_name );
	}
}

// phpcs:enable Generic.Commenting.Todo
