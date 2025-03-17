<?php
/**
 * Progress_Planner REST-API.
 *
 * Adds a REST-API endpoint to get tasks, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/tasks
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Rest_API_Tasks class.
 */
class Rest_API_Tasks {
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
			'/tasks',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_tasks' ],
					'permission_callback' => '__return_true',
				],
			]
		);
	}

	/**
	 * Get task recommendations.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response The REST response object containing the recommendations.
	 */
	public function get_tasks( \WP_REST_Request $request ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
		$tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );

		return new \WP_REST_Response( $tasks );
	}
}
