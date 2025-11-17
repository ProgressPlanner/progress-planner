<?php
/**
 * Class Suggested_Tasks_Db_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks_DB;

/**
 * Suggested Tasks DB test case.
 */
class Suggested_Tasks_Db_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Suggested_Tasks_DB
	 */
	private $db_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->db_instance = new Suggested_Tasks_DB();
	}

	/**
	 * Test add task with minimal required data.
	 *
	 * @return void
	 */
	public function test_add_task_minimal_data() {
		$data = [
			'task_id'     => 'test-task-1',
			'post_title'  => 'Test Task',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db_instance->add( $data );

		$this->assertGreaterThan( 0, $post_id );
		$this->assertIsInt( $post_id );

		$post = \get_post( $post_id );
		$this->assertEquals( 'prpl_recommendations', $post->post_type );
		$this->assertEquals( 'Test Task', $post->post_title );
		$this->assertEquals( 'publish', $post->post_status );
	}

	/**
	 * Test add task without title returns 0.
	 *
	 * @return void
	 */
	public function test_add_task_no_title() {
		$data = [
			'task_id'     => 'test-task-2',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db_instance->add( $data );

		$this->assertEquals( 0, $post_id );
	}

	/**
	 * Test add task with description.
	 *
	 * @return void
	 */
	public function test_add_task_with_description() {
		$data = [
			'task_id'     => 'test-task-3',
			'post_title'  => 'Test Task with Description',
			'provider_id' => 'test-provider',
			'description' => 'This is a test description',
		];

		$post_id = $this->db_instance->add( $data );

		$this->assertGreaterThan( 0, $post_id );

		$post = \get_post( $post_id );
		$this->assertEquals( 'This is a test description', $post->post_content );
	}

	/**
	 * Test add task with priority sets menu_order.
	 *
	 * @return void
	 */
	public function test_add_task_with_priority() {
		$data = [
			'task_id'     => 'test-task-4',
			'post_title'  => 'Test Task with Priority',
			'provider_id' => 'test-provider',
			'priority'    => 5,
		];

		$post_id = $this->db_instance->add( $data );

		$this->assertGreaterThan( 0, $post_id );

		$post = \get_post( $post_id );
		$this->assertEquals( 5, $post->menu_order );
	}

	/**
	 * Test add task with different post statuses.
	 *
	 * @dataProvider data_post_statuses
	 *
	 * @param string $status Post status.
	 * @param string $expected Expected WordPress post status.
	 *
	 * @return void
	 */
	public function test_add_task_post_status( $status, $expected ) {
		$data = [
			'task_id'     => 'test-task-' . $status,
			'post_title'  => 'Test Task ' . $status,
			'provider_id' => 'test-provider',
			'post_status' => $status,
		];

		// Add time for snoozed status.
		if ( 'snoozed' === $status ) {
			$data['time'] = \time() + DAY_IN_SECONDS;
		}

		$post_id = $this->db_instance->add( $data );

		$this->assertGreaterThan( 0, $post_id );

		$post = \get_post( $post_id );
		$this->assertEquals( $expected, $post->post_status );
	}

	/**
	 * Data provider for post statuses.
	 *
	 * @return array
	 */
	public function data_post_statuses() {
		return [
			[ 'publish', 'publish' ],
			[ 'pending', 'pending' ],
			[ 'completed', 'trash' ],
			[ 'trash', 'trash' ],
			[ 'snoozed', 'future' ],
		];
	}

	/**
	 * Test add task prevents duplicates with locking.
	 *
	 * @return void
	 */
	public function test_add_task_prevents_duplicates() {
		$data = [
			'task_id'     => 'unique-task-id',
			'post_title'  => 'Unique Task',
			'provider_id' => 'test-provider',
		];

		$post_id_1 = $this->db_instance->add( $data );
		$this->assertGreaterThan( 0, $post_id_1 );

		// Try to add the same task again.
		$post_id_2 = $this->db_instance->add( $data );

		// Should return the existing post ID, not create a duplicate.
		$this->assertEquals( $post_id_1, $post_id_2 );

		// Verify only one post exists.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'name'        => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( 'unique-task-id' ),
				'numberposts' => -1,
			]
		);
		$this->assertCount( 1, $posts );
	}

	/**
	 * Test add task creates provider term.
	 *
	 * @return void
	 */
	public function test_add_task_creates_provider_term() {
		$data = [
			'task_id'     => 'test-task-provider',
			'post_title'  => 'Test Task Provider',
			'provider_id' => 'new-provider-term',
		];

		$post_id = $this->db_instance->add( $data );

		$this->assertGreaterThan( 0, $post_id );

		$terms = \wp_get_post_terms( $post_id, 'prpl_recommendations_provider' );
		$this->assertNotEmpty( $terms );
		$this->assertEquals( 'new-provider-term', $terms[0]->slug );
	}

	/**
	 * Test get_tasks_by with provider filter.
	 *
	 * @return void
	 */
	public function test_get_tasks_by_provider() {
		// Create tasks with different providers.
		$this->db_instance->add(
			[
				'task_id'     => 'task-provider-1',
				'post_title'  => 'Task Provider 1',
				'provider_id' => 'provider-a',
			]
		);

		$this->db_instance->add(
			[
				'task_id'     => 'task-provider-2',
				'post_title'  => 'Task Provider 2',
				'provider_id' => 'provider-b',
			]
		);

		$tasks = $this->db_instance->get_tasks_by( [ 'provider_id' => 'provider-a' ] );

		$this->assertCount( 1, $tasks );
		$this->assertEquals( 'provider-a', $tasks[0]->get_provider_id() );
	}

	/**
	 * Test get_tasks_by with post_status filter.
	 *
	 * @return void
	 */
	public function test_get_tasks_by_post_status() {
		// Create tasks with different statuses.
		$this->db_instance->add(
			[
				'task_id'     => 'task-status-1',
				'post_title'  => 'Published Task',
				'provider_id' => 'test-provider',
				'post_status' => 'publish',
			]
		);

		$this->db_instance->add(
			[
				'task_id'     => 'task-status-2',
				'post_title'  => 'Draft Task',
				'provider_id' => 'test-provider',
				'post_status' => 'draft',
			]
		);

		$tasks = $this->db_instance->get_tasks_by( [ 'post_status' => [ 'publish' ] ] );

		$this->assertGreaterThanOrEqual( 1, \count( $tasks ) );
		$published_found = false;
		foreach ( $tasks as $task ) {
			if ( 'Published Task' === $task->post_title ) {
				$published_found = true;
				break;
			}
		}
		$this->assertTrue( $published_found );
	}

	/**
	 * Test update_recommendation updates post data.
	 *
	 * @return void
	 */
	public function test_update_recommendation() {
		$post_id = $this->db_instance->add(
			[
				'task_id'     => 'task-update',
				'post_title'  => 'Original Title',
				'provider_id' => 'test-provider',
			]
		);

		$result = $this->db_instance->update_recommendation(
			$post_id,
			[
				'post_title' => 'Updated Title',
			]
		);

		$this->assertTrue( $result );

		$post = \get_post( $post_id );
		$this->assertEquals( 'Updated Title', $post->post_title );
	}

	/**
	 * Test update_recommendation with invalid ID returns false.
	 *
	 * @return void
	 */
	public function test_update_recommendation_invalid_id() {
		$result = $this->db_instance->update_recommendation( 0, [ 'post_title' => 'Test' ] );

		$this->assertFalse( $result );
	}

	/**
	 * Test delete_recommendation removes post.
	 *
	 * @return void
	 */
	public function test_delete_recommendation() {
		$post_id = $this->db_instance->add(
			[
				'task_id'     => 'task-delete',
				'post_title'  => 'Task to Delete',
				'provider_id' => 'test-provider',
			]
		);

		$result = $this->db_instance->delete_recommendation( $post_id );

		$this->assertTrue( $result );

		$post = \get_post( $post_id );
		$this->assertNull( $post );
	}

	/**
	 * Test get_post by post ID.
	 *
	 * @return void
	 */
	public function test_get_post_by_id() {
		$post_id = $this->db_instance->add(
			[
				'task_id'     => 'task-get-post',
				'post_title'  => 'Task Get Post',
				'provider_id' => 'test-provider',
			]
		);

		$task = $this->db_instance->get_post( $post_id );

		$this->assertNotFalse( $task );
		$this->assertEquals( $post_id, $task->ID );
	}

	/**
	 * Test get_post by task_id.
	 *
	 * @return void
	 */
	public function test_get_post_by_task_id() {
		$post_id = $this->db_instance->add(
			[
				'task_id'     => 'task-get-by-id',
				'post_title'  => 'Task Get By ID',
				'provider_id' => 'test-provider',
			]
		);

		$task = $this->db_instance->get_post( 'task-get-by-id' );

		$this->assertNotFalse( $task );
		$this->assertEquals( $post_id, $task->ID );
	}

	/**
	 * Test get_post returns false for non-existent task.
	 *
	 * @return void
	 */
	public function test_get_post_not_found() {
		$task = $this->db_instance->get_post( 99999 );

		$this->assertFalse( $task );
	}

	/**
	 * Test format_recommendation returns Task object.
	 *
	 * @return void
	 */
	public function test_format_recommendation() {
		$post_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_title'  => 'Test Task',
				'post_status' => 'publish',
			]
		);

		\wp_set_post_terms( $post_id, 'test-provider', 'prpl_recommendations_provider' );

		$post = \get_post( $post_id );
		$task = $this->db_instance->format_recommendation( $post );

		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task );
	}

	/**
	 * Test get method returns tasks.
	 *
	 * @return void
	 */
	public function test_get() {
		$this->db_instance->add(
			[
				'task_id'     => 'task-get-1',
				'post_title'  => 'Task Get 1',
				'provider_id' => 'test-provider',
			]
		);

		$tasks = $this->db_instance->get();

		$this->assertIsArray( $tasks );
		$this->assertGreaterThan( 0, \count( $tasks ) );
	}

	/**
	 * Test get method respects cache.
	 *
	 * @return void
	 */
	public function test_get_caching() {
		$this->db_instance->add(
			[
				'task_id'     => 'task-cache',
				'post_title'  => 'Task Cache',
				'provider_id' => 'test-provider',
			]
		);

		// First call should populate cache.
		$tasks_1 = $this->db_instance->get();
		$this->assertGreaterThan( 0, \count( $tasks_1 ) );

		// Second call should use cache.
		$tasks_2 = $this->db_instance->get();
		$this->assertEquals( \count( $tasks_1 ), \count( $tasks_2 ) );
	}
}

