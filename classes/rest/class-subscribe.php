<?php
/**
 * Subscribe REST API controller.
 *
 * Handles subscription form submissions.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Subscribe REST API controller.
 */
class Subscribe extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/popover/subscribe',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'subscribe' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'name'            => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
							'validate_callback' => function ( $param ) {
								return ! empty( $param );
							},
						],
						'email'           => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_email',
							'validate_callback' => function ( $param ) {
								return \is_email( $param );
							},
						],
						'site'            => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'esc_url_raw',
							'validate_callback' => function ( $param ) {
								return ! empty( $param );
							},
						],
						'timezone_offset' => [
							'required' => false,
							'type'     => 'number',
							'default'  => 0,
						],
						'with_email'      => [
							'required' => false,
							'type'     => 'string',
							'default'  => 'yes',
						],
					],
				],
			]
		);
	}

	/**
	 * Check if the current user has permission to access this endpoint.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Handle subscription.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function subscribe( $request ) {
		$name            = $request->get_param( 'name' );
		$email           = $request->get_param( 'email' );
		$site            = $request->get_param( 'site' );
		$timezone_offset = $request->get_param( 'timezone_offset' );
		$with_email      = $request->get_param( 'with_email' );

		// Build data object for onboarding API.
		$data = [
			'name'            => $name,
			'email'           => $email,
			'site'            => $site,
			'timezone_offset' => $timezone_offset,
			'with-email'      => $with_email,
		];

		// Get nonce from external API.
		$onboard_utils = \progress_planner()->get_utils__onboard();
		$nonce         = $onboard_utils->get_remote_nonce();

		if ( empty( $nonce ) ) {
			return new \WP_Error(
				'nonce_failed',
				\esc_html__( 'Failed to get nonce from remote server.', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		// Add nonce to data.
		$data['nonce'] = $nonce;

		// Make request to external API using the Onboard utility.
		$license_key = $onboard_utils->make_remote_onboarding_request( $data );

		if ( empty( $license_key ) ) {
			return new \WP_Error(
				'api_request_failed',
				\esc_html__( 'Failed to submit subscription.', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		// Save the license key to the database.
		\update_option( 'progress_planner_license_key', $license_key, false );

		return new \WP_REST_Response(
			[
				'success'     => true,
				'message'     => \esc_html__( 'Subscription successful.', 'progress-planner' ),
				'license_key' => $license_key,
			],
			200
		);
	}
}
