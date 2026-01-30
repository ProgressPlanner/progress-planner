<?php
/**
 * Base class for Remote REST API endpoints.
 *
 * Provides shared authentication (Bearer token + HMAC signature)
 * for all /remote/ endpoints.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Remote_Base class.
 *
 * @since x.x.x
 */
abstract class Remote_Base extends Base {

	/**
	 * Maximum allowed age of a request timestamp in seconds.
	 *
	 * Requests with timestamps older than this are rejected
	 * to prevent replay attacks.
	 *
	 * @since x.x.x
	 *
	 * @var int
	 */
	const TIMESTAMP_TOLERANCE = 300; // 5 minutes.

	/**
	 * Check permission for remote endpoints.
	 *
	 * Implements double verification:
	 * 1. Bearer token must match the stored license key or test token.
	 * 2. HMAC signature validates request came from PP Server (prevents token theft).
	 *
	 * @since x.x.x
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return true|\WP_Error True if permission granted, WP_Error otherwise.
	 */
	public function check_permission( $request ) {
		$token = $this->extract_bearer_token( $request );
		if ( \is_wp_error( $token ) ) {
			return $token;
		}

		if ( ! $this->validate_token( $token ) ) {
			return new \WP_Error(
				'invalid_token',
				'The provided token is invalid or expired',
				[ 'status' => 401 ]
			);
		}

		return $this->verify_signature( $request, $token );
	}

	/**
	 * Extract the Bearer token from the Authorization header.
	 *
	 * @since x.x.x
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return string|\WP_Error The token string, or WP_Error if missing/invalid.
	 */
	protected function extract_bearer_token( $request ) {
		$auth_header = $request->get_header( 'authorization' );

		if ( ! $auth_header || 0 !== \strpos( $auth_header, 'Bearer ' ) ) {
			return new \WP_Error(
				'invalid_token',
				'Missing or invalid Authorization header',
				[ 'status' => 401 ]
			);
		}

		return \substr( $auth_header, 7 );
	}

	/**
	 * Verify the HMAC signature from PP Server.
	 *
	 * The signature is computed as:
	 *   hash_hmac('sha256', $request_body . $timestamp, $shared_secret)
	 *
	 * Where $shared_secret is the same token used for Bearer auth.
	 *
	 * @since x.x.x
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @param string           $token   The validated Bearer token (used as HMAC key).
	 *
	 * @return true|\WP_Error True if signature is valid, WP_Error otherwise.
	 */
	protected function verify_signature( $request, $token ) {
		$signature = $request->get_header( 'x_pp_server_signature' );
		$timestamp = $request->get_header( 'x_pp_server_timestamp' );

		if ( ! $signature || ! $timestamp ) {
			return new \WP_Error(
				'invalid_token',
				'Missing server signature or timestamp',
				[ 'status' => 401 ]
			);
		}

		// Reject requests with stale timestamps to prevent replay attacks.
		if ( \abs( \time() - (int) $timestamp ) > self::TIMESTAMP_TOLERANCE ) {
			return new \WP_Error(
				'invalid_token',
				'Request timestamp expired',
				[ 'status' => 401 ]
			);
		}

		$request_body       = $request->get_body();
		$expected_signature = \hash_hmac( 'sha256', $request_body . $timestamp, $token );

		if ( ! \hash_equals( $expected_signature, $signature ) ) {
			return new \WP_Error(
				'invalid_token',
				'Invalid server signature',
				[ 'status' => 401 ]
			);
		}

		return true;
	}
}
