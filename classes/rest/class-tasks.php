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
class Tasks extends Base {
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
		// Rate limiting: Check for too many failed attempts.
		$ip_address      = $this->get_client_ip();
		$rate_limit_key  = 'prpl_api_rate_limit_tasks_' . \md5( $ip_address );
		$failed_attempts = (int) \get_transient( $rate_limit_key );

		// Block if more than 10 failed attempts in the last hour.
		if ( $failed_attempts >= 10 ) {
			return false;
		}

		$token = \str_replace( 'token/', '', $token );

		// Check test token first (use hash_equals to prevent timing attacks).
		$test_token = \get_option( 'progress_planner_test_token', '' );
		if ( ! empty( $test_token ) && \hash_equals( $test_token, $token ) ) {
			// Clear failed attempts on successful authentication.
			\delete_transient( $rate_limit_key );
			return true;
		}

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

	/**
	 * Get task recommendations.
	 *
	 * @return \WP_REST_Response The REST response object containing the recommendations.
	 */
	public function get_tasks() {
		// Collection of task objects.
		$tasks           = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => [ 'publish', 'trash', 'draft', 'future', 'pending' ] ] );
		$tasks_to_return = [];

		foreach ( $tasks as $task ) {
			$tasks_to_return[] = $task->get_data();
		}
		return new \WP_REST_Response( $tasks_to_return );
	}
}
