<?php
/**
 * Class Rest_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Tasks;

/**
 * REST API Tasks test case.
 */
class Rest_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Tasks
	 */
	private $rest_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->rest_instance = new Tasks();
	}

	/**
	 * Test REST endpoint registration.
	 *
	 * @return void
	 */
	public function test_register_rest_endpoint() {
		global $wp_rest_server;

		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );

		$routes = $wp_rest_server->get_routes();
		$this->assertArrayHasKey( '/progress-planner/v1/tasks', $routes );
	}

	/**
	 * Test get_tasks returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_get_tasks_returns_rest_response() {
		$response = $this->rest_instance->get_tasks();

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test get_tasks returns array structure.
	 *
	 * @return void
	 */
	public function test_get_tasks_returns_array() {
		$response = $this->rest_instance->get_tasks();
		$data     = $response->get_data();

		$this->assertIsArray( $data );
	}

	/**
	 * Test get_tasks with no tasks returns empty array.
	 *
	 * @return void
	 */
	public function test_get_tasks_no_tasks() {
		$response = $this->rest_instance->get_tasks();
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertEmpty( $data );
	}

	/**
	 * Test get_tasks includes tasks with various post statuses.
	 *
	 * @return void
	 */
	public function test_get_tasks_includes_all_statuses() {
		// Create tasks with different statuses.
		$publish_task = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
				'post_title'  => 'Published Task',
			]
		);

		$draft_task = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'draft',
				'post_title'  => 'Draft Task',
			]
		);

		$trash_task = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'trash',
				'post_title'  => 'Trashed Task',
			]
		);

		$response = $this->rest_instance->get_tasks();
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertGreaterThanOrEqual( 3, \count( $data ) );

		// Verify all tasks are included.
		$task_ids = \array_column( $data, 'ID' );
		$this->assertContains( $publish_task, $task_ids );
		$this->assertContains( $draft_task, $task_ids );
		$this->assertContains( $trash_task, $task_ids );
	}

	/**
	 * Test get_tasks excludes tasks with other post statuses.
	 *
	 * @return void
	 */
	public function test_get_tasks_excludes_other_statuses() {
		// Create a task with 'private' status (not in the allowed list).
		$private_task = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'private',
				'post_title'  => 'Private Task',
			]
		);

		$response = $this->rest_instance->get_tasks();
		$data     = $response->get_data();

		$task_ids = \array_column( $data, 'ID' );
		$this->assertNotContains( $private_task, $task_ids );
	}

	/**
	 * Test get_tasks returns task data structure.
	 *
	 * @return void
	 */
	public function test_get_tasks_data_structure() {
		$task_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
				'post_title'  => 'Test Task',
			]
		);

		$response = $this->rest_instance->get_tasks();
		$data     = $response->get_data();

		$this->assertNotEmpty( $data );
		$task = $data[0];

		// Verify task has expected structure (from Task::get_data()).
		$this->assertIsArray( $task );
		$this->assertArrayHasKey( 'ID', $task );
	}
}

