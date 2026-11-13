<?php
/**
 * Base class for REST API endpoints.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Base class for REST API endpoints.
 */
abstract class Base {

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'rest_api_init', [ $this, 'register_rest_endpoint' ] );
	}

	/**
	 * Register REST endpoint.
	 *
	 * Child classes must implement this method to define their REST endpoints.
	 *
	 * @return void
	 */
	abstract public function register_rest_endpoint();

	/**
	 * Get client IP address.
	 *
	 * @return string
	 */
	protected function get_client_ip() {
		// Forwarded headers are client input unless a trusted proxy normalizes REMOTE_ADDR.
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? \sanitize_text_field( \wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		return \filter_var( $ip, FILTER_VALIDATE_IP ) ? $ip : '0.0.0.0';
	}

	/**
	 * Authenticate a request using a bearer token, never a URL parameter.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @return bool
	 */
	public function permissions_check( $request ) {
		$authorization = $request->get_header( 'authorization' );
		return \is_string( $authorization )
			&& 1 === \preg_match( '/^Bearer ([^\s]+)$/iD', $authorization, $matches )
			&& $this->validate_token( $matches[1] );
	}

	/**
	 * Validate the token.
	 *
	 * @param mixed $token The token.
	 *
	 * @return bool
	 */
	public function validate_token( $token ) {
		if ( ! \is_string( $token ) || '' === $token ) {
			return false;
		}

		// Rate limiting: Check for too many failed attempts.
		$ip_address      = $this->get_client_ip();
		$rate_limit_key  = 'prpl_api_rate_limit_' . \md5( $ip_address );
		$failed_attempts = (int) \get_transient( $rate_limit_key );

		// Block if more than 10 failed attempts in the last hour.
		if ( $failed_attempts >= 10 ) {
			return false;
		}

		// Check test token first (use hash_equals to prevent timing attacks).
		$test_token = \get_option( 'progress_planner_test_token', '' );
		if ( ! empty( $test_token ) && \hash_equals( $test_token, $token ) ) {
			// Clear failed attempts on successful authentication.
			\delete_transient( $rate_limit_key );
			return true;
		}

		$license_key = \progress_planner()->get_license_key();
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
