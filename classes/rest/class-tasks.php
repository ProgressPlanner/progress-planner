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
					'permission_callback' => [ $this, 'check_permission' ],
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
	 * Check permission for the REST API endpoint.
	 *
	 * This endpoint requires either:
	 * 1. User to be authenticated with manage_options capability, OR
	 * 2. Valid token with rate limiting
	 *
	 * @param \WP_REST_Request $request The request object.
	 *
	 * @return bool|\WP_Error
	 */
	public function check_permission( $request ) {
		// If user is authenticated and has manage_options capability, allow access.
		if ( \is_user_logged_in() && \current_user_can( 'manage_options' ) ) {
			return true;
		}

		// Otherwise, validate token with rate limiting.
		$token = $request->get_param( 'token' );
		if ( ! $token ) {
			return false;
		}

		// Check rate limiting to prevent brute force attacks.
		if ( ! $this->check_rate_limit() ) {
			return new \WP_Error(
				'rest_too_many_requests',
				\__( 'Too many requests. Please try again later.', 'progress-planner' ),
				[ 'status' => 429 ]
			);
		}

		return $this->validate_token( $token );
	}

	/**
	 * Check rate limiting for token-based authentication.
	 *
	 * @return bool True if within rate limit, false otherwise.
	 */
	private function check_rate_limit() {
		// Get the client IP.
		$ip = $this->get_client_ip();

		// Rate limit: 10 requests per minute per IP.
		$transient_key   = 'prpl_api_rate_limit_tasks_' . \md5( $ip );
		$request_count   = \get_transient( $transient_key );
		$max_requests    = \apply_filters( 'progress_planner_api_rate_limit', 10 );
		$rate_limit_time = \apply_filters( 'progress_planner_api_rate_limit_time', 60 ); // seconds.

		if ( false === $request_count ) {
			// First request, set the counter.
			\set_transient( $transient_key, 1, $rate_limit_time );
			return true;
		}

		if ( $request_count >= $max_requests ) {
			return false;
		}

		// Increment the counter.
		\set_transient( $transient_key, $request_count + 1, $rate_limit_time );
		return true;
	}

	/**
	 * Get the client IP address.
	 *
	 * @return string
	 */
	private function get_client_ip() {
		$ip = '';

		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			$ip = \sanitize_text_field( \wp_unslash( $_SERVER['HTTP_CLIENT_IP'] ) );
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$ip = \sanitize_text_field( \wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) );
		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip = \sanitize_text_field( \wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
		}

		return $ip;
	}

	/**
	 * Permission callback.
	 *
	 * @param string $token The token.
	 *
	 * @return bool
	 */
	public function validate_token( $token ) {
		$token = \str_replace( 'token/', '', $token );

		// Check test token first (timing-safe comparison).
		$test_token = \get_option( 'progress_planner_test_token', '' );
		if ( $test_token && \hash_equals( $test_token, $token ) ) {
			return true;
		}

		$license_key = \get_option( 'progress_planner_license_key', false );
		if ( ! $license_key || 'no-license' === $license_key ) {
			return false;
		}

		// Use timing-safe comparison to prevent timing attacks.
		return \hash_equals( $license_key, $token );
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
