<?php
/**
 * Unit tests for Suggested_Tasks_DB class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks_DB;

/**
 * Suggested_Tasks_DB test case.
 *
 * Tests the Suggested_Tasks_DB class that manages database operations
 * for suggested tasks including locking mechanisms and CRUD operations.
 */
class Suggested_Tasks_DB_Test extends WP_UnitTestCase {

	/**
	 * Suggested_Tasks_DB instance.
	 *
	 * @var Suggested_Tasks_DB
	 */
	private $db;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->db = new Suggested_Tasks_DB();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );

		// Clean up any existing tasks.
		$tasks = $this->db->get();
		foreach ( $tasks as $task ) {
			\wp_delete_post( $task->get_post_id(), true );
		}

		// Clear cache.
		\wp_cache_flush_group( Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		// Clean up tasks created during tests.
		$tasks = $this->db->get();
		foreach ( $tasks as $task ) {
			\wp_delete_post( $task->get_post_id(), true );
		}

		// Clear cache.
		\wp_cache_flush_group( Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );

		parent::tearDown();
	}

	/**
	 * Test add() creates a new task.
	 */
	public function test_add_creates_task() {
		$task_data = [
			'post_title'  => 'Test Task',
			'task_id'     => 'test-task-1',
			'provider_id' => 'test-provider',
			'description' => 'Test description',
		];

		$post_id = $this->db->add( $task_data );

		$this->assertGreaterThan( 0, $post_id, 'Should return a valid post ID' );

		$post = \get_post( $post_id );
		$this->assertEquals( 'Test Task', $post->post_title );
		$this->assertEquals( 'prpl_recommendations', $post->post_type );
	}

	/**
	 * Test add() returns 0 when title is missing.
	 */
	public function test_add_returns_zero_when_title_missing() {
		$task_data = [
			'task_id'     => 'test-task-no-title',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db->add( $task_data );

		$this->assertEquals( 0, $post_id, 'Should return 0 when title is missing' );
	}

	/**
	 * Test add() prevents duplicate tasks.
	 */
	public function test_add_prevents_duplicates() {
		$task_data = [
			'post_title'  => 'Duplicate Task',
			'task_id'     => 'test-duplicate',
			'provider_id' => 'test-provider',
		];

		$post_id1 = $this->db->add( $task_data );
		$post_id2 = $this->db->add( $task_data );

		$this->assertEquals( $post_id1, $post_id2, 'Should return existing post ID for duplicates' );
	}

	/**
	 * Test add() with priority sets menu_order.
	 */
	public function test_add_with_priority() {
		$task_data = [
			'post_title'  => 'Priority Task',
			'task_id'     => 'test-priority',
			'provider_id' => 'test-provider',
			'priority'    => 10,
		];

		$post_id = $this->db->add( $task_data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 10, $post->menu_order, 'Should set menu_order from priority' );
	}

	/**
	 * Test add() with custom order.
	 */
	public function test_add_with_custom_order() {
		$task_data = [
			'post_title'  => 'Custom Order Task',
			'task_id'     => 'test-custom-order',
			'provider_id' => 'test-provider',
			'priority'    => 10,
			'order'       => 5,
		];

		$post_id = $this->db->add( $task_data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 5, $post->menu_order, 'Custom order should override priority' );
	}

	/**
	 * Test add() with pending status.
	 */
	public function test_add_with_pending_status() {
		$task_data = [
			'post_title'  => 'Pending Task',
			'task_id'     => 'test-pending',
			'provider_id' => 'test-provider',
			'post_status' => 'pending',
		];

		$post_id = $this->db->add( $task_data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'pending', $post->post_status );
	}

	/**
	 * Test add() with completed status creates trash.
	 */
	public function test_add_with_completed_status() {
		$task_data = [
			'post_title'  => 'Completed Task',
			'task_id'     => 'test-completed',
			'provider_id' => 'test-provider',
			'post_status' => 'completed',
		];

		$post_id = $this->db->add( $task_data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'trash', $post->post_status, 'Completed status should create trash' );
	}

	/**
	 * Test add() with snoozed status creates future post.
	 */
	public function test_add_with_snoozed_status() {
		$future_time = \time() + DAY_IN_SECONDS;
		$task_data   = [
			'post_title'  => 'Snoozed Task',
			'task_id'     => 'test-snoozed',
			'provider_id' => 'test-provider',
			'post_status' => 'snoozed',
			'time'        => $future_time,
		];

		$post_id = $this->db->add( $task_data );
		$post    = \get_post( $post_id );

		$this->assertEquals( 'future', $post->post_status, 'Snoozed status should create future post' );
	}

	/**
	 * Test add() sets provider taxonomy.
	 */
	public function test_add_sets_provider_taxonomy() {
		$task_data = [
			'post_title'  => 'Provider Test',
			'task_id'     => 'test-provider-tax',
			'provider_id' => 'test-provider-123',
		];

		$post_id = $this->db->add( $task_data );
		$terms   = \wp_get_post_terms( $post_id, 'prpl_recommendations_provider' );

		$this->assertNotEmpty( $terms, 'Should have provider taxonomy' );
		$this->assertEquals( 'test-provider-123', $terms[0]->name );
	}

	/**
	 * Test add() with parent task.
	 */
	public function test_add_with_parent() {
		// Create parent task.
		$parent_data = [
			'post_title'  => 'Parent Task',
			'task_id'     => 'test-parent',
			'provider_id' => 'test-provider',
		];
		$parent_id   = $this->db->add( $parent_data );

		// Create child task.
		$child_data = [
			'post_title'  => 'Child Task',
			'task_id'     => 'test-child',
			'provider_id' => 'test-provider',
			'parent'      => $parent_id,
		];
		$child_id   = $this->db->add( $child_data );

		$child_post = \get_post( $child_id );
		$this->assertEquals( $parent_id, $child_post->post_parent, 'Should set parent post ID' );
	}

	/**
	 * Test add() stores custom meta.
	 */
	public function test_add_stores_custom_meta() {
		$task_data = [
			'post_title'   => 'Meta Test',
			'task_id'      => 'test-meta',
			'provider_id'  => 'test-provider',
			'custom_field' => 'custom_value',
		];

		$post_id = $this->db->add( $task_data );
		$meta    = \get_post_meta( $post_id, 'prpl_custom_field', true );

		$this->assertEquals( 'custom_value', $meta, 'Should store custom meta with prpl_ prefix' );
	}

	/**
	 * Test update_recommendation() updates post data.
	 */
	public function test_update_recommendation_updates_post() {
		$task_data = [
			'post_title'  => 'Original Title',
			'task_id'     => 'test-update',
			'provider_id' => 'test-provider',
		];
		$post_id   = $this->db->add( $task_data );

		$result = $this->db->update_recommendation(
			$post_id,
			[
				'post_title' => 'Updated Title',
			]
		);

		$this->assertTrue( $result, 'Should return true on success' );

		$post = \get_post( $post_id );
		$this->assertEquals( 'Updated Title', $post->post_title );
	}

	/**
	 * Test update_recommendation() returns false for invalid ID.
	 */
	public function test_update_recommendation_invalid_id() {
		$result = $this->db->update_recommendation( 0, [] );
		$this->assertFalse( $result, 'Should return false for invalid ID' );
	}

	/**
	 * Test delete_recommendation() removes task.
	 */
	public function test_delete_recommendation() {
		$task_data = [
			'post_title'  => 'Delete Test',
			'task_id'     => 'test-delete',
			'provider_id' => 'test-provider',
		];
		$post_id   = $this->db->add( $task_data );

		$result = $this->db->delete_recommendation( $post_id );

		$this->assertTrue( $result, 'Should return true on success' );
		$this->assertNull( \get_post( $post_id ), 'Post should be deleted' );
	}

	/**
	 * Test delete_all_recommendations() removes all tasks.
	 */
	public function test_delete_all_recommendations() {
		// Create multiple tasks.
		for ( $i = 1; $i <= 3; $i++ ) {
			$this->db->add(
				[
					'post_title'  => "Task $i",
					'task_id'     => "test-delete-all-$i",
					'provider_id' => 'test-provider',
				]
			);
		}

		$this->db->delete_all_recommendations();

		$tasks = $this->db->get();
		$this->assertEmpty( $tasks, 'All tasks should be deleted' );
	}

	/**
	 * Test get_post() retrieves by numeric ID.
	 */
	public function test_get_post_by_numeric_id() {
		$task_data = [
			'post_title'  => 'Get Post Test',
			'task_id'     => 'test-get-post',
			'provider_id' => 'test-provider',
		];
		$post_id   = $this->db->add( $task_data );

		$task = $this->db->get_post( $post_id );

		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task );
		$this->assertEquals( $post_id, $task->get_post_id() );
	}

	/**
	 * Test get_post() retrieves by task ID string.
	 */
	public function test_get_post_by_task_id() {
		$task_data = [
			'post_title'  => 'Get Post by Task ID',
			'task_id'     => 'test-get-by-task-id',
			'provider_id' => 'test-provider',
		];
		$this->db->add( $task_data );

		$task = $this->db->get_post( 'test-get-by-task-id' );

		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task );
	}

	/**
	 * Test get_post() returns false for non-existent task.
	 */
	public function test_get_post_returns_false_for_nonexistent() {
		$task = $this->db->get_post( 99999 );
		$this->assertFalse( $task, 'Should return false for non-existent task' );
	}

	/**
	 * Test get_tasks_by() filters by provider.
	 */
	public function test_get_tasks_by_provider() {
		// Create tasks with different providers.
		$this->db->add(
			[
				'post_title'  => 'Provider A Task',
				'task_id'     => 'test-provider-a',
				'provider_id' => 'provider-a',
			]
		);
		$this->db->add(
			[
				'post_title'  => 'Provider B Task',
				'task_id'     => 'test-provider-b',
				'provider_id' => 'provider-b',
			]
		);

		$tasks = $this->db->get_tasks_by( [ 'provider_id' => 'provider-a' ] );

		$this->assertCount( 1, $tasks, 'Should return only provider-a tasks' );
		$this->assertEquals( 'Provider A Task', $tasks[0]->get_title() );
	}

	/**
	 * Test get_tasks_by() filters by task_id.
	 */
	public function test_get_tasks_by_task_id() {
		$this->db->add(
			[
				'post_title'  => 'Task ID Test',
				'task_id'     => 'test-specific-task',
				'provider_id' => 'test-provider',
			]
		);

		$tasks = $this->db->get_tasks_by( [ 'task_id' => 'test-specific-task' ] );

		$this->assertCount( 1, $tasks );
		$this->assertEquals( 'Task ID Test', $tasks[0]->get_title() );
	}

	/**
	 * Test get() returns all tasks by default.
	 */
	public function test_get_returns_all_tasks() {
		// Create multiple tasks.
		for ( $i = 1; $i <= 3; $i++ ) {
			$this->db->add(
				[
					'post_title'  => "Task $i",
					'task_id'     => "test-get-all-$i",
					'provider_id' => 'test-provider',
				]
			);
		}

		$tasks = $this->db->get();

		$this->assertCount( 3, $tasks );
	}

	/**
	 * Test get() uses cache.
	 */
	public function test_get_uses_cache() {
		$this->db->add(
			[
				'post_title'  => 'Cache Test',
				'task_id'     => 'test-cache',
				'provider_id' => 'test-provider',
			]
		);

		// First call should populate cache.
		$tasks1 = $this->db->get();

		// Second call should use cache.
		$tasks2 = $this->db->get();

		$this->assertEquals( $tasks1, $tasks2, 'Should return cached results' );
	}

	/**
	 * Test get() orders by menu_order.
	 */
	public function test_get_orders_by_menu_order() {
		$this->db->add(
			[
				'post_title'  => 'Low Priority',
				'task_id'     => 'test-order-3',
				'provider_id' => 'test-provider',
				'order'       => 30,
			]
		);
		$this->db->add(
			[
				'post_title'  => 'High Priority',
				'task_id'     => 'test-order-1',
				'provider_id' => 'test-provider',
				'order'       => 10,
			]
		);

		$tasks = $this->db->get();

		$this->assertEquals( 'High Priority', $tasks[0]->get_title(), 'Should order by menu_order ASC' );
	}

	/**
	 * Test format_recommendation() creates Task instance.
	 */
	public function test_format_recommendation() {
		$post_id = $this->db->add(
			[
				'post_title'  => 'Format Test',
				'task_id'     => 'test-format',
				'provider_id' => 'test-provider',
			]
		);

		$post = \get_post( $post_id );
		$task = $this->db->format_recommendation( $post );

		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task );
		$this->assertEquals( 'Format Test', $task->get_title() );
	}

	/**
	 * Test format_recommendation() caches results.
	 */
	public function test_format_recommendation_caches() {
		$post_id = $this->db->add(
			[
				'post_title'  => 'Cache Format Test',
				'task_id'     => 'test-format-cache',
				'provider_id' => 'test-provider',
			]
		);

		$post  = \get_post( $post_id );
		$task1 = $this->db->format_recommendation( $post );
		$task2 = $this->db->format_recommendation( $post );

		$this->assertSame( $task1, $task2, 'Should return same cached instance' );
	}

	/**
	 * Test format_recommendations() formats array of posts.
	 */
	public function test_format_recommendations() {
		$post_ids = [];
		for ( $i = 1; $i <= 2; $i++ ) {
			$post_ids[] = $this->db->add(
				[
					'post_title'  => "Format Array Task $i",
					'task_id'     => "test-format-array-$i",
					'provider_id' => 'test-provider',
				]
			);
		}

		$posts = \array_map( 'get_post', $post_ids );
		$tasks = $this->db->format_recommendations( $posts );

		$this->assertCount( 2, $tasks );
		foreach ( $tasks as $task ) {
			$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task );
		}
	}

	/**
	 * Test GET_TASKS_CACHE_GROUP constant.
	 */
	public function test_cache_group_constant() {
		$this->assertEquals(
			'progress_planner_get_tasks',
			Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP
		);
	}
}
