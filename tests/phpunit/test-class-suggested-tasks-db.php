<?php
/**
 * Tests for the Suggested Tasks DB class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks_DB;
use WP_UnitTestCase;

/**
 * Test the Suggested Tasks DB class.
 */
class Test_Suggested_Tasks_DB extends WP_UnitTestCase {

	/**
	 * The Suggested_Tasks_DB instance.
	 *
	 * @var Suggested_Tasks_DB
	 */
	private $db;

	/**
	 * Set up before each test.
	 */
	public function set_up() {
		parent::set_up();
		$this->db = new Suggested_Tasks_DB();

		// Clean up existing tasks.
		$this->db->delete_all_recommendations();
		\wp_cache_flush_group( Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );
	}

	/**
	 * Tear down after each test.
	 */
	public function tear_down() {
		$this->db->delete_all_recommendations();
		\wp_cache_flush_group( Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );
		parent::tear_down();
	}

	/**
	 * Test adding a task.
	 */
	public function test_add_task() {
		$data = [
			'task_id'     => 'test-task-1',
			'post_title'  => 'Test Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'order'       => 10,
		];

		$post_id = $this->db->add( $data );

		$this->assertGreaterThan( 0, $post_id );
		$this->assertEquals( 'prpl_recommendations', \get_post_type( $post_id ) );
	}

