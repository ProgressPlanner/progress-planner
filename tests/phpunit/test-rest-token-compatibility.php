<?php
/**
 * Regression tests for the temporary credential transport compatibility release.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Stats;
use Progress_Planner\Rest\Tasks;

/**
 * Exercise real REST routing and permissions without collecting site statistics.
 */
class Rest_Token_Compatibility_Test extends \WP_UnitTestCase {

	/**
	 * Both old callers and the new server authenticate, without falling back from a bad header.
	 *
	 * @dataProvider authentication_cases
	 *
	 * @param string $route   Route suffix.
	 * @param array  $query   Query parameters.
	 * @param array  $headers Request headers.
	 * @param int    $status  Expected HTTP status.
	 * @return void
	 */
	public function test_authentication( $route, $query, $headers, $status ) {
		global $wp_rest_server;
		$previous_server = $wp_rest_server;
		$wp_rest_server  = new \WP_REST_Server();
		\wp_set_current_user( 0 );
		\update_option( 'progress_planner_license_key', 'fixture-key' );
		\delete_option( 'progress_planner_test_token' );

		// Only the response callbacks are mocked; route registration and token checks are real.
		$is_stats = 0 === \strpos( $route, '/get-stats' );
		$callback = $is_stats ? 'get_stats' : 'get_tasks';
		$api      = $this->getMockBuilder( $is_stats ? Stats::class : Tasks::class )
			->disableOriginalConstructor()
			->onlyMethods( [ $callback ] )
			->getMock();
		$api->expects( 200 === $status ? $this->once() : $this->never() )
			->method( $callback )
			->willReturn( new \WP_REST_Response( [ 'authenticated' => true ] ) );
		$api->register_rest_endpoint();

		$request = new \WP_REST_Request( 'GET', '/progress-planner/v1' . $route );
		$request->set_query_params( $query );
		foreach ( $headers as $name => $value ) {
			$request->set_header( $name, $value );
		}

		try {
			$response = $wp_rest_server->dispatch( $request );
			$this->assertSame( $status, $response->get_status() );
			if ( 200 === $status ) {
				$this->assertSame( [ 'authenticated' => true ], $response->get_data() );
			} else {
				$this->assertSame( 'rest_forbidden', $response->get_data()['code'] );
			}
		} finally {
			$wp_rest_server = $previous_server;
		}
	}

	/**
	 * Requests used by the legacy server, the new server and invalid callers.
	 *
	 * @return array
	 */
	public static function authentication_cases() {
		$cases = [
			'legacy stats path'          => [ '/get-stats/token/fixture-key', [], [], 200 ],
			'legacy bare stats path'     => [ '/get-stats/fixture-key', [], [], 200 ],
			'invalid legacy stats path'  => [ '/get-stats/token/wrong', [], [], 401 ],
			'header wins over path'      => [ '/get-stats/token/wrong', [], [ 'X-Progress-Planner-Token' => 'fixture-key' ], 200 ],
			'bad header with valid path' => [ '/get-stats/token/fixture-key', [], [ 'X-Progress-Planner-Token' => 'wrong' ], 401 ],
		];
		foreach ( [ '/get-stats', '/tasks' ] as $route ) {
			$cases[ $route . ' header' ]                    = [ $route, [], [ 'X-Progress-Planner-Token' => 'fixture-key' ], 200 ];
			$cases[ $route . ' lowercase header' ]          = [ $route, [], [ 'x-progress-planner-token' => ' fixture-key ' ], 200 ];
			$cases[ $route . ' query' ]                     = [ $route, [ 'token' => 'fixture-key' ], [], 200 ];
			$cases[ $route . ' missing' ]                   = [ $route, [], [], 401 ];
			$cases[ $route . ' wrong query' ]               = [ $route, [ 'token' => 'wrong' ], [], 401 ];
			$cases[ $route . ' array query' ]               = [ $route, [ 'token' => [ 'fixture-key' ] ], [], 401 ];
			$cases[ $route . ' bearer alone' ]              = [ $route, [], [ 'Authorization' => 'Bearer fixture-key' ], 401 ];
			$cases[ $route . ' unrelated bearer' ]          = [
				$route,
				[],
				[
					'Authorization'            => 'Bearer other-plugin',
					'X-Progress-Planner-Token' => 'fixture-key',
				],
				200,
			];
			$cases[ $route . ' invalid header precedence' ] = [ $route, [ 'token' => 'fixture-key' ], [ 'X-Progress-Planner-Token' => 'wrong' ], 401 ];
			$cases[ $route . ' empty header precedence' ]   = [ $route, [ 'token' => 'fixture-key' ], [ 'X-Progress-Planner-Token' => '' ], 401 ];
			$cases[ $route . ' valid header precedence' ]   = [ $route, [ 'token' => [ 'wrong' ] ], [ 'X-Progress-Planner-Token' => 'fixture-key' ], 200 ];
			$cases[ $route . ' prefixed header rejected' ]  = [ $route, [], [ 'X-Progress-Planner-Token' => 'token/fixture-key' ], 401 ];
		}
		return $cases;
	}
}
