<?php
/**
 * Regression tests for failed branding requests.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Test branding failure caching and recovery.
 */
class Branding_Cache_Test extends \WP_UnitTestCase {

	/**
	 * Failed requests should be retried only after their cache expires.
	 *
	 * @dataProvider failure_types
	 *
	 * @param string $failure_type Transport error or HTTP error.
	 * @return void
	 */
	public function test_badge_lookups_cache_failures_and_recover( $failure_type ) {
		$branding      = \progress_planner()->get_ui__branding();
		$url           = \progress_planner()->get_branding_server_url() . '/v1/brands/' . $branding->get_branding_id() . '.json';
		$transient     = \Progress_Planner\Utils\Cache::CACHE_PREFIX . \md5( $url );
		$requests      = 0;
		$recover       = false;
		$badge_url     = 'https://example.org/monthly-2026-m9.svg';
		$mock_response = static function ( $preempt, $args, $request_url ) use ( $url, $failure_type, $badge_url, &$requests, &$recover ) {
			if ( $url !== $request_url ) {
				return $preempt;
			}

			++$requests;
			if ( $recover ) {
				return [
					'response' => [ 'code' => 200 ],
					'body'     => \wp_json_encode(
						[
							'format' => 1,
							'badges' => [ 'monthly-2026-m9' => $badge_url ],
						]
					),
				];
			}

			return 'transport' === $failure_type
				? new \WP_Error( 'http_request_failed', 'Connection timed out.' )
				: [
					'response' => [ 'code' => 503 ],
					'body'     => 'Service unavailable',
				];
		};

		\delete_transient( $transient );
		\add_filter( 'pre_http_request', $mock_response, 10, 3 );

		try {
			$this->assertSame( [], $branding->get_badge_urls() );
			foreach ( [ 'monthly-2026-m9', 'awesome-author', 'maintenance-maniac' ] as $badge_id ) {
				$this->assertSame( \progress_planner()->get_placeholder_svg(), $branding->get_badge_url( $badge_id ) );
			}
			$this->assertSame( 1, $requests, 'Badge localization must reuse the cached failure.' );

			// A fresh branding instance must also honor the persistent failure cache.
			$branding = new \Progress_Planner\UI\Branding();
			$this->assertSame( [], $branding->get_badge_urls() );
			$this->assertSame( 1, $requests );

			$timeout = (int) \get_option( '_transient_timeout_' . $transient );
			$this->assertGreaterThan( \time(), $timeout );
			$this->assertLessThanOrEqual( \time() + 5 * MINUTE_IN_SECONDS, $timeout );

			// Expire the transient without sleeping, then allow the server to recover.
			\update_option( '_transient_timeout_' . $transient, \time() - 1 );
			$recover = true;
			$this->assertSame( $badge_url, $branding->get_badge_url( 'monthly-2026-m9' ) );
			$this->assertSame( $badge_url, $branding->get_badge_url( 'monthly-2026-m9' ) );
			$this->assertSame( 2, $requests, 'Fetch once after expiry and cache the successful response.' );
		} finally {
			\remove_filter( 'pre_http_request', $mock_response, 10 );
			\delete_transient( $transient );
		}
	}

	/**
	 * Failure modes handled by the branding client.
	 *
	 * @return array<string, array<string>>
	 */
	public static function failure_types() {
		return [
			'transport error' => [ 'transport' ],
			'HTTP error'      => [ 'http' ],
		];
	}
}