	/**
	 * Test adding a task without a title returns 0.
	 */
	public function test_add_task_without_title() {
		$data = [
			'task_id'     => 'test-task-no-title',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db->add( $data );

		$this->assertEquals( 0, $post_id );
	}

	/**
	 * Test that duplicate tasks are not created.
	 */
	public function test_duplicate_task_prevention() {
		$data = [
			'task_id'     => 'duplicate-task',
			'post_title'  => 'Duplicate Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
		];

		$post_id1 = $this->db->add( $data );
		$post_id2 = $this->db->add( $data );

		$this->assertEquals( $post_id1, $post_id2 );
	}

	/**
	 * Test adding a task with pending status.
	 */
	public function test_add_task_pending_status() {
		$data = [
			'task_id'     => 'pending-task',
			'post_title'  => 'Pending Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'post_status' => 'pending',
		];

		$post_id = $this->db->add( $data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'pending', $post->post_status );
	}

	/**
	 * Test adding a task with completed status (should be trash).
	 */
	public function test_add_task_completed_status() {
		$data = [
			'task_id'     => 'completed-task',
			'post_title'  => 'Completed Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'post_status' => 'completed',
		];

		$post_id = $this->db->add( $data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'trash', $post->post_status );
	}

	/**
	 * Test adding a task with trash status.
	 */
	public function test_add_task_trash_status() {
		$data = [
			'task_id'     => 'trash-task',
			'post_title'  => 'Trash Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'post_status' => 'trash',
		];

		$post_id = $this->db->add( $data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'trash', $post->post_status );
	}

	/**
	 * Test adding a snoozed task.
	 */
	public function test_add_task_snoozed_status() {
		$snooze_time = \time() + DAY_IN_SECONDS;
		$data        = [
			'task_id'     => 'snoozed-task',
			'post_title'  => 'Snoozed Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'post_status' => 'snoozed',
			'time'        => $snooze_time,
		];

		$post_id = $this->db->add( $data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'future', $post->post_status );
	}

	/**
	 * Test adding a task with priority (should map to order).
	 */
	public function test_add_task_with_priority() {
		$data = [
			'task_id'     => 'priority-task',
			'post_title'  => 'Priority Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'priority'    => 5,
		];

		$post_id = $this->db->add( $data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 5, $post->menu_order );
	}

	/**
	 * Test adding a task with parent.
	 */
	public function test_add_task_with_parent() {
		// Create parent task.
		$parent_data = [
			'task_id'     => 'parent-task',
			'post_title'  => 'Parent Task',
			'description' => 'Parent Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
		];
		$parent_id   = $this->db->add( $parent_data );

		// Create child task.
		$child_data = [
			'task_id'     => 'child-task',
			'post_title'  => 'Child Task',
			'description' => 'Child Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'parent'      => $parent_id,
		];
		$child_id   = $this->db->add( $child_data );

		$child_post = \get_post( $child_id );
		$this->assertEquals( $parent_id, $child_post->post_parent );
	}

	/**
	 * Test adding a task with custom meta.
	 */
	public function test_add_task_with_custom_meta() {
		$data = [
			'task_id'     => 'meta-task',
			'post_title'  => 'Meta Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
			'custom_key'  => 'custom_value',
		];

		$post_id = $this->db->add( $data );
		$meta    = \get_post_meta( $post_id, 'prpl_custom_key', true );

		$this->assertEquals( 'custom_value', $meta );
	}

	/**
	 * Test task locking mechanism.
	 */
	public function test_task_locking() {
		$data = [
			'task_id'     => 'locked-task',
			'post_title'  => 'Locked Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
		];

		// Add the task.
		$post_id1 = $this->db->add( $data );

		// Manually set a fresh lock to simulate concurrent request.
		$lock_key = 'prpl_task_lock_locked-task';
		\update_option( $lock_key, \time() );

		// Try to add the same task again - should be blocked by lock.
		$post_id2 = $this->db->add( $data );

		// Should return 0 because lock is active.
		$this->assertEquals( 0, $post_id2 );

		// Clean up.
		\delete_option( $lock_key );
	}

	/**
	 * Test stale lock takeover.
	 */
	public function test_stale_lock_takeover() {
		$data = [
			'task_id'     => 'stale-lock-task',
			'post_title'  => 'Stale Lock Task',
			'description' => 'Test Description',
			'category'    => 'onboarding',
			'provider_id' => 'test-provider',
		];

		// Manually create a stale lock (older than 30 seconds).
		$lock_key   = 'prpl_task_lock_stale-lock-task';
		$stale_time = \time() - 60; // 60 seconds ago.
		\update_option( $lock_key, $stale_time );

		// Try to add the task - should take over the stale lock.
		$post_id = $this->db->add( $data );

		$this->assertGreaterThan( 0, $post_id );

		// Lock should be deleted after add completes.
		$this->assertFalse( \get_option( $lock_key ) );
	}

	/**
	 * Test getting all tasks.
	 */
	public function test_get_all_tasks() {
		// Create multiple tasks.
		for ( $i = 1; $i <= 3; $i++ ) {
			$this->db->add(
				[
					'task_id'     => "task-$i",
					'post_title'  => "Task $i",
					'description' => "Description $i",
					'category'    => 'onboarding',
					'provider_id' => 'test-provider',
				]
			);
		}

		$tasks = $this->db->get();

		$this->assertCount( 3, $tasks );
		$this->assertInstanceOf( 'Progress_Planner\Suggested_Tasks\Task', $tasks[0] );
	}

	/**
	 * Test getting tasks by provider.
	 */
	public function test_get_tasks_by_provider() {
		$this->db->add(
			[
				'task_id'     => 'provider-1-task',
				'post_title'  => 'Provider 1 Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'provider-1',
			]
		);

		$this->db->add(
			[
				'task_id'     => 'provider-2-task',
				'post_title'  => 'Provider 2 Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'provider-2',
			]
		);

		$tasks = $this->db->get_tasks_by( [ 'provider_id' => 'provider-1' ] );

		$this->assertCount( 1, $tasks );
		$this->assertEquals( 'provider-1', $tasks[0]->get_provider_id() );
	}

	/**
	 * Test getting tasks by category.
	 */
	public function test_get_tasks_by_category() {
		$this->db->add(
			[
				'task_id'     => 'cat-1-task',
				'post_title'  => 'Category 1 Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		$this->db->add(
			[
				'task_id'     => 'cat-2-task',
				'post_title'  => 'Category 2 Task',
				'description' => 'Description',
				'category'    => 'content',
				'provider_id' => 'test-provider',
			]
		);

		$tasks = $this->db->get_tasks_by( [ 'category' => 'onboarding' ] );

		$this->assertCount( 1, $tasks );
		$this->assertEquals( 'onboarding', $tasks[0]->get_category() );
	}

	/**
	 * Test getting task by task_id.
	 */
	public function test_get_tasks_by_task_id() {
		$this->db->add(
			[
				'task_id'     => 'specific-task',
				'post_title'  => 'Specific Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		$tasks = $this->db->get_tasks_by( [ 'task_id' => 'specific-task' ] );

		$this->assertCount( 1, $tasks );
		$this->assertEquals( 'specific-task', $tasks[0]->task_id );
	}

	/**
	 * Test getting a post by post ID.
	 */
	public function test_get_post_by_id() {
		$post_id = $this->db->add(
			[
				'task_id'     => 'get-by-id-task',
				'post_title'  => 'Get By ID Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		$task = $this->db->get_post( $post_id );

		$this->assertInstanceOf( 'Progress_Planner\Suggested_Tasks\Task', $task );
		$this->assertEquals( $post_id, $task->ID );
	}

	/**
	 * Test getting a post by task ID.
	 */
	public function test_get_post_by_task_id() {
		$this->db->add(
			[
				'task_id'     => 'get-by-task-id',
				'post_title'  => 'Get By Task ID',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		$task = $this->db->get_post( 'get-by-task-id' );

		$this->assertInstanceOf( 'Progress_Planner\Suggested_Tasks\Task', $task );
		$this->assertEquals( 'get-by-task-id', $task->task_id );
	}

	/**
	 * Test getting a non-existent post returns false.
	 */
	public function test_get_post_nonexistent() {
		$task = $this->db->get_post( 99999 );
		$this->assertFalse( $task );
	}

	/**
	 * Test deleting a recommendation.
	 */
	public function test_delete_recommendation() {
		$post_id = $this->db->add(
			[
				'task_id'     => 'delete-task',
				'post_title'  => 'Delete Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		$result = $this->db->delete_recommendation( $post_id );

		$this->assertTrue( $result );
		$this->assertNull( \get_post( $post_id ) );
	}

	/**
	 * Test deleting all recommendations.
	 */
	public function test_delete_all_recommendations() {
		// Create multiple tasks.
		for ( $i = 1; $i <= 3; $i++ ) {
			$this->db->add(
				[
					'task_id'     => "delete-all-task-$i",
					'post_title'  => "Delete All Task $i",
					'description' => "Description $i",
					'category'    => 'onboarding',
					'provider_id' => 'test-provider',
				]
			);
		}

		// Verify they exist.
		$tasks_before = $this->db->get();
		$this->assertCount( 3, $tasks_before );

		// Delete all.
		$this->db->delete_all_recommendations();

		// Verify they're gone.
		$tasks_after = $this->db->get();
		$this->assertCount( 0, $tasks_after );
	}

	/**
	 * Test caching of get() results.
	 */
	public function test_get_caching() {
		$this->db->add(
			[
				'task_id'     => 'cache-task',
				'post_title'  => 'Cache Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		// First call (not cached).
		$tasks1 = $this->db->get();

		// Second call (should be cached).
		$tasks2 = $this->db->get();

		$this->assertEquals( $tasks1, $tasks2 );
	}

	/**
	 * Test cache is flushed on delete.
	 */
	public function test_cache_flush_on_delete() {
		$post_id = $this->db->add(
			[
				'task_id'     => 'cache-flush-task',
				'post_title'  => 'Cache Flush Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		// Query to populate cache.
		$tasks1 = $this->db->get();
		$this->assertCount( 1, $tasks1 );

		// Delete the task.
		$this->db->delete_recommendation( $post_id );

		// Query again - should reflect the deletion.
		$tasks2 = $this->db->get();
		$this->assertCount( 0, $tasks2 );
	}

	/**
	 * Test format_recommendation returns a Task object.
	 */
	public function test_format_recommendation() {
		$post_id = $this->db->add(
			[
				'task_id'     => 'format-task',
				'post_title'  => 'Format Task',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
			]
		);

		$post = \get_post( $post_id );
		$task = $this->db->format_recommendation( $post );

		$this->assertInstanceOf( 'Progress_Planner\Suggested_Tasks\Task', $task );
		$this->assertEquals( 'Format Task', $task->post_title );
	}

	/**
	 * Test format_recommendations returns array of Task objects.
	 */
	public function test_format_recommendations() {
		$post_ids = [];
		for ( $i = 1; $i <= 2; $i++ ) {
			$post_ids[] = $this->db->add(
				[
					'task_id'     => "format-tasks-$i",
					'post_title'  => "Format Tasks $i",
					'description' => "Description $i",
					'category'    => 'onboarding',
					'provider_id' => 'test-provider',
				]
			);
		}

		$posts = \array_map( 'get_post', $post_ids );
		$tasks = $this->db->format_recommendations( $posts );

		$this->assertCount( 2, $tasks );
		foreach ( $tasks as $task ) {
			$this->assertInstanceOf( 'Progress_Planner\Suggested_Tasks\Task', $task );
		}
	}

	/**
	 * Test tasks are ordered by menu_order.
	 */
	public function test_tasks_ordered_by_menu_order() {
		$this->db->add(
			[
				'task_id'     => 'order-3',
				'post_title'  => 'Task 3',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
				'order'       => 3,
			]
		);

		$this->db->add(
			[
				'task_id'     => 'order-1',
				'post_title'  => 'Task 1',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
				'order'       => 1,
			]
		);

		$this->db->add(
			[
				'task_id'     => 'order-2',
				'post_title'  => 'Task 2',
				'description' => 'Description',
				'category'    => 'onboarding',
				'provider_id' => 'test-provider',
				'order'       => 2,
			]
		);

		$tasks = $this->db->get();

		$this->assertEquals( 'Task 1', $tasks[0]->post_title );
		$this->assertEquals( 'Task 2', $tasks[1]->post_title );
		$this->assertEquals( 'Task 3', $tasks[2]->post_title );
	}
}
