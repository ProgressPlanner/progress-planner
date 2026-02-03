<?php
/**
 * Trait for input sanitization.
 *
 * Provides helper methods for safely retrieving and sanitizing
 * user input from $_POST and $_GET superglobals.
 *
 * This is a general-purpose utility trait that can be used by any class
 * that needs to handle user input safely.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils\Traits;

/**
 * Input_Sanitizer trait.
 *
 * This trait eliminates code duplication across 30+ classes
 * by centralizing the common pattern of sanitizing POST/GET data.
 *
 * Can be used in providers, widgets, admin classes, or any class
 * that needs to safely handle user input.
 *
 * @phpstan-ignore-next-line trait.unused
 */
trait Input_Sanitizer {

	/**
	 * Get and sanitize a value from $_POST.
	 *
	 * @param string $key           The POST key to retrieve.
	 * @param mixed  $default_value The default value if key doesn't exist (default: '').
	 *
	 * @return string The sanitized POST value or default.
	 */
	protected function get_sanitized_post( $key, $default_value = '' ) {
		if ( ! isset( $_POST[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return $default_value;
		}

		return \sanitize_text_field( \wp_unslash( $_POST[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
	}

	/**
	 * Get and sanitize a value from $_GET.
	 *
	 * @param string $key           The GET key to retrieve.
	 * @param mixed  $default_value The default value if key doesn't exist (default: '').
	 *
	 * @return string The sanitized GET value or default.
	 */
	protected function get_sanitized_get( $key, $default_value = '' ) {
		if ( ! isset( $_GET[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $default_value;
		}

		return \sanitize_text_field( \wp_unslash( $_GET[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}

	/**
	 * Get and sanitize a value from $_REQUEST.
	 *
	 * @param string $key           The REQUEST key to retrieve.
	 * @param mixed  $default_value The default value if key doesn't exist (default: '').
	 *
	 * @return string The sanitized REQUEST value or default.
	 */
	protected function get_sanitized_request( $key, $default_value = '' ) {
		if ( ! isset( $_REQUEST[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $default_value;
		}

		return \sanitize_text_field( \wp_unslash( $_REQUEST[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}

	/**
	 * Get and sanitize an integer value from $_POST.
	 *
	 * @param string $key           The POST key to retrieve.
	 * @param int    $default_value The default value if key doesn't exist (default: 0).
	 *
	 * @return int The sanitized integer value or default.
	 */
	protected function get_sanitized_post_int( $key, $default_value = 0 ) {
		if ( ! isset( $_POST[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return $default_value;
		}

		return (int) $_POST[ $key ]; // phpcs:ignore WordPress.Security.NonceVerification.Missing
	}

	/**
	 * Get and sanitize an integer value from $_GET.
	 *
	 * @param string $key           The GET key to retrieve.
	 * @param int    $default_value The default value if key doesn't exist (default: 0).
	 *
	 * @return int The sanitized integer value or default.
	 */
	protected function get_sanitized_get_int( $key, $default_value = 0 ) {
		if ( ! isset( $_GET[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $default_value;
		}

		return (int) $_GET[ $key ]; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}

	/**
	 * Get and sanitize an array value from $_POST.
	 *
	 * @param string $key           The POST key to retrieve.
	 * @param array  $default_value The default value if key doesn't exist (default: []).
	 *
	 * @return array The sanitized array value or default.
	 */
	protected function get_sanitized_post_array( $key, $default_value = [] ) {
		if ( ! isset( $_POST[ $key ] ) || ! \is_array( $_POST[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
			return $default_value;
		}

		return \array_map( 'sanitize_text_field', \wp_unslash( $_POST[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Missing
	}

	/**
	 * Get and sanitize an array value from $_GET.
	 *
	 * @param string $key           The GET key to retrieve.
	 * @param array  $default_value The default value if key doesn't exist (default: []).
	 *
	 * @return array The sanitized array value or default.
	 */
	protected function get_sanitized_get_array( $key, $default_value = [] ) {
		if ( ! isset( $_GET[ $key ] ) || ! \is_array( $_GET[ $key ] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return $default_value;
		}

		return \array_map( 'sanitize_text_field', \wp_unslash( $_GET[ $key ] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}
}
