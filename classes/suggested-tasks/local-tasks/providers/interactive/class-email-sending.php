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

		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

		add_action( 'wp_ajax_test_email_sending', [ $this, 'ajax_test_email_sending' ] );
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			'prpl-task-sending-email',
			PROGRESS_PLANNER_URL . '/assets/js/tasks/sending-email.js',
			[],
			'1.0.0',
			true
		);

		// Localize the script.
		wp_localize_script(
			'prpl-task-sending-email',
			'prplEmailSending',
			[
				'ajax_url' => \admin_url( 'admin-ajax.php' ),
				'l10n'     => [
					'popoverHeading'     => \esc_html__( 'Test email sending', 'progress-planner' ),
					'popoverDescription' => \esc_html__( 'Are you ready to test that email from your site works?', 'progress-planner' ),
					'popoverButtonYes'   => \esc_html__( 'Yes', 'progress-planner' ),
					'popoverButtonNo'    => \esc_html__( 'No', 'progress-planner' ),
					'popoverButtonClose' => \esc_html__( 'Close', 'progress-planner' ),
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
