<?php
/**
 * Tests for the AI_Tasks remote client.
 *
 * AI_Tasks::get_items() talks to the SaaS server and caches the result. These
 * tests pin the failure handling (transport error, non-200, non-JSON body) and
 * the caching behaviour, since a bad response must not be treated as tasks and
 * must not be cached for the full hour.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * AI_Tasks test case.
 */
class AI_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * The stubbed HTTP response, or null to let requests through.
	 *
	 * @var array|\WP_Error|null
	 */
	protected $http_stub = null;

	/**
	 * Number of HTTP requests the stub intercepted.
	 *
	 * @var int
	 */
	protected $http_calls = 0;

	/**
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();

		$this->http_stub  = null;
		$this->http_calls = 0;

		// The provider's init() already called get_items() during bootstrap and
		// cached the (failed) result, so clear it or every call here is a cache
		// hit that never reaches the stub.
		$this->forget_cached_items();
		$this->forget_cached_items( [ 'branding' => 'acme' ] );

		\add_filter( 'pre_http_request', [ $this, 'filter_pre_http_request' ], 10, 3 );
	}

	/**
	 * Delete the cached get_items() payload for the given arguments.
	 *
	 * Mirrors the cache key AI_Tasks::get_items() builds.
	 *
	 * @param array $args Optional. The same arguments passed to get_items().
	 *
	 * @return void
	 */
	protected function forget_cached_items( $args = [] ) {
		$query_args = [
			'site'        => \get_site_url(),
			'license_key' => \get_option( 'progress_planner_license_key' ),
		];

		if ( ! empty( $args['branding'] ) ) {
			$query_args['branding'] = $args['branding'];
		}

		$url = \add_query_arg(
			$query_args,
			\progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/suggested-todo'
		);

		\progress_planner()->get_utils__cache()->delete( \md5( $url ) );
	}

	/**
	 * Clean up.
	 */
	public function tear_down() {
		\remove_filter( 'pre_http_request', [ $this, 'filter_pre_http_request' ], 10 );

		parent::tear_down();
	}

	/**
	 * Short-circuit HTTP requests with the configured stub.
	 *
	 * @param mixed  $preempt The preemptive response.
	 * @param array  $args    The request arguments.
	 * @param string $url     The request URL.
	 *
	 * @return mixed
	 */
	public function filter_pre_http_request( $preempt, $args, $url ) {
		if ( null === $this->http_stub ) {
			return $preempt;
		}

		++$this->http_calls;

		return $this->http_stub;
	}

	/**
	 * Build a well-formed HTTP response array.
	 *
	 * @param int    $code The response code.
	 * @param string $body The response body.
	 *
	 * @return array
	 */
	protected function http_response( $code, $body ) {
		return [
			'headers'  => [],
			'body'     => $body,
			'response' => [
				'code'    => $code,
				'message' => 200 === $code ? 'OK' : 'Error',
			],
			'cookies'  => [],
			'filename' => null,
		];
	}

	/**
	 * A successful response is decoded and returned.
	 *
	 * @return void
	 */
	public function test_get_items_returns_decoded_tasks() {
		$tasks = [
			[
				'task_id'            => 42,
				'title'              => 'Improve your homepage',
				'ai_prompt_template' => 'Analyse {site_url}',
			],
		];

		$this->http_stub = $this->http_response( 200, (string) \wp_json_encode( $tasks ) );

		$this->assertSame( $tasks, \progress_planner()->get_ai_tasks()->get_items() );
	}

	/**
	 * A transport error yields an empty array rather than a WP_Error.
	 *
	 * The failure is also cached for the short retry window, so a server that
	 * is down does not trigger a fresh request on every page load.
	 *
	 * @return void
	 */
	public function test_get_items_returns_empty_array_on_transport_error() {
		$this->http_stub = new \WP_Error( 'http_request_failed', 'Connection refused.' );

		$this->assertSame( [], \progress_planner()->get_ai_tasks()->get_items() );
		$this->assertSame( 1, $this->http_calls );

		// The empty result is cached, so a second call does not retry immediately.
		$this->assertSame( [], \progress_planner()->get_ai_tasks()->get_items() );
		$this->assertSame( 1, $this->http_calls, 'A transport failure should be cached for the retry window.' );
	}

	/**
	 * A non-200 response yields an empty array.
	 *
	 * The body is deliberately a valid JSON array of task-shaped data: the
	 * status code alone must reject it. A non-JSON body would be caught by the
	 * decode check further down instead, and would not exercise this guard.
	 *
	 * @return void
	 */
	public function test_get_items_returns_empty_array_on_error_status() {
		$this->http_stub = $this->http_response(
			500,
			(string) \wp_json_encode(
				[
					[
						'task_id' => 1,
						'title'   => 'Should be ignored',
					],
				]
			)
		);

		$this->assertSame( [], \progress_planner()->get_ai_tasks()->get_items() );
	}

	/**
	 * A 200 response whose body is not JSON yields an empty array.
	 *
	 * @return void
	 */
	public function test_get_items_returns_empty_array_on_non_json_body() {
		$this->http_stub = $this->http_response( 200, '<html>not json</html>' );

		$this->assertSame( [], \progress_planner()->get_ai_tasks()->get_items() );
	}

	/**
	 * A successful response is served from cache on the second call.
	 *
	 * @return void
	 */
	public function test_get_items_is_cached_between_calls() {
		$tasks = [
			[
				'task_id' => 7,
				'title'   => 'Cached task',
			],
		];

		$this->http_stub = $this->http_response( 200, (string) \wp_json_encode( $tasks ) );

		$first = \progress_planner()->get_ai_tasks()->get_items();
		$this->assertSame( 1, $this->http_calls, 'The first call should hit the network.' );

		$second = \progress_planner()->get_ai_tasks()->get_items();
		$this->assertSame( 1, $this->http_calls, 'The second call should be served from cache.' );

		$this->assertSame( $first, $second );
	}

	/**
	 * The branding argument varies the cache key, so it is not served a
	 * response fetched for a different branding.
	 *
	 * @return void
	 */
	public function test_branding_argument_uses_a_separate_cache_entry() {
		$this->http_stub = $this->http_response( 200, (string) \wp_json_encode( [ [ 'task_id' => 1 ] ] ) );
		\progress_planner()->get_ai_tasks()->get_items();
		$this->assertSame( 1, $this->http_calls );

		$this->http_stub = $this->http_response( 200, (string) \wp_json_encode( [ [ 'task_id' => 2 ] ] ) );
		$branded         = \progress_planner()->get_ai_tasks()->get_items( [ 'branding' => 'acme' ] );

		$this->assertSame( 2, $this->http_calls, 'A different branding should not reuse the cached entry.' );
		$this->assertSame( [ [ 'task_id' => 2 ] ], $branded );
	}

	/**
	 * An uncached response reports false rather than null or an empty string.
	 *
	 * @return void
	 */
	public function test_get_cached_response_returns_false_when_absent() {
		$this->assertFalse( \progress_planner()->get_ai_tasks()->get_cached_response( 12345 ) );
	}

	/**
	 * A cached response round-trips, and clearing it removes it.
	 *
	 * @return void
	 */
	public function test_cache_response_round_trips_and_clears() {
		$ai_tasks = \progress_planner()->get_ai_tasks();

		$ai_tasks->cache_response( 99, 'The AI says hello.' );
		$this->assertSame( 'The AI says hello.', $ai_tasks->get_cached_response( 99 ) );

		$ai_tasks->clear_cached_response( 99 );
		$this->assertFalse( $ai_tasks->get_cached_response( 99 ), 'The response should be gone after clearing.' );
	}

	/**
	 * Responses are keyed per task, so clearing one leaves the others.
	 *
	 * @return void
	 */
	public function test_cached_responses_are_keyed_per_task() {
		$ai_tasks = \progress_planner()->get_ai_tasks();

		$ai_tasks->cache_response( 1, 'First.' );
		$ai_tasks->cache_response( 2, 'Second.' );

		$ai_tasks->clear_cached_response( 1 );

		$this->assertFalse( $ai_tasks->get_cached_response( 1 ) );
		$this->assertSame( 'Second.', $ai_tasks->get_cached_response( 2 ) );
	}
}
