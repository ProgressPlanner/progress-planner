<?php
/**
 * Progress_Planner REST-API.
 *
 * Adds a REST-API endpoint to get stats, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/get-stats/token/<site-token>
 *
 * The token is generated and saved in the settings.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

use Progress_Planner\Admin\Widgets\Activity_Scores;

/**
 * Rest_API_Stats class.
 */
class Stats extends Base {
	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'rest_api_init', [ $this, 'register_rest_endpoint' ] );
	}

	/**
	 * Register the REST-API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/get-stats/(?P<token>\S+)',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_stats' ],
					'permission_callback' => '__return_true',
					'args'                => [
						'token' => [
							'required'          => true,
							'validate_callback' => [ $this, 'validate_token' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Receive the data from the client.
	 *
	 * This method handles a REST request and returns a REST response.
	 *
	 * @return \WP_REST_Response The REST response object containing the stats.
	 */
	public function get_stats() {
		$system_status = new \Progress_Planner\Utils\System_Status();

		return new \WP_REST_Response( $system_status->get_system_status() );
	}

	/**
	 * Validate the token.
	 *
	 * @param string $token The token.
	 *
	 * @return bool
	 */
	public function validate_token( $token ) {
		// Rate limiting: Check for too many failed attempts.
		$ip_address      = $this->get_client_ip();
		$rate_limit_key  = 'prpl_api_rate_limit_' . \md5( $ip_address );
		$failed_attempts = (int) \get_transient( $rate_limit_key );

		// Block if more than 10 failed attempts in the last hour.
		if ( $failed_attempts >= 10 ) {
			return false;
		}

		$token       = \str_replace( 'token/', '', $token );
		$license_key = \get_option( 'progress_planner_license_key', false );
		if ( ! $license_key || 'no-license' === $license_key ) {
			// Increment failed attempts counter.
			\set_transient( $rate_limit_key, $failed_attempts + 1, HOUR_IN_SECONDS );
			return false;
		}

		// Use hash_equals() to prevent timing attacks.
		$is_valid = \hash_equals( $license_key, $token );

		if ( ! $is_valid ) {
			// Increment failed attempts counter.
			\set_transient( $rate_limit_key, $failed_attempts + 1, HOUR_IN_SECONDS );
		} else {
			// Clear failed attempts on successful authentication.
			\delete_transient( $rate_limit_key );
		}

		return $is_valid;
	}
}
