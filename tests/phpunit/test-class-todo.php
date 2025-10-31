<?php
/**
 * Unit tests for Todo class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Todo;

/**
 * Todo test case.
 *
 * Tests the Todo class that manages user todo lists
 * and the GOLDEN task reward system.
 */
class Todo_Test extends WP_UnitTestCase {

	/**
	 * Todo instance.
	 *
	 * @var Todo
	 */
	private $todo;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->todo = new Todo();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );

		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );
		parent::tearDown();
	}

	/**
	 * Test constructor registers hooks.
	 */
	public function test_constructor_registers_hooks() {
		$todo = new Todo();

		$this->assertEquals(
			10,
			\has_action( 'init', [ $todo, 'maybe_change_first_item_points_on_monday' ] ),
			'init hook should be registered'
		);

		$this->assertEquals(
			10,
			\has_action( 'rest_after_insert_prpl_recommendations', [ $todo, 'handle_creating_user_task' ] ),
			'rest_after_insert_prpl_recommendations hook should be registered'
		);
	}

	/**
	 * Test maybe_change_first_item_points_on_monday with no tasks.
	 */
	public function test_maybe_change_first_item_points_on_monday_no_tasks() {
		// Ensure no user tasks exist.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'provider_id' => 'user',
				'post_status' => 'publish',
			]
		);

		foreach ( $tasks as $task ) {
			\wp_delete_post( $task->ID, true );
		}

		// Should return early without error.
		$this->todo->maybe_change_first_item_points_on_monday();

		// No assertions needed - just verifying it doesn't throw errors.
		$this->assertTrue( true );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday marks first task as GOLDEN.
	 */
	public function test_maybe_change_first_item_points_on_monday_marks_golden() {
		// Create test user tasks.
		$task1_data = [
			'post_title'  => 'Test Task 1',
			'task_id'     => 'user-task-1',
			'provider_id' => 'user',
			'post_status' => 'publish',
			'menu_order'  => 1,
		];

		$task2_data = [
			'post_title'  => 'Test Task 2',
			'task_id'     => 'user-task-2',
			'provider_id' => 'user',
			'post_status' => 'publish',
			'menu_order'  => 2,
		];

		$task1_id = \progress_planner()->get_suggested_tasks_db()->add( $task1_data );
		$task2_id = \progress_planner()->get_suggested_tasks_db()->add( $task2_data );

		// Run the method.
		$this->todo->maybe_change_first_item_points_on_monday();

		// Verify first task is GOLDEN.
		$task1 = \get_post( $task1_id );
		$this->assertEquals( 'GOLDEN', $task1->post_excerpt, 'First task should be GOLDEN' );

		// Verify second task is not GOLDEN.
		$task2 = \get_post( $task2_id );
		$this->assertEquals( '', $task2->post_excerpt, 'Second task should not be GOLDEN' );

		// Clean up.
		\wp_delete_post( $task1_id, true );
		\wp_delete_post( $task2_id, true );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday respects cache.
	 */
	public function test_maybe_change_first_item_points_on_monday_respects_cache() {
		// Create a test user task.
		$task_data = [
			'post_title'  => 'Test Task Cache',
			'task_id'     => 'user-task-cache',
			'provider_id' => 'user',
			'post_status' => 'publish',
		];

		$task_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );

		// Set cache to future time.
		\progress_planner()->get_utils__cache()->set(
			'todo_points_change_on_monday',
			\time() + HOUR_IN_SECONDS,
			WEEK_IN_SECONDS
		);

		// Clear post_excerpt to test that it doesn't get updated.
		\wp_update_post(
			[
				'ID'           => $task_id,
				'post_excerpt' => 'TEST',
			]
		);

		// Run the method - should return early due to cache.
		$this->todo->maybe_change_first_item_points_on_monday();

		// Verify task wasn't modified (still has TEST excerpt).
		$task = \get_post( $task_id );
		$this->assertEquals( 'TEST', $task->post_excerpt, 'Task should not be modified when cache is active' );

		// Clean up.
		\wp_delete_post( $task_id, true );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday sets cache.
	 */
	public function test_maybe_change_first_item_points_on_monday_sets_cache() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Create a test user task.
		$task_data = [
			'post_title'  => 'Test Task Cache Set',
			'task_id'     => 'user-task-cache-set',
			'provider_id' => 'user',
			'post_status' => 'publish',
		];

		$task_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );

		// Run the method.
		$this->todo->maybe_change_first_item_points_on_monday();

		// Verify cache was set.
		$cached = \progress_planner()->get_utils__cache()->get( 'todo_points_change_on_monday' );
		$this->assertNotFalse( $cached, 'Cache should be set' );
		$this->assertGreaterThan( \time(), $cached, 'Cache should be set to future time' );

		// Clean up.
		\wp_delete_post( $task_id, true );
	}

	/**
	 * Test handle_creating_user_task with non-user task.
	 */
	public function test_handle_creating_user_task_non_user_task() {
		// Create a non-user task post.
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
			]
		);

		// Assign non-user provider.
		\wp_set_object_terms( $post_id, 'test-provider', 'prpl_recommendations_provider' );

		$post    = \get_post( $post_id );
		$request = new \WP_REST_Request();

		// Should return early without error.
		$this->todo->handle_creating_user_task( $post, $request, true );

		$this->assertTrue( true, 'Should handle non-user task without error' );
	}

	/**
	 * Test handle_creating_user_task sets post_name.
	 */
	public function test_handle_creating_user_task_sets_post_name() {
		// Create a user task post without post_name.
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
				'post_name'   => '', // Empty slug.
			]
		);

		// Assign user provider.
		\wp_set_object_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		$post    = \get_post( $post_id );
		$request = new \WP_REST_Request();

		// Call the method.
		$this->todo->handle_creating_user_task( $post, $request, true );

		// Verify post_name was set.
		$updated_post = \get_post( $post_id );
		$this->assertEquals( 'user-' . $post_id, $updated_post->post_name, 'post_name should be set to user-{ID}' );
	}

	/**
	 * Test handle_creating_user_task marks first task as GOLDEN.
	 */
	public function test_handle_creating_user_task_first_task_golden() {
		// Ensure no user tasks exist.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => 'user' ] );
		foreach ( $tasks as $task ) {
			\wp_delete_post( $task->ID, true );
		}

		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Create first user task.
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
			]
		);

		\wp_set_object_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		$post    = \get_post( $post_id );
		$request = new \WP_REST_Request();

		// Call the method.
		$this->todo->handle_creating_user_task( $post, $request, true );

		// Verify task is marked as GOLDEN.
		$updated_post = \get_post( $post_id );
		$this->assertEquals( 'GOLDEN', $updated_post->post_excerpt, 'First user task should be GOLDEN' );
	}

	/**
	 * Test handle_creating_user_task with updating (not creating).
	 */
	public function test_handle_creating_user_task_updating() {
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
			]
		);

		\wp_set_object_terms( $post_id, 'user', 'prpl_recommendations_provider' );

		$post    = \get_post( $post_id );
		$request = new \WP_REST_Request();

		// Call with $creating = false (updating, not creating).
		$this->todo->handle_creating_user_task( $post, $request, false );

		// Should return early - verify post_name is not set.
		$updated_post = \get_post( $post_id );
		$this->assertNotEquals( 'user-' . $post_id, $updated_post->post_name, 'post_name should not be set when updating' );
	}

	/**
	 * Test multiple tasks ordering for GOLDEN status.
	 */
	public function test_multiple_tasks_golden_ordering() {
		// Create multiple user tasks with different priorities.
		$task1_data = [
			'post_title'  => 'Low Priority',
			'task_id'     => 'user-task-low',
			'provider_id' => 'user',
			'post_status' => 'publish',
			'menu_order'  => 10,
		];

		$task2_data = [
			'post_title'  => 'High Priority',
			'task_id'     => 'user-task-high',
			'provider_id' => 'user',
			'post_status' => 'publish',
			'menu_order'  => 1,
		];

		$task1_id = \progress_planner()->get_suggested_tasks_db()->add( $task1_data );
		$task2_id = \progress_planner()->get_suggested_tasks_db()->add( $task2_data );

		// Clear cache to force update.
		\progress_planner()->get_utils__cache()->delete( 'todo_points_change_on_monday' );

		// Run the method.
		$this->todo->maybe_change_first_item_points_on_monday();

		// Verify high priority task (menu_order=1) is GOLDEN.
		$task1 = \get_post( $task1_id );
		$task2 = \get_post( $task2_id );

		// The task with lower menu_order should be GOLDEN.
		$this->assertEquals( 'GOLDEN', $task2->post_excerpt, 'Task with menu_order=1 should be GOLDEN' );
		$this->assertEquals( '', $task1->post_excerpt, 'Task with menu_order=10 should not be GOLDEN' );

		// Clean up.
		\wp_delete_post( $task1_id, true );
		\wp_delete_post( $task2_id, true );
	}
}
