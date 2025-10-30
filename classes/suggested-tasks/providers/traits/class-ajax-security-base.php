<?php
/**
 * Base trait for AJAX security checks.
 *
 * Provides common helper methods for verifying nonces and user capabilities
 * in AJAX handlers. Plugin-specific checks should be in separate traits.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Traits;

/**
 * Ajax_Security_Base trait.
 *
 * This trait provides common security checks that are applicable
 * to all AJAX handlers regardless of which plugin integration is being used.
 */
trait Ajax_Security_Base {

	/**
	 * Verify nonce or send JSON error and exit.
	 *
	 * Checks the AJAX nonce and terminates execution with a JSON error
	 * response if validation fails.
	 *
	 * @param string $action The nonce action to verify (default: 'progress_planner').
	 * @param string $field  The POST field containing the nonce (default: 'nonce').
	 *
	 * @return void Exits with wp_send_json_error() if nonce is invalid.
	 */
	protected function verify_nonce_or_fail( $action = 'progress_planner', $field = 'nonce' ) {
		if ( ! \check_ajax_referer( $action, $field, false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}
	}

	/**
	 * Verify user capabilities or send JSON error and exit.
	 *
	 * Checks if the current user has the specified capability and terminates
	 * execution with a JSON error response if they don't.
	 *
	 * @param string $capability The capability to check (default: 'manage_options').
	 *
	 * @return void Exits with wp_send_json_error() if user lacks capability.
	 */
	protected function verify_capability_or_fail( $capability = 'manage_options' ) {
		if ( ! \current_user_can( $capability ) ) {
			\wp_send_json_error(
				[ 'message' => \esc_html__( 'You do not have permission to perform this action.', 'progress-planner' ) ]
			);
		}
	}

	/**
	 * Perform all standard AJAX security checks.
	 *
	 * Runs nonce verification and capability check in one call.
	 * Useful for most AJAX handlers that require both checks.
	 *
	 * @param string $capability The capability to require (default: 'manage_options').
	 * @param string $action     The nonce action to verify (default: 'progress_planner').
	 * @param string $field      The POST field containing the nonce (default: 'nonce').
	 *
	 * @return void Exits with wp_send_json_error() if any check fails.
	 */
	protected function verify_ajax_security( $capability = 'manage_options', $action = 'progress_planner', $field = 'nonce' ) {
		$this->verify_capability_or_fail( $capability );
		$this->verify_nonce_or_fail( $action, $field );
	}
}
