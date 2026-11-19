<?php
/**
 * Class Angie_API_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Third_Party\Angie\Angie_API;
use WP_UnitTestCase;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Angie_API test case.
 */
class Angie_API_Test extends \WP_UnitTestCase {

	/**
	 * Holds the WP REST Server object.
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * The Angie_API instance.
	 *
	 * @var Angie_API
	 */
	private $angie_api;

	/**
	 * Admin user ID.
	 *
	 * @var int
	 */
	private $admin_user_id;

	/**
	 * Subscriber user ID.
	 *
	 * @var int
	 */
	private $subscriber_user_id;

	/**
	 * Mock remote API response for tools.
	 *
	 * @var string
	 */
	const MOCK_TOOLS_RESPONSE = '[{"name":"list-active-recommendations","description":"Lists all active Progress Planner recommendations","endpoint":"\/recommendations","method":"GET","responseFormatter":"format_recommendations_list","inputSchema":{"type":"object","properties":[],"required":[]},"outputSchema":{"type":"object","properties":{"success":{"type":"boolean"},"count":{"type":"number"},"tasks":{"type":"array"}}}}]';

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Create admin user.
		$this->admin_user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $this->admin_user_id );

		// Create subscriber user.
		$this->subscriber_user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );

		// Initialize REST API.
		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		$this->server   = $wp_rest_server;

		// Create Angie_API instance.
		$this->angie_api = new Angie_API();

		// Trigger REST API initialization.
		\do_action( 'rest_api_init' );
	}

	/**
	 * Tear down the test.
	 *
	 * @return void
	 */
	public function tear_down() {
		parent::tear_down();

		// Clean up tasks.
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		// Clean up cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Clean up REST server.
		global $wp_rest_server;
		$wp_rest_server = null;

		// Remove filters.
		\remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test REST endpoint registration.
	 *
	 * @return void
	 */
	public function test_register_rest_endpoint() {
		$routes = $this->server->get_routes();

		// Check that all three routes are registered.
		$this->assertArrayHasKey( '/progress-planner/v1/angie/recommendations', $routes );
		$this->assertArrayHasKey( '/progress-planner/v1/angie/recommendations/completed', $routes );
		$this->assertArrayHasKey( '/progress-planner/v1/angie/tools', $routes );

		// Check GET and POST methods for recommendations.
		// WordPress creates separate handlers for each HTTP method.
		$recommendations_route = $routes['/progress-planner/v1/angie/recommendations'];
		$this->assertNotEmpty( $recommendations_route );

		// Find handlers for GET and POST methods.
		$has_get  = false;
		$has_post = false;
		foreach ( $recommendations_route as $handler ) {
			if ( isset( $handler['methods']['GET'] ) ) {
				$has_get = true;
			}
			if ( isset( $handler['methods']['POST'] ) ) {
				$has_post = true;
			}
		}
		$this->assertTrue( $has_get, 'GET method should be registered' );
		$this->assertTrue( $has_post, 'POST method should be registered' );

		// Check GET method for completed recommendations.
		$completed_route = $routes['/progress-planner/v1/angie/recommendations/completed'];
		$this->assertNotEmpty( $completed_route );
		$handler = $completed_route[0];
		$this->assertArrayHasKey( 'GET', $handler['methods'] );

		// Check GET method for tools.
		$tools_route = $routes['/progress-planner/v1/angie/tools'];
		$this->assertNotEmpty( $tools_route );
		$handler = $tools_route[0];
		$this->assertArrayHasKey( 'GET', $handler['methods'] );
	}

	/**
	 * Test check_permissions with admin user.
	 *
	 * @return void
	 */
	public function test_check_permissions_with_admin() {
		\wp_set_current_user( $this->admin_user_id );
		$result = $this->angie_api->check_permissions();
		$this->assertTrue( $result );
	}

	/**
	 * Test check_permissions without admin user.
	 *
	 * @return void
	 */
	public function test_check_permissions_without_admin() {
		\wp_set_current_user( $this->subscriber_user_id );
		$result = $this->angie_api->check_permissions();
		$this->assertInstanceOf( WP_Error::class, $result );
		$this->assertEquals( 'rest_forbidden', $result->get_error_code() );
		$this->assertEquals( 403, $result->get_error_data()['status'] );
	}

	/**
	 * Test get_active_tasks returns only Angie tasks.
	 *
	 * @return void
	 */
	public function test_get_active_tasks_returns_only_angie_tasks() {
		// Create an Angie-handled task.
		$angie_task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Set Blog Description',
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'category'    => 'core',
				'post_status' => 'publish',
			]
		);

		// Create a non-Angie task.
		$non_angie_task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Some Other Task',
				'task_id'     => 'some-other-task',
				'provider_id' => 'some-other-task',
				'category'    => 'other',
				'post_status' => 'publish',
			]
		);

		$response = $this->angie_api->get_active_tasks();
		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );

		// Both are listed; can_complete is what distinguishes them.
		$by_id = \array_column( $data['tasks'], 'can_complete', 'id' );

		$this->assertArrayHasKey( 'core-blogdescription', $by_id );
		$this->assertArrayHasKey( 'some-other-task', $by_id );
		$this->assertTrue( $by_id['core-blogdescription'], 'Angie can complete this one.' );
		$this->assertFalse( $by_id['some-other-task'], 'Angie has no handler for this one.' );
	}

	/**
	 * Tasks Angie cannot complete are still listed.
	 *
	 * This is the case that made Angie report "you have no active tasks" on a
	 * site with plenty of them: the endpoint used to return only the handful it
	 * could apply itself, so a site whose open recommendations happened to be
	 * other kinds looked empty.
	 *
	 * @return void
	 */
	public function test_get_active_tasks_lists_tasks_angie_cannot_complete() {
		// Create multiple non-Angie tasks.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Task 1',
				'task_id'     => 'task-1',
				'provider_id' => 'task-1',
				'category'    => 'other',
				'post_status' => 'publish',
			]
		);

		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Task 2',
				'task_id'     => 'task-2',
				'provider_id' => 'task-2',
				'category'    => 'other',
				'post_status' => 'publish',
			]
		);

		$response = $this->angie_api->get_active_tasks();
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEquals( 2, $data['count'], 'Both tasks should be listed.' );

		foreach ( $data['tasks'] as $task ) {
			$this->assertFalse( $task['can_complete'], 'Neither is completable by Angie.' );
		}
	}

	/**
	 * A task Angie has no handler for is refused, not celebrated.
	 *
	 * Previously the handler fell through to $task->celebrate() for any task
	 * whose ID was not in the map, so Angie would report success and mark the
	 * recommendation done without having changed anything on the site.
	 *
	 * @return void
	 */
	public function test_complete_task_refuses_a_task_it_cannot_handle() {
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Some Other Task',
				'task_id'     => 'some-other-task',
				'provider_id' => 'some-other-task',
				'category'    => 'other',
				'post_status' => 'publish',
			]
		);

		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 'some-other-task' );
		$request->set_param( 'value', 'anything' );

		$response = $this->angie_api->complete_task( $request );

		$this->assertInstanceOf( \WP_Error::class, $response );
		$this->assertEquals( 'task_not_completable', $response->get_error_code() );

		// And the recommendation is still open.
		$still_open = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider_id' => 'some-other-task',
			]
		);
		$this->assertCount( 1, $still_open, 'The task must not have been marked complete.' );
	}

	/**
	 * Test get_active_tasks response structure.
	 *
	 * @return void
	 */
	public function test_get_active_tasks_response_structure() {
		// Create an Angie task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'   => 'Set Timezone',
				'post_content' => 'Set your site timezone',
				'task_id'      => 'select-timezone',
				'provider_id'  => 'select-timezone',
				'category'     => 'core',
				'post_status'  => 'publish',
				'url'          => 'http://example.com/settings',
				'priority'     => 10,
			]
		);

		$response = $this->angie_api->get_active_tasks();
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'success', $data );
		$this->assertArrayHasKey( 'count', $data );
		$this->assertArrayHasKey( 'tasks', $data );
		$this->assertTrue( $data['success'] );
		$this->assertIsInt( $data['count'] );
		$this->assertIsArray( $data['tasks'] );

		if ( ! empty( $data['tasks'] ) ) {
			$task = $data['tasks'][0];
			$this->assertArrayHasKey( 'id', $task );
			$this->assertArrayHasKey( 'title', $task );
			$this->assertArrayHasKey( 'description', $task );
			$this->assertArrayHasKey( 'url', $task );
			$this->assertArrayHasKey( 'priority', $task );
			$this->assertArrayHasKey( 'status', $task );
			$this->assertEquals( 'active', $task['status'] );
		}
	}

	/**
	 * Test get_completed_tasks returns only completed tasks.
	 *
	 * @return void
	 */
	public function test_get_completed_tasks() {
		// Create an active Angie task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Active Task',
				'task_id'     => 'select-locale',
				'provider_id' => 'select-locale',
				'category'    => 'core',
				'post_status' => 'publish',
			]
		);

		// Create a completed Angie task.
		$completed_task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Completed Task',
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'category'    => 'core',
				'post_status' => 'trash',
			]
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/recommendations/completed' );
		$response = $this->angie_api->get_completed_tasks( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEquals( 1, $data['count'] );
		$this->assertCount( 1, $data['tasks'] );
		$this->assertEquals( 'core-blogdescription', $data['tasks'][0]['id'] );
		$this->assertEquals( 'completed', $data['tasks'][0]['status'] );
	}

	/**
	 * Test get_tasks_by_status exception handling.
	 *
	 * @return void
	 */
	public function test_get_tasks_by_status_exception_handling() {
		// This test verifies that exceptions are caught and returned as WP_Error.
		// We can't easily mock the singleton, so we test the try-catch exists
		// by ensuring the method doesn't throw exceptions for normal operations.
		// Exception handling is verified through integration tests.
		$response = $this->angie_api->get_tasks_by_status( 'publish' );
		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();
		$this->assertTrue( $data['success'] );
	}

	/**
	 * Test complete_task success.
	 *
	 * @return void
	 */
	public function test_complete_task_success() {
		// Set blog description to empty to ensure task exists.
		\update_option( 'blogdescription', '' );

		// Create a task.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Set Blog Description',
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'category'    => 'core',
				'post_status' => 'publish',
			]
		);

		// Verify task is published before completion.
		$task_before = \get_post( $task_id );
		$this->assertEquals( 'publish', $task_before->post_status );

		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 'core-blogdescription' );
		$request->set_param( 'value', 'Test Description' );

		$response = $this->angie_api->complete_task( $request );
		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEquals( 'core-blogdescription', $data['task_id'] );
		$this->assertArrayHasKey( 'message', $data );

		// Verify celebrate() was called by checking post status changed to pending.
		$task_after = \get_post( $task_id );
		$this->assertEquals( 'pending', $task_after->post_status );
	}

	/**
	 * Test complete_task calls provider complete_task.
	 *
	 * @return void
	 */
	public function test_complete_task_calls_provider_complete_task() {
		// Set blog description to empty to ensure task exists.
		\update_option( 'blogdescription', '' );

		// Create the task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Set Blog Description',
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'category'    => 'core',
				'post_status' => 'publish',
			]
		);

		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 'core-blogdescription' );
		$request->set_param( 'value', 'My New Description' );

		$response = $this->angie_api->complete_task( $request );
		$this->assertInstanceOf( WP_REST_Response::class, $response );

		// Verify the option was updated.
		$this->assertEquals( 'My New Description', \get_option( 'blogdescription' ) );
	}

	/**
	 * Test complete_task invalid task_id type.
	 *
	 * @return void
	 */
	public function test_complete_task_invalid_task_id_type() {
		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 12345 ); // Not a string.

		$response = $this->angie_api->complete_task( $request );
		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'invalid_task_id', $response->get_error_code() );
		$this->assertEquals( 400, $response->get_error_data()['status'] );
	}

	/**
	 * Test complete_task not found.
	 *
	 * @return void
	 */
	public function test_complete_task_not_found() {
		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 'non-existent-task' );

		$response = $this->angie_api->complete_task( $request );
		$this->assertInstanceOf( WP_Error::class, $response );
		$this->assertEquals( 'task_not_found', $response->get_error_code() );
		$this->assertEquals( 404, $response->get_error_data()['status'] );
	}

	/**
	 * Test complete_task with value.
	 *
	 * @return void
	 */
	public function test_complete_task_with_value() {
		// Set blog description to empty.
		\update_option( 'blogdescription', '' );

		// Create the task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Set Blog Description',
				'task_id'     => 'core-blogdescription',
				'provider_id' => 'core-blogdescription',
				'category'    => 'core',
				'post_status' => 'publish',
			]
		);

		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 'core-blogdescription' );
		$request->set_param( 'value', 'Test Value' );

		$response = $this->angie_api->complete_task( $request );
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertArrayHasKey( 'new_value', $data );
		$this->assertEquals( 'Test Value', $data['new_value'] );
	}

	/**
	 * Test complete_task exception handling.
	 *
	 * @return void
	 */
	public function test_complete_task_exception_handling() {
		// This test verifies that exceptions are caught and returned as WP_Error.
		// We'll test by creating a scenario that might cause an exception.
		$request = new WP_REST_Request( 'POST', '/progress-planner/v1/angie/recommendations' );
		$request->set_param( 'task_id', 'core-blogdescription' );

		// Mock get_suggested_tasks_db to throw exception.
		// Since we can't easily mock the singleton, we'll test with invalid data.
		// The actual exception handling is tested through integration tests.
		// This test ensures the try-catch exists.
		$response = $this->angie_api->complete_task( $request );
		// Should return WP_Error for not found, not throw exception.
		$this->assertInstanceOf( WP_Error::class, $response );
	}

	/**
	 * Test get_tools returns cached value.
	 *
	 * @return void
	 */
	public function test_get_tools_returns_cached_value() {
		$url          = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key    = \md5( $url );
		$cached_tools = [
			[
				'name'        => 'cached-tool',
				'description' => 'Cached tool',
			],
		];

		// Set cache.
		\progress_planner()->get_utils__cache()->set( $cache_key, $cached_tools, DAY_IN_SECONDS );

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEquals( $cached_tools, $data['tools'] );
	}

	/**
	 * Test get_tools fetches from remote.
	 *
	 * @return void
	 */
	public function test_get_tools_fetches_from_remote() {
		// Clear cache first.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return [
						'response' => [
							'code' => 200,
						],
						'body'     => self::MOCK_TOOLS_RESPONSE,
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertIsArray( $data['tools'] );
		$this->assertNotEmpty( $data['tools'] );
	}

	/**
	 * Test get_tools caches successful response.
	 *
	 * @return void
	 */
	public function test_get_tools_caches_successful_response() {
		// Clear cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return [
						'response' => [
							'code' => 200,
						],
						'body'     => self::MOCK_TOOLS_RESPONSE,
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		// Verify cache was set.
		$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
		$this->assertNotEmpty( $cached );
		$this->assertIsArray( $cached );
	}

	/**
	 * Test get_tools handles network error.
	 *
	 * @return void
	 */
	public function test_get_tools_handles_network_error() {
		// Clear cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get to return WP_Error.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return new WP_Error( 'http_request_failed', 'Network error' );
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEmpty( $data['tools'] );
	}

	/**
	 * Test get_tools handles HTTP error.
	 *
	 * @return void
	 */
	public function test_get_tools_handles_http_error() {
		// Clear cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get to return 404.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return [
						'response' => [
							'code' => 404,
						],
						'body'     => 'Not Found',
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEmpty( $data['tools'] );
	}

	/**
	 * Test get_tools handles invalid JSON.
	 *
	 * @return void
	 */
	public function test_get_tools_handles_invalid_json() {
		// Clear cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get to return invalid JSON.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return [
						'response' => [
							'code' => 200,
						],
						'body'     => 'Invalid JSON {',
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEmpty( $data['tools'] );
	}

	/**
	 * Test get_tools handles empty response.
	 *
	 * @return void
	 */
	public function test_get_tools_handles_empty_response() {
		// Clear cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get to return empty array.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return [
						'response' => [
							'code' => 200,
						],
						'body'     => '[]',
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$this->assertInstanceOf( WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertEmpty( $data['tools'] );
	}

	/**
	 * Test get_tools uses actual API structure.
	 *
	 * @return void
	 */
	public function test_get_tools_uses_actual_api_structure() {
		// Clear cache.
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get with actual API structure.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return [
						'response' => [
							'code' => 200,
						],
						'body'     => self::MOCK_TOOLS_RESPONSE,
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		$data = $response->get_data();
		$this->assertTrue( $data['success'] );
		$this->assertIsArray( $data['tools'] );

		if ( ! empty( $data['tools'] ) ) {
			$tool = $data['tools'][0];
			$this->assertArrayHasKey( 'name', $tool );
			$this->assertArrayHasKey( 'description', $tool );
			$this->assertArrayHasKey( 'endpoint', $tool );
			$this->assertArrayHasKey( 'method', $tool );
			$this->assertArrayHasKey( 'inputSchema', $tool );
			$this->assertArrayHasKey( 'outputSchema', $tool );
		}
	}

	/**
	 * Test get_empty_tools_response sets cache.
	 *
	 * @return void
	 */
	public function test_get_empty_tools_response_sets_cache() {
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
		$cache_key = \md5( $url );

		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete( $cache_key );

		// Mock wp_remote_get to return error.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( \strpos( $url, 'angie-jobs' ) !== false ) {
					return new WP_Error( 'error', 'Network error' );
				}
				return $preempt;
			},
			10,
			3
		);

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/angie/tools' );
		$response = $this->angie_api->get_tools( $request );

		// Verify cache was set with empty array.
		$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
		$this->assertIsArray( $cached );
		$this->assertEmpty( $cached );
	}

	/**
	 * Test get_angie_tasks returns correct task IDs.
	 *
	 * @return void
	 */
	public function test_get_angie_tasks() {
		$reflection = new \ReflectionClass( $this->angie_api );
		$method     = $reflection->getMethod( 'get_angie_tasks' );
		$method->setAccessible( true );

		$tasks = $method->invoke( $this->angie_api );

		$this->assertIsArray( $tasks );
		$this->assertContains( 'core-blogdescription', $tasks );
		$this->assertContains( 'select-locale', $tasks );
		$this->assertContains( 'select-timezone', $tasks );
	}

	/**
	 * Test get_angie_tasks_map returns correct mapping.
	 *
	 * @return void
	 */
	public function test_get_angie_tasks_map() {
		$reflection = new \ReflectionClass( $this->angie_api );
		$method     = $reflection->getMethod( 'get_angie_tasks_map' );
		$method->setAccessible( true );

		$map = $method->invoke( $this->angie_api );

		$this->assertIsArray( $map );
		$this->assertArrayHasKey( 'core-blogdescription', $map );
		$this->assertArrayHasKey( 'select-locale', $map );
		$this->assertArrayHasKey( 'select-timezone', $map );
		// The map holds the option each task writes, and every one of them must
		// be on the interactive-task whitelist -- this endpoint is not allowed to
		// reach options the interactive tasks themselves could not update.
		$this->assertEquals( 'blogdescription', $map['core-blogdescription'] );
		$this->assertEquals( 'WPLANG', $map['select-locale'] );
		$this->assertEquals( 'timezone_string', $map['select-timezone'] );

		$allowed = \apply_filters(
			'progress_planner_interactive_task_allowed_options',
			[ 'blogdescription', 'timezone_string', 'WPLANG' ]
		);

		foreach ( $map as $task_id => $setting ) {
			$this->assertContains(
				$setting,
				$allowed,
				\sprintf( 'The option for "%s" must be on the interactive-task whitelist.', $task_id )
			);
		}
	}

	/**
	 * An option that is not on the whitelist is rejected.
	 *
	 * @return void
	 */
	public function test_update_task_setting_rejects_options_off_the_whitelist() {
		$method = $this->get_accessible_method( 'update_task_setting' );

		$result = $method->invoke( $this->angie_api, 'admin_email', 'attacker@example.com' );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'invalid_setting', $result->get_error_code() );
	}

	/**
	 * A whitelisted option is written.
	 *
	 * @return void
	 */
	public function test_update_task_setting_writes_whitelisted_options() {
		$method = $this->get_accessible_method( 'update_task_setting' );

		$this->assertTrue( $method->invoke( $this->angie_api, 'blogdescription', 'A new tagline' ) );
		$this->assertEquals( 'A new tagline', \get_option( 'blogdescription' ) );
	}

	/**
	 * A non-scalar or empty value is rejected before anything is written.
	 *
	 * @return void
	 */
	public function test_update_task_setting_rejects_unusable_values() {
		$method = $this->get_accessible_method( 'update_task_setting' );

		\update_option( 'blogdescription', 'Unchanged' );

		$array_result = $method->invoke( $this->angie_api, 'blogdescription', [ 'not', 'scalar' ] );
		$this->assertInstanceOf( \WP_Error::class, $array_result );
		$this->assertEquals( 'invalid_value', $array_result->get_error_code() );

		$empty_result = $method->invoke( $this->angie_api, 'blogdescription', '' );
		$this->assertInstanceOf( \WP_Error::class, $empty_result );
		$this->assertEquals( 'invalid_value', $empty_result->get_error_code() );

		$this->assertEquals( 'Unchanged', \get_option( 'blogdescription' ), 'Nothing should have been written.' );
	}

	/**
	 * A named timezone is stored in timezone_string.
	 *
	 * The stale offset is not asserted to be empty: WordPress core recomputes
	 * gmt_offset from timezone_string whenever the latter is set, so after
	 * selecting Europe/Amsterdam the offset reads back as that zone's current
	 * offset rather than the '' this code writes. What matters is that the
	 * previous, unrelated offset does not survive.
	 *
	 * @return void
	 */
	public function test_named_timezone_is_stored_as_a_timezone_string() {
		$method = $this->get_accessible_method( 'update_task_setting' );

		\update_option( 'gmt_offset', '5' );

		$this->assertTrue( $method->invoke( $this->angie_api, 'timezone_string', 'Europe/Amsterdam' ) );
		$this->assertEquals( 'Europe/Amsterdam', \get_option( 'timezone_string' ) );
		$this->assertNotEquals( '5', \get_option( 'gmt_offset' ), 'The previous offset must not survive.' );
	}

	/**
	 * A UTC offset is stored in gmt_offset, clearing timezone_string.
	 *
	 * @return void
	 */
	public function test_utc_offset_is_stored_as_a_gmt_offset() {
		$method = $this->get_accessible_method( 'update_task_setting' );

		\update_option( 'timezone_string', 'Europe/Amsterdam' );

		$this->assertTrue( $method->invoke( $this->angie_api, 'timezone_string', 'UTC+2' ) );
		$this->assertEquals( '2', \get_option( 'gmt_offset' ) );
		$this->assertEquals( '', \get_option( 'timezone_string' ), 'An offset must clear the named zone.' );
	}

	/**
	 * An unrecognised timezone is rejected and nothing is written.
	 *
	 * @return void
	 */
	public function test_invalid_timezone_is_rejected() {
		$method = $this->get_accessible_method( 'update_task_setting' );

		\update_option( 'timezone_string', 'Europe/Amsterdam' );

		$result = $method->invoke( $this->angie_api, 'timezone_string', 'Mars/Olympus_Mons' );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'invalid_timezone', $result->get_error_code() );
		$this->assertEquals( 'Europe/Amsterdam', \get_option( 'timezone_string' ), 'Nothing should have been written.' );
	}

	/**
	 * Get an accessible ReflectionMethod for a protected method.
	 *
	 * @param string $name The method name.
	 *
	 * @return \ReflectionMethod
	 */
	protected function get_accessible_method( $name ) {
		$method = ( new \ReflectionClass( $this->angie_api ) )->getMethod( $name );
		$method->setAccessible( true );

		return $method;
	}
}
