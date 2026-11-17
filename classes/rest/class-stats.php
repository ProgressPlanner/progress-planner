<?php
/**
 * Progress_Planner REST-API.
 *
 * Adds a REST-API endpoint to get stats, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/get-stats (X-Progress-Planner-Token header)
 * Legacy URLs with a token remain available during the transport rollout.
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
	 * Route of the endpoint, relative to the namespace.
	 */
	const ROUTE = '/get-stats';

	/**
	 * Register the REST-API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		foreach ( [ '/get-stats', '/get-stats/(?P<token>\S+)' ] as $route ) {
			\register_rest_route(
				'progress-planner/v1',
				$route,
				[
					[
						'methods'             => 'GET',
						'callback'            => [ $this, 'get_stats' ],
						'permission_callback' => [ $this, 'permissions_check' ],
					],
				]
			);
		}
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
}
