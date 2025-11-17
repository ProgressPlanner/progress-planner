<?php
/**
 * Base class for integration tests.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Base class for integration tests.
 */
abstract class Integration_Test_Case extends \WP_UnitTestCase {

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
	}

	/**
	 * Tear down test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		parent::tearDown();
	}

	/**
	 * Create a test task recommendation.
	 *
	 * @param array $args Task arguments.
	 * @return int Post ID.
	 */
	protected function create_test_task( $args = [] ) {
		$defaults = [
			'task_id'     => 'test-task-' . \uniqid(),
			'post_title'  => 'Test Task',
			'provider_id' => 'test-provider',
			'post_status' => 'publish',
		];

		$data = \wp_parse_args( $args, $defaults );

		return \progress_planner()->get_suggested_tasks_db()->add( $data );
	}

	/**
	 * Create a test user task.
	 *
	 * @param array $args Task arguments.
	 * @return int Post ID.
	 */
	protected function create_test_user_task( $args = [] ) {
		$defaults = [
			'task_id'     => 'user-task-' . \uniqid(),
			'post_title'  => 'User Task',
			'provider_id' => 'user',
			'post_status' => 'publish',
		];

		$data = \wp_parse_args( $args, $defaults );

		return \progress_planner()->get_suggested_tasks_db()->add( $data );
	}

	/**
	 * Make a REST API request.
	 *
	 * @param string $endpoint Endpoint path.
	 * @param string $method HTTP method.
	 * @param array  $params Request parameters.
	 * @return \WP_REST_Response|\WP_Error
	 */
	protected function make_rest_request( $endpoint, $method = 'GET', $params = [] ) {
		$request = new \WP_REST_Request( $method, $endpoint );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}

		$server = \rest_get_server();
		return $server->dispatch( $request );
	}
}

