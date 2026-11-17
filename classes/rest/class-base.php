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
	 * HTTP header that carries the site token.
	 */
	const TOKEN_HEADER = 'X-Progress-Planner-Token';

	/**
	 * REST namespace of the token-authenticated endpoints.
	 */
	const REST_NAMESPACE = '/progress-planner/v1';

	/**
	 * Route of the endpoint, relative to the namespace. Empty means no route.
	 */
	const ROUTE = '';

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'rest_api_init', [ $this, 'register_rest_endpoint' ] );
		\add_filter( 'rest_post_dispatch', [ $this, 'prevent_caching' ], 10, 3 );
	}

	/**
	 * Keep responses of this endpoint out of every cache.
	 *
	 * With header authentication every caller requests the same URL. A cache
	 * that stored an authenticated response would hand it to anyone requesting
	 * that URL, and the server would get stale data back. WordPress only sends
	 * no-cache headers to logged-in users, and the server is not logged in.
	 * Runs for successful and rejected requests alike.
	 *
	 * @param mixed $response The response.
	 * @param mixed $server   The REST server.
	 * @param mixed $request  The request.
	 *
	 * @return mixed
	 */
	public function prevent_caching( $response, $server, $request ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		if ( '' === static::ROUTE
			|| ! $response instanceof \WP_HTTP_Response
			|| ! $request instanceof \WP_REST_Request
		) {
			return $response;
		}

		$route = self::REST_NAMESPACE . static::ROUTE;
		if ( $route !== $request->get_route() && 0 !== \strpos( $request->get_route(), $route . '/' ) ) {
			return $response;
		}

		$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, private' );
		$response->header( 'Expires', 'Wed, 11 Jan 1984 05:00:00 GMT' );

		// LiteSpeed Cache caches REST responses for guests by default and sends
		// its own cache header, so the headers above alone do not stop it.
		\do_action( 'litespeed_control_set_nocache', 'Progress Planner token-authenticated endpoint' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- LiteSpeed Cache's public API.

		return $response;
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
	 * Authenticate a request using the site token header, never a URL parameter.
	 *
	 * A dedicated header, not `Authorization: Bearer`: bearer-auth plugins (JWT
	 * and OAuth) try to decode every bearer token and reject the request before
	 * this check runs, and some Apache setups strip `Authorization` entirely.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @return bool
	 */
	public function permissions_check( $request ) {
		$token = $request->get_header( self::TOKEN_HEADER );
		return \is_string( $token ) && $this->validate_token( \trim( $token ) );
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
