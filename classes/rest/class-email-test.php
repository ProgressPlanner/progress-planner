<?php
/**
 * Email Test REST API controller.
 *
 * Handles email testing for the email sending popover.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Email Test REST API controller.
 */
class Email_Test extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/popover/test-email',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'test_email' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'email_address' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_email',
							'validate_callback' => function ( $param ) {
								return \is_email( $param );
							},
						],
						'task_id'       => [
							'required' => false,
							'type'     => 'string',
							'default'  => '',
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
	 * Test email sending.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function test_email( $request ) {
		$email_address = $request->get_param( 'email_address' );
		$task_id       = $request->get_param( 'task_id' );

		if ( ! \is_email( $email_address ) ) {
			return new \WP_Error(
				'invalid_email',
				\esc_html__( 'Invalid email address.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// Get task ID from request or use default.
		$task_id = ! empty( $task_id ) ? $task_id : 'sending-email';

		// Generate a secure token for the completion link to prevent CSRF.
		$user_id = \get_current_user_id();
		$token   = \progress_planner()->get_suggested_tasks()->generate_task_completion_token( $task_id, $user_id );

		$email_subject = \esc_html__( 'Your Progress Planner test message!', 'progress-planner' );
		$email_content = \sprintf(
			// translators: %1$s the admin URL, %2$s the assistant name.
			\__( 'You just used Progress Planner to verify if sending email works on your website. <br><br> The good news; it does! <a href="%1$s" target="_self">Click here to mark %2$s\'s Recommendation as completed</a>.', 'progress-planner' ),
			\admin_url( 'admin.php?page=progress-planner&prpl_complete_task=' . $task_id . '&token=' . $token ),
			\esc_html( \progress_planner()->get_ui__branding()->get_ravi_name() )
		);

		$headers = [ 'Content-Type: text/html; charset=UTF-8' ];

		// Track email errors.
		$email_error = null;
		\add_action(
			'wp_mail_failed',
			function ( $error ) use ( &$email_error ) {
				$email_error = $error->get_error_message() ? $error->get_error_message() : \esc_html__( 'Unknown error', 'progress-planner' );
			}
		);

		$result = \wp_mail( $email_address, $email_subject, $email_content, $headers );

		if ( $result ) {
			return new \WP_REST_Response(
				[
					'success' => true,
					'message' => \esc_html__( 'Email sent successfully.', 'progress-planner' ),
				],
				200
			);
		}

		// If email failed, return the error.
		$error_message = $email_error ? $email_error : \esc_html__( 'Unknown error', 'progress-planner' );
		return new \WP_Error(
			'email_failed',
			$error_message,
			[ 'status' => 500 ]
		);
	}
}
