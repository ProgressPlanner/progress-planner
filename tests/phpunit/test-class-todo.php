<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Class Todo_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Todo test case.
 */
class Todo_Test extends \WP_UnitTestCase {

	/**
	 * The Todo instance.
	 *
	 * @var \Progress_Planner\Todo
	 */
	private $todo;

	/**
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();
		$this->todo = new \Progress_Planner\Todo();
	}

	/**
	 * Test constructor hooks are registered.
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, has_action( 'init', [ $this->todo, 'maybe_change_first_item_points_on_monday' ] ) );
		$this->assertEquals( 10, has_action( 'rest_after_insert_prpl_recommendations', [ $this->todo, 'handle_creating_user_task' ] ) );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday with no tasks.
	 */
	public function test_maybe_change_first_item_points_on_monday_no_tasks() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Should return early if there are no tasks.
		$this->todo->maybe_change_first_item_points_on_monday();

		// No assertions needed - just verify it doesn't throw an error.
		$this->assertTrue( true );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday with tasks.
	 */
	public function test_maybe_change_first_item_points_on_monday_with_tasks() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Create test tasks.
		$task1 = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Test Task 1',
				'post_status' => 'publish',
			]
		);

		$task2 = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Test Task 2',
				'post_status' => 'publish',
			]
		);

		// Set the provider to 'user'.
		wp_set_object_terms( $task1, 'user', 'prpl_recommendations_provider' );
		wp_set_object_terms( $task2, 'user', 'prpl_recommendations_provider' );

		// Clear the cache so the transient check doesn't prevent the update.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Run the method.
		$this->todo->maybe_change_first_item_points_on_monday();

		// Get the tasks.
		$task1_post = get_post( $task1 );
		$task2_post = get_post( $task2 );

		// The first task should be golden.
		$this->assertEquals( 'GOLDEN', $task1_post->post_excerpt );

		// The second task should not be golden.
		$this->assertEquals( '', $task2_post->post_excerpt );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday respects cache.
	 */
	public function test_maybe_change_first_item_points_on_monday_respects_cache() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Create a test task.
		$task1 = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Test Task',
				'post_status' => 'publish',
			]
		);

		wp_set_object_terms( $task1, 'user', 'prpl_recommendations_provider' );

		// Set the cache to a future time.
		\progress_planner()->get_utils__cache()->set( 'todo_points_change_on_monday', time() + 3600, 3600 );

		// Run the method.
		$this->todo->maybe_change_first_item_points_on_monday();

		// The task should not be updated because the cache is still valid.
		$task1_post = get_post( $task1 );
		$this->assertEquals( '', $task1_post->post_excerpt );
	}

	/**
	 * Test handle_creating_user_task for first user task.
	 */
	public function test_handle_creating_user_task_first_task() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Create a test task.
		$task_id = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'User Task 1',
				'post_status' => 'publish',
			]
		);

		wp_set_object_terms( $task_id, 'user', 'prpl_recommendations_provider' );

		$post    = get_post( $task_id );
		$request = new \WP_REST_Request();

		// Clear the cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Run the method.
		$this->todo->handle_creating_user_task( $post, $request, true );

		// Check that the task_id meta was added.
		$this->assertEquals( 'user-' . $task_id, get_post_meta( $task_id, 'prpl_task_id', true ) );

		// The first task should be golden.
		$task_post = get_post( $task_id );
		$this->assertEquals( 'GOLDEN', $task_post->post_excerpt );
	}

	/**
	 * Test handle_creating_user_task for non-first user task.
	 */
	public function test_handle_creating_user_task_not_first_task() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Create the first task.
		$task1 = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'User Task 1',
				'post_status' => 'publish',
			]
		);
		wp_set_object_terms( $task1, 'user', 'prpl_recommendations_provider' );

		// Clear the cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Create the second task.
		$task2 = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'User Task 2',
				'post_status' => 'publish',
			]
		);
		wp_set_object_terms( $task2, 'user', 'prpl_recommendations_provider' );

		$post    = get_post( $task2 );
		$request = new \WP_REST_Request();

		// Run the method for the second task.
		$this->todo->handle_creating_user_task( $post, $request, true );

		// Check that the task_id meta was added.
		$this->assertEquals( 'user-' . $task2, get_post_meta( $task2, 'prpl_task_id', true ) );

		// The second task should not be golden (first one should be).
		$task2_post = get_post( $task2 );
		$this->assertEquals( '', $task2_post->post_excerpt );
	}

	/**
	 * Test handle_creating_user_task when not creating.
	 */
	public function test_handle_creating_user_task_not_creating() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Create a test task.
		$task_id = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'User Task',
				'post_status' => 'publish',
			]
		);

		wp_set_object_terms( $task_id, 'user', 'prpl_recommendations_provider' );

		$post    = get_post( $task_id );
		$request = new \WP_REST_Request();

		// Run the method with $creating = false.
		$this->todo->handle_creating_user_task( $post, $request, false );

		// The task_id meta should not be added.
		$this->assertEquals( '', get_post_meta( $task_id, 'prpl_task_id', true ) );
	}

	/**
	 * Test handle_creating_user_task for non-user task.
	 */
	public function test_handle_creating_user_task_non_user_provider() {
		// Register the custom post type.
		\progress_planner()->get_suggested_tasks();

		// Create a test task with a different provider.
		$task_id = wp_insert_post(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'System Task',
				'post_status' => 'publish',
			]
		);

		wp_set_object_terms( $task_id, 'system', 'prpl_recommendations_provider' );

		$post    = get_post( $task_id );
		$request = new \WP_REST_Request();

		// Run the method.
		$this->todo->handle_creating_user_task( $post, $request, true );

		// The task_id meta should not be added.
		$this->assertEquals( '', get_post_meta( $task_id, 'prpl_task_id', true ) );
	}
}
// phpcs:enable Generic.Commenting.Todo
