<?php
/**
 * Add task for Email sending.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Interactive;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Interactive;

/**
 * Add task for Email sending.
 */
class Email_Sending extends Interactive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'sending-email';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	protected $popover_id = 'sending-email';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		parent::__construct();

		// Enqueue the scripts.
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

		// Add the AJAX action.
		add_action( 'wp_ajax_test_email_sending', [ $this, 'ajax_test_email_sending' ] );
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {

		// Don't enqueue the script if the task is already completed.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_task_id() ) ) {
			return;
		}

		$handle = 'progress-planner-web-components-prpl-task-' . $this->get_provider_id();

		// Enqueue the web component.
		wp_enqueue_script( $handle );

		// Localize the script.
		wp_localize_script(
			$handle,
			'prplEmailSending',
			[
				'ajax_url' => \admin_url( 'admin-ajax.php' ),
				'l10n'     => [
					'popoverHeading'                    => \esc_html__( 'Test email sending', 'progress-planner' ),
					'popoverDescription'                => \esc_html__( 'Are you ready to test that email from your site works?', 'progress-planner' ),
					'popoverButtonYes'                  => \esc_html__( 'Yes', 'progress-planner' ),
					'popoverButtonNo'                   => \esc_html__( 'No', 'progress-planner' ),
					'popoverButtonClose'                => \esc_html__( 'Close', 'progress-planner' ),
					'popoverHeadingTroubleshooting'     => \esc_html__( 'Email Troubleshooting', 'progress-planner' ),
					'popoverDescriptionTroubleshooting' => \esc_html__( 'Here are some steps to fix email sending issues:', 'progress-planner' ),
					'popoverTroubleshootingStep1'       => \esc_html__( 'Check your SMTP settings are correct', 'progress-planner' ),
					'popoverTroubleshootingStep2'       => \esc_html__( 'Ensure your domain\'s SPF records are properly configured', 'progress-planner' ),
					'popoverTroubleshootingStep3'       => \esc_html__( 'Verify your email provider credentials', 'progress-planner' ),
					'popoverTroubleshootingStep4'       => \esc_html__( 'Try sending from a different email address', 'progress-planner' ),
				],
			]
		);
	}

	/**
	 * Test email sending.
	 *
	 * @return void
	 */
	public function ajax_test_email_sending() {

		$result = wp_mail( \wp_get_current_user()->user_email, 'Test Email', 'This is a test email.' );

		if ( $result ) {
			wp_send_json_success( \esc_html__( 'Email sent successfully.', 'progress-planner' ) );
		} else {
			wp_send_json_error( \esc_html__( 'Email not sent.', 'progress-planner' ) );
		}
	}

	/**
	 * The popover content.
	 *
	 * @return string
	 */
	public function get_popover_content() {
		return '<prpl-email-test-popup
			popover-id="prpl-popover-' . $this->popover_id . '"
			provider-id="' . $this->get_provider_id() . '"
		></prpl-email-test-popup>';
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		if ( ! $task_id ) {
			$task_id = $this->get_provider_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Check if email sending is working', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'dismissable' => true,
			'popover_id'  => 'prpl-popover-' . $this->popover_id,
			'description' => '<p>' . \esc_html__( 'Check if email sending is working.', 'progress-planner' ) . '</p>',
		];
	}
}
