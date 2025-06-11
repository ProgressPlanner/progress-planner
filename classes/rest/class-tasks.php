<?php
/**
 * Progress_Planner REST-API.
 *
 * Adds a REST-API endpoint to get tasks, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/tasks
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Rest_API_Tasks class.
 */
class Tasks {
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
	 * Permission callback.
	 *
	 * @param string $token The token.
	 *
	 * @return bool
	 */
	public function validate_token( $token ) {
		$token = str_replace( 'token/', '', $token );

		if ( $token === \get_option( 'progress_planner_test_token', '' ) ) {
			return true;
		}

		if ( \progress_planner()->is_pro_site() && $token === \get_option( 'progress_planner_pro_license_key' ) ) {
			return true;
		}
		$license_key = \get_option( 'progress_planner_license_key', false );
		if ( ! $license_key || 'no-license' === $license_key ) {
			return false;
		}

		return $token === $license_key;
	}

	/**
	 * Get task recommendations.
	 *
	 * @return \WP_REST_Response The REST response object containing the recommendations.
	 */
	public function get_tasks() {

		// Collection of task objects.
		$tasks           = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] );
		$tasks_to_return = [];

		foreach ( $tasks as $task ) {
			$tasks_to_return[] = $task->get_data();
		}
		return new \WP_REST_Response( $tasks_to_return );
	}
}
