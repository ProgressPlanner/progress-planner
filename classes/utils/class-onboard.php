<?php
/**
 * Onboarding class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Onboarding class.
 */
class Onboard {

	/**
	 * The remote API endpoints namespace URL.
	 *
	 * @var string
	 */
	const REMOTE_API_URL = '/wp-json/progress-planner-saas/v1/';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Handle saving data from the onboarding form response.
		\add_action( 'wp_ajax_progress_planner_save_onboard_data', [ $this, 'save_onboard_response' ] );

		// Detect domain changes.
		\add_action( 'shutdown', [ $this, 'detect_site_url_changes' ] );

		if ( \get_option( 'progress_planner_license_key' ) ) {
			return;
		}

		// Redirect on plugin activation.
		\add_action( 'activated_plugin', [ $this, 'on_activate_plugin' ], 10 );
	}

	/**
	 * On plugin activation.
	 *
	 * @param string $plugin The plugin file.
	 *
	 * @return void
	 */
	public function on_activate_plugin( $plugin ) {
		if ( 'progress-planner/progress-planner.php' !== $plugin ) {
			return;
		}

		if ( ! \defined( 'WP_CLI' ) || ! \WP_CLI ) {
			\wp_safe_redirect( \admin_url( 'admin.php?page=progress-planner' ) );
			exit;
		}
	}

	/**
	 * Save the onboarding response.
	 *
	 * @return void
	 */
	public function save_onboard_response() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['key'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing data.', 'progress-planner' ) ] );
		}

		$license_key = \sanitize_text_field( \wp_unslash( $_POST['key'] ) );

		// False also if option value has not changed.
		if ( \update_option( 'progress_planner_license_key', $license_key, false ) ) {
			\wp_send_json_success(
				[
					'message' => \esc_html__( 'Onboarding data saved.', 'progress-planner' ),
				]
			);
		}
		\wp_send_json_error( [ 'message' => \esc_html__( 'Unable to save data.', 'progress-planner' ) ] );
	}

	/**
	 * Get the onboarding remote URL.
	 *
	 * @param string $endpoint The endpoint to append to the remote URL.
	 *
	 * @return string
	 */
	public function get_remote_url( $endpoint = '' ) {
		return \progress_planner()->get_remote_server_root_url() . self::REMOTE_API_URL . $endpoint;
	}

	/**
	 * Get the remote nonce.
	 *
	 * @return string
	 */
	public function get_remote_nonce() {
		// Make a POST request to the remote nonce endpoint.
		$response = \wp_remote_post(
			$this->get_remote_url( 'get-nonce' ),
			[ 'body' => [ 'site' => \set_url_scheme( \site_url() ) ] ]
		);

		if ( \is_wp_error( $response ) ) {
			return '';
		}

		$body = \json_decode( \wp_remote_retrieve_body( $response ), true );

		return isset( $body['nonce'] ) ? $body['nonce'] : '';
	}

	/**
	 * Make a request to the remote onboarding endpoint.
	 *
	 * @param array $data The data to send with the request.
	 *
	 * @return string The license key.
	 */
	public function make_remote_onboarding_request( $data = [] ) {
		// Set the data.
		if ( ! isset( $data['nonce'] ) ) {
			$data['nonce'] = $this->get_remote_nonce();
		}
		$data = \wp_parse_args(
			$data,
			[
				'site'            => \set_url_scheme( \site_url() ),
				'email'           => \wp_get_current_user()->user_email,
				'name'            => \get_user_meta( \wp_get_current_user()->ID, 'first_name', true ),
				'with-email'      => 'yes',
				'timezone_offset' => (float) ( \wp_timezone()->getOffset( new \DateTime( 'midnight' ) ) / 3600 ),
			]
		);

		// Make the request.
		$response = \wp_remote_post(
			$this->get_remote_url( 'onboard' ),
			[ 'body' => $data ]
		);

		// Bail early if there is an error.
		if ( \is_wp_error( $response ) ) {
			return '';
		}

		$body = \json_decode( \wp_remote_retrieve_body( $response ), true );

		return ! isset( $body['status'] )
			|| 'ok' !== $body['status']
			|| ! isset( $body['license_key'] )
				? ''
				: $body['license_key'];
	}

	/**
	 * Detect domain changes.
	 *
	 * @return void
	 */
	public function detect_site_url_changes() {
		$saved_site_url   = \get_option( 'progress_planner_saved_site_url', false );
		$current_site_url = \set_url_scheme( \site_url() );

		// Update the saved site URL if it's not set, then bail early.
		if ( ! $saved_site_url ) {
			\update_option( 'progress_planner_saved_site_url', $current_site_url, false );
			return;
		}

		$saved_license_key = \get_option( 'progress_planner_license_key', false );

		// Bail early if the license key is not set, or if the site URL has not changed.
		if ( ! $saved_license_key || $saved_site_url === $current_site_url ) {
			return;
		}

		// Make a request to the remote endpoint to update the license key.
		$response = \wp_remote_post(
			$this->get_remote_url( 'change-site-url' ),
			[
				'body' => [
					'license_key' => $saved_license_key,
					'old_url'     => $saved_site_url,
					'new_url'     => $current_site_url,
					'nonce'       => $this->get_remote_nonce(),
				],
			]
		);

		// Bail early if there is an error.
		if ( \is_wp_error( $response ) ) {
			return;
		}

		$body = \json_decode( \wp_remote_retrieve_body( $response ), true );

		// Update the saved site URL if the request was successful.
		if ( isset( $body['status'] ) && 'ok' === $body['status'] ) {
			\update_option( 'progress_planner_saved_site_url', $current_site_url, false );
		}
	}
}
