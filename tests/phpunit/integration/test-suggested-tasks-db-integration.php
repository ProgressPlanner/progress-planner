<?php
/**
 * Suggested Tasks DB Integration Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Suggested Tasks DB integration test case.
 */
class Suggested_Tasks_Db_Integration_Test extends Integration_Test_Case {

	/**
	 * Test task creation with real WordPress posts.
	 *
	 * @return void
	 */
	public function test_task_creation_creates_wordpress_post() {
		$task_id = $this->create_test_task(
			[
				'task_id'     => 'integration-test-task',
				'post_title'  => 'Integration Test Task',
				'provider_id' => 'test-provider',
			]
		);

		$this->assertGreaterThan( 0, $task_id );

		// Verify post exists in WordPress.
		$post = \get_post( $task_id );
		$this->assertNotNull( $post );
		$this->assertEquals( 'prpl_recommendations', $post->post_type );
		$this->assertEquals( 'Integration Test Task', $post->post_title );
		$this->assertEquals( 'publish', $post->post_status );

		// Verify provider term is set.
		$terms = \wp_get_post_terms( $task_id, 'prpl_recommendations_provider' );
		$this->assertNotEmpty( $terms );
		$this->assertEquals( 'test-provider', $terms[0]->slug );
	}

	/**
	 * Test task locking prevents duplicates.
	 *
	 * @return void
	 */
	public function test_task_locking_prevents_duplicates() {
		$task_data = [
			'task_id'     => 'duplicate-test-task',
			'post_title'  => 'Duplicate Test Task',
			'provider_id' => 'test-provider',
		];

		// Create first task.
		$task_id_1 = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		$this->assertGreaterThan( 0, $task_id_1 );

		// Try to create duplicate immediately.
		$task_id_2 = \progress_planner()->get_suggested_tasks_db()->add( $task_data );

		// Should return the same post ID, not create a duplicate.
		$this->assertEquals( $task_id_1, $task_id_2 );

		// Verify only one post exists.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'name'        => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( 'duplicate-test-task' ),
				'numberposts' => -1,
			]
		);
		$this->assertCount( 1, $posts );
	}

	/**
	 * Test task queries with real database.
	 *
	 * @return void
	 */
	public function test_task_queries_with_real_database() {
		// Create tasks with different providers.
		$task_a = $this->create_test_task(
			[
				'task_id'     => 'provider-a-task',
				'provider_id' => 'provider-a',
			]
		);

		$task_b = $this->create_test_task(
			[
				'task_id'     => 'provider-b-task',
				'provider_id' => 'provider-b',
			]
		);

		// Query by provider.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[ 'provider_id' => 'provider-a' ]
		);

		$this->assertCount( 1, $tasks );
		$this->assertEquals( $task_a, $tasks[0]->ID );

		// Query all tasks.
		$all_tasks = \progress_planner()->get_suggested_tasks_db()->get();
		$this->assertGreaterThanOrEqual( 2, \count( $all_tasks ) );
	}

	/**
	 * Test task update modifies WordPress post.
	 *
	 * @return void
	 */
	public function test_task_update_modifies_post() {
		$task_id = $this->create_test_task( [ 'post_title' => 'Original Title' ] );

		// Update the task.
		$result = \progress_planner()->get_suggested_tasks_db()->update_recommendation(
			$task_id,
			[ 'post_title' => 'Updated Title' ]
		);

		$this->assertTrue( $result );

		// Verify post was updated.
		$post = \get_post( $task_id );
		$this->assertEquals( 'Updated Title', $post->post_title );
	}

	/**
	 * Test task deletion removes WordPress post.
	 *
	 * @return void
	 */
	public function test_task_deletion_removes_post() {
		$task_id = $this->create_test_task();

		// Delete the task.
		$result = \progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task_id );

		$this->assertTrue( $result );

		// Verify post is deleted.
		$post = \get_post( $task_id );
		$this->assertNull( $post );
	}
}

