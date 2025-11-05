<?php
/**
 * Yoast SEO-specific AJAX security checks.
 *
 * Extends the base Ajax_Security_Base trait with Yoast SEO-specific
 * validation methods.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Traits;

/**
 * Ajax_Security_Yoast trait.
 *
 * This trait provides Yoast SEO-specific security checks for AJAX handlers.
 * It uses the base trait for common functionality.
 *
 * @phpstan-ignore-next-line trait.unused
 */
trait Ajax_Security_Yoast {

	use Ajax_Security_Base;

	/**
	 * Verify Yoast SEO plugin is active or send JSON error and exit.
	 *
	 * Checks if the Yoast SEO plugin class exists and terminates execution
	 * with a JSON error response if not active.
	 *
	 * @return void Exits with wp_send_json_error() if Yoast SEO is not active.
	 */
	protected function verify_yoast_active_or_fail() {
		if ( ! \class_exists( 'WPSEO_Options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Yoast SEO is not active.', 'progress-planner' ) ] );
		}
	}

	/**
	 * Perform complete Yoast SEO AJAX security checks.
	 *
	 * Runs Yoast active check, capability check, and nonce verification.
	 * This is a convenience method for Yoast interactive tasks.
	 *
	 * @param string $capability The capability to require (default: 'manage_options').
	 * @param string $action     The nonce action to verify (default: 'progress_planner').
	 * @param string $field      The POST field containing the nonce (default: 'nonce').
	 *
	 * @return void Exits with wp_send_json_error() if any check fails.
	 */
	protected function verify_yoast_ajax_security( $capability = 'manage_options', $action = 'progress_planner', $field = 'nonce' ) {
		$this->verify_yoast_active_or_fail();
		$this->verify_ajax_security( $capability, $action, $field );
	}
}
