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

use Progress_Planner\Base;
use Progress_Planner\Admin\Widgets\Activity_Scores;

/**
 * Rest_API_Stats class.
 */
class Stats {
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
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response The REST response object containing the stats.
	 */
	public function get_stats( \WP_REST_Request $request ) {
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
		$token = str_replace( 'token/', '', $token );
		if ( \progress_planner()->is_pro_site() && $token === \get_option( 'progress_planner_pro_license_key' ) ) {
			return true;
		}
		$license_key = \get_option( 'progress_planner_license_key', false );
		if ( ! $license_key || 'no-license' === $license_key ) {
			return false;
		}

		return $token === $license_key;
	}
}
