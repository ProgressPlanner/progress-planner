<?php
/**
 * Email Sending Config REST API controller.
 *
 * Returns configuration data for the email sending popover.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Email Sending Config REST API controller.
 */
class Email_Sending_Config extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/popover/email-sending-config',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_config' ],
					'permission_callback' => [ $this, 'check_permissions' ],
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
	 * Get email sending configuration.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_config( $request ) {
		// Get current user for default email.
		$current_user  = \wp_get_current_user();
		$default_email = $current_user->user_email ?? '';

		// Get troubleshooting guide URL.
		$troubleshooting_guide_url = \esc_url(
			\progress_planner()->get_ui__branding()->get_url( 'https://prpl.fyi/troubleshoot-smtp' )
		);

		// Check if there's an email override (SMTP plugin).
		$has_email_override = $this->is_there_sending_email_override();

		// Get email subject.
		$email_subject = \esc_html__( 'Your Progress Planner test message!', 'progress-planner' );

		return new \WP_REST_Response(
			[
				'email_subject'             => $email_subject,
				'troubleshooting_guide_url' => $troubleshooting_guide_url,
				'has_email_override'        => $has_email_override,
				'default_email'             => $default_email,
			],
			200
		);
	}

	/**
	 * Check if there's an email sending override (SMTP plugin).
	 *
	 * @return bool
	 */
	private function is_there_sending_email_override() {
		return $this->is_wp_mail_filtered() || $this->is_wp_mail_overridden();
	}

	/**
	 * Check if wp_mail is filtered (phpmailer_init or pre_wp_mail hooks have callbacks).
	 *
	 * @return bool
	 */
	private function is_wp_mail_filtered() {
		global $wp_filter;

		foreach ( [ 'phpmailer_init', 'pre_wp_mail' ] as $filter ) {
			if ( isset( $wp_filter[ $filter ] ) && $wp_filter[ $filter ] instanceof \WP_Hook && ! empty( $wp_filter[ $filter ]->callbacks ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if wp_mail function has been overridden by a plugin.
	 *
	 * @return bool
	 */
	private function is_wp_mail_overridden() {
		// Just in case, since it will trigger PHP fatal error if the function doesn't exist.
		if ( ! \function_exists( 'wp_mail' ) ) {
			return false;
		}

		$file_path = ( new \ReflectionFunction( 'wp_mail' ) )->getFileName();

		return $file_path && $file_path !== ABSPATH . 'wp-includes/pluggable.php';
	}
}
