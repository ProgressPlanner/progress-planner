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
	 * Get client IP address.
	 *
	 * @return string
	 */
	protected function get_client_ip() {
		$ip_keys = [
			'HTTP_CF_CONNECTING_IP', // Cloudflare.
			'HTTP_X_REAL_IP',        // Nginx proxy.
			'HTTP_X_FORWARDED_FOR',  // Standard proxy header.
			'REMOTE_ADDR',           // Direct connection.
		];

		foreach ( $ip_keys as $key ) {
			if ( isset( $_SERVER[ $key ] ) && ! empty( $_SERVER[ $key ] ) ) {
				$ip = \sanitize_text_field( \wp_unslash( $_SERVER[ $key ] ) );
				// Handle X-Forwarded-For which may contain multiple IPs.
				if ( \strpos( $ip, ',' ) !== false ) {
					$ip = \trim( \explode( ',', $ip )[0] );
				}
				// Validate IP address.
				if ( \filter_var( $ip, FILTER_VALIDATE_IP ) ) {
					return $ip;
				}
			}
		}

		return '0.0.0.0';
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
}
