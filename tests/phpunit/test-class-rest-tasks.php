<?php
/**
 * Class Rest_Tasks_Test
 *
 * @package Progress_Planner\Tests
 * @group rest-api
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Tasks;
use WP_REST_Server;
use WP_REST_Request;

/**
 * Rest_Tasks_Test test case.
 */
class Rest_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Holds the WP REST Server object.
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * The token for the test.
	 *
	 * @var string
	 */
	private $token;

	/**
	 * Tasks REST API instance.
	 *
	 * @var Tasks
	 */
	private $tasks_api;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->token = 'test-token-123';

		// Add a fake license key.
		\update_option( 'progress_planner_license_key', $this->token );

		// Initialize the REST API.
		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		$this->server   = $wp_rest_server;

		// Create the Tasks API instance.
		$this->tasks_api = new Tasks();

		\do_action( 'rest_api_init' );
	}

	/**
	 * Cleanup after test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		parent::tearDown();

		// Delete the fake license key.
		\delete_option( 'progress_planner_license_key' );

		global $wp_rest_server;
		$wp_rest_server = null;
	}

	/**
	 * Test the REST endpoint is registered.
	 *
	 * @return void
	 */
	public function test_endpoint_is_registered() {
		$routes = $this->server->get_routes();

		$this->assertArrayHasKey( '/progress-planner/v1/tasks', $routes );
	}

	/**
	 * Test the endpoint requires a token.
	 *
	 * @return void
	 */
	public function test_endpoint_requires_token() {
		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );

		$response = $this->server->dispatch( $request );

		// Should fail without token.
		$this->assertEquals( 400, $response->get_status() );
	}

	/**
	 * Test the endpoint with valid token.
	 *
	 * @return void
	 */
	public function test_endpoint_with_valid_token() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', $this->token );

		$response = $this->server->dispatch( $request );

		// Should succeed with valid token.
		$this->assertEquals( 200, $response->get_status() );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test the endpoint with invalid token.
	 *
	 * @return void
	 */
	public function test_endpoint_with_invalid_token() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', 'invalid-token' );

		$response = $this->server->dispatch( $request );

		// Should fail with invalid token.
		$this->assertEquals( 400, $response->get_status() );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test get_tasks returns array of tasks.
	 *
	 * @return void
	 */
	public function test_get_tasks_returns_array() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', $this->token );

		$response = $this->server->dispatch( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test get_tasks includes tasks with different statuses.
	 *
	 * @return void
	 */
	public function test_get_tasks_includes_multiple_statuses() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		// Create test tasks with different statuses.
		$published_task = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Published Task',
				'post_status' => 'publish',
				'task_id'     => 'published-task',
				'provider_id' => 'test-provider',
			]
		);

		$draft_task = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Draft Task',
				'post_status' => 'draft',
				'task_id'     => 'draft-task',
				'provider_id' => 'test-provider',
			]
		);

		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', $this->token );

		$response = $this->server->dispatch( $request );
		$data     = $response->get_data();

		// Should have at least 2 tasks.
		$this->assertGreaterThanOrEqual( 2, \count( $data ), 'Should have at least 2 tasks' );
		$this->assertIsArray( $data, 'Response should be an array' );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test get_tasks returns task data structure.
	 *
	 * @return void
	 */
	public function test_get_tasks_returns_proper_structure() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		// Create a test task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'   => 'Test Task Structure',
				'post_status'  => 'publish',
				'task_id'      => 'test-task-structure',
				'provider_id'  => 'test-provider',
				'post_content' => 'Test content',
			]
		);

		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', $this->token );

		$response = $this->server->dispatch( $request );
		$data     = $response->get_data();

		// Check that we get an array response.
		$this->assertIsArray( $data, 'Response should be an array' );

		// Check that each item in the array is an array (task data structure).
		if ( ! empty( $data ) ) {
			foreach ( $data as $task_data ) {
				$this->assertIsArray( $task_data, 'Each task should be an array' );
			}
		}

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test endpoint accepts GET method.
	 *
	 * @return void
	 */
	public function test_endpoint_accepts_get_method() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$request = new WP_REST_Request( 'GET', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', $this->token );

		$response = $this->server->dispatch( $request );

		// Should succeed with GET - 200 status means GET is accepted.
		$this->assertEquals( 200, $response->get_status(), 'GET request should succeed' );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test endpoint does not accept POST method.
	 *
	 * @return void
	 */
	public function test_endpoint_rejects_post_method() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/tasks' );
		$request->set_param( 'token', $this->token );

		$response = $this->server->dispatch( $request );

		// Should fail for POST requests.
		$this->assertNotEquals( 200, $response->get_status() );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test constructor hooks into rest_api_init.
	 *
	 * @return void
	 */
	public function test_constructor_registers_rest_endpoint() {
		$this->assertEquals( 10, \has_action( 'rest_api_init', [ $this->tasks_api, 'register_rest_endpoint' ] ) );
	}
}
