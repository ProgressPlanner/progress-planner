<?php
/**
 * Tests that token-authenticated REST responses stay out of caches.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Stats;
use Progress_Planner\Rest\Tasks;

/**
 * Header authentication means one URL for every caller, so no cache may store the response.
 */
class Rest_Prevent_Caching_Test extends \WP_UnitTestCase {

	/**
	 * Both endpoints register the no-cache filter when the plugin boots.
	 *
	 * @return void
	 */
	public function test_prevent_caching_is_registered() {
		$this->assertNotFalse( \has_filter( 'rest_post_dispatch', [ \progress_planner()->get_rest__stats(), 'prevent_caching' ] ) );
		$this->assertNotFalse( \has_filter( 'rest_post_dispatch', [ \progress_planner()->get_rest__tasks(), 'prevent_caching' ] ) );
	}

	/**
	 * Accepted and rejected requests both get no-cache headers and the LiteSpeed signal.
	 *
	 * @dataProvider endpoint_requests
	 *
	 * @param string $class_name The endpoint class.
	 * @param string $route      The route.
	 * @param string $token      The token header value, or '' for none.
	 * @param int    $status     The expected status.
	 *
	 * @return void
	 */
	public function test_endpoint_responses_are_not_cacheable( $class_name, $route, $token, $status ) {
		global $wp_rest_server;
		$previous_server = $wp_rest_server;
		\wp_set_current_user( 0 );
		\update_option( 'progress_planner_license_key', 'fixture-key' );
		\delete_option( 'progress_planner_test_token' );

		// Only the response callback is mocked; routing, authentication and the filter are real.
		$callback = Stats::class === $class_name ? 'get_stats' : 'get_tasks';
		$api      = $this->getMockBuilder( $class_name )
			->disableOriginalConstructor()
			->onlyMethods( [ $callback ] )
			->getMock();
		$api->method( $callback )->willReturn( new \WP_REST_Response( [ 'authenticated' => true ] ) );

		$request = new \WP_REST_Request( 'GET', '/progress-planner/v1' . $route );
		if ( '' !== $token ) {
			$request->set_header( 'X-Progress-Planner-Token', $token );
		}

		$register = function () use ( $api ) {
			global $wp_rest_server;
			// Keep only this fixture's routes, while still registering on the real hook.
			$wp_rest_server = new \WP_REST_Server();
			$api->register_rest_endpoint();
		};
		\add_action( 'rest_api_init', $register, PHP_INT_MAX );

		try {
			\do_action( 'rest_api_init', $wp_rest_server );
			$response = $wp_rest_server->dispatch( $request );

			$litespeed = \did_action( 'litespeed_control_set_nocache' );
			$response  = $api->prevent_caching( $response, $wp_rest_server, $request );
		} finally {
			\remove_action( 'rest_api_init', $register, PHP_INT_MAX );
			$wp_rest_server = $previous_server;
		}

		$this->assertSame( $status, $response->get_status() );
		$headers = $response->get_headers();
		$this->assertStringContainsString( 'no-store', $headers['Cache-Control'] ?? '' );
		$this->assertStringContainsString( 'private', $headers['Cache-Control'] ?? '' );
		$this->assertSame( $litespeed + 1, \did_action( 'litespeed_control_set_nocache' ) );
	}

	/**
	 * Accepted and rejected requests to both endpoints.
	 *
	 * @return array<string, array{string, string, string, int}>
	 */
	public static function endpoint_requests() {
		return [
			'stats accepted'    => [ Stats::class, '/get-stats', 'fixture-key', 200 ],
			'stats wrong token' => [ Stats::class, '/get-stats', 'wrong', 401 ],
			'stats no token'    => [ Stats::class, '/get-stats', '', 401 ],
			'tasks accepted'    => [ Tasks::class, '/tasks', 'fixture-key', 200 ],
			'tasks wrong token' => [ Tasks::class, '/tasks', 'wrong', 401 ],
			'tasks no token'    => [ Tasks::class, '/tasks', '', 401 ],
		];
	}

	/**
	 * Other routes, including look-alikes, keep their own cache headers.
	 *
	 * @dataProvider other_routes
	 *
	 * @param string $class_name The endpoint class.
	 * @param string $route      The requested route.
	 *
	 * @return void
	 */
	public function test_prevent_caching_leaves_other_routes_alone( $class_name, $route ) {
		$api = $this->getMockBuilder( $class_name )
			->disableOriginalConstructor()
			->onlyMethods( [] )
			->getMock();

		$litespeed = \did_action( 'litespeed_control_set_nocache' );
		$response  = $api->prevent_caching(
			new \WP_REST_Response( [] ),
			\rest_get_server(),
			new \WP_REST_Request( 'GET', $route )
		);

		$this->assertArrayNotHasKey( 'Cache-Control', $response->get_headers() );
		$this->assertSame( $litespeed, \did_action( 'litespeed_control_set_nocache' ) );
	}

	/**
	 * Routes the no-cache filter must not touch.
	 *
	 * @return array<string, array{string, string}>
	 */
	public static function other_routes() {
		return [
			'core posts route'       => [ Stats::class, '/wp/v2/posts' ],
			'other plugin route'     => [ Stats::class, '/progress-planner/v1/recommendations' ],
			'look-alike stats route' => [ Stats::class, '/progress-planner/v1/get-stats-extra' ],
			'look-alike tasks route' => [ Tasks::class, '/progress-planner/v1/tasks-extra' ],
			'other endpoint route'   => [ Tasks::class, '/progress-planner/v1/get-stats' ],
		];
	}
}
