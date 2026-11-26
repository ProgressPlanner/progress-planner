<?php
/**
 * LiteSpeed Cache-specific AJAX security checks.
 *
 * Extends the base Ajax_Security_Base trait with LiteSpeed Cache-specific
 * validation methods.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Traits;

/**
 * Ajax_Security_Litespeed_Cache trait.
 *
 * This trait provides LiteSpeed Cache-specific security checks for AJAX handlers.
 * It uses the base trait for common functionality.
 */
trait Ajax_Security_Litespeed_Cache {

	use Ajax_Security_Base;

	/**
	 * Verify LiteSpeed Cache plugin is active or send JSON error and exit.
	 *
	 * Checks if the LSCWP_V constant is defined and terminates execution
	 * with a JSON error response if not active.
	 *
	 * @return void Exits with wp_send_json_error() if LiteSpeed Cache is not active.
	 */
	protected function verify_litespeed_cache_active_or_fail() {
		if ( ! \defined( 'LSCWP_V' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'LiteSpeed Cache is not active.', 'progress-planner' ) ] );
		}
	}

	/**
	 * Perform complete LiteSpeed Cache AJAX security checks.
	 *
	 * Runs LiteSpeed Cache active check, capability check, and nonce verification.
	 * This is a convenience method for LiteSpeed Cache interactive tasks.
	 *
	 * @param string $capability The capability to require (default: 'manage_options').
	 * @param string $action     The nonce action to verify (default: 'progress_planner').
	 * @param string $field      The POST field containing the nonce (default: 'nonce').
	 *
	 * @return void Exits with wp_send_json_error() if any check fails.
	 */
	protected function verify_litespeed_cache_ajax_security( $capability = 'manage_options', $action = 'progress_planner', $field = 'nonce' ) {
		$this->verify_litespeed_cache_active_or_fail();
		$this->verify_ajax_security( $capability, $action, $field );
	}
}
