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
			if ( ! empty( $_SERVER[ $key ] ) ) {
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
}
