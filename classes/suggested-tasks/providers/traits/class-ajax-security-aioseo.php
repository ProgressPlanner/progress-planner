<?php
/**
 * AIOSEO-specific AJAX security checks.
 *
 * Extends the base Ajax_Security_Base trait with AIOSEO-specific
 * validation methods.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Traits;

/**
 * Ajax_Security_AIOSEO trait.
 *
 * This trait provides AIOSEO-specific security checks for AJAX handlers.
 * It uses the base trait for common functionality.
 */
trait Ajax_Security_AIOSEO {

	use Ajax_Security_Base;

	/**
	 * Verify AIOSEO plugin is active or send JSON error and exit.
	 *
	 * Checks if the AIOSEO plugin function exists and terminates execution
	 * with a JSON error response if not active.
	 *
	 * @return void Exits with wp_send_json_error() if AIOSEO is not active.
	 */
	protected function verify_aioseo_active_or_fail() {
		if ( ! \function_exists( 'aioseo' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'AIOSEO is not active.', 'progress-planner' ) ] );
		}
	}

	/**
	 * Perform complete AIOSEO AJAX security checks.
	 *
	 * Runs AIOSEO active check, capability check, and nonce verification.
	 * This is a convenience method for AIOSEO interactive tasks.
	 *
	 * @param string $capability The capability to require (default: 'manage_options').
	 * @param string $action     The nonce action to verify (default: 'progress_planner').
	 * @param string $field      The POST field containing the nonce (default: 'nonce').
	 *
	 * @return void Exits with wp_send_json_error() if any check fails.
	 */
	protected function verify_aioseo_ajax_security( $capability = 'manage_options', $action = 'progress_planner', $field = 'nonce' ) {
		$this->verify_aioseo_active_or_fail();
		$this->verify_ajax_security( $capability, $action, $field );
	}
}
