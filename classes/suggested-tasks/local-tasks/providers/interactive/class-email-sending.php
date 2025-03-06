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
	 * @return void
	 */
	public function the_popover_content() {
		?>
		<prpl-email-test-popup
			popover-id="<?php echo \esc_attr( 'prpl-popover-' . $this->popover_id ); ?>"
			provider-id="<?php echo \esc_attr( $this->get_provider_id() ); ?>"
		>
			<div>
				<h2><?php \esc_html_e( 'Test email sending', 'progress-planner' ); ?></h2>
				<p><?php \esc_html_e( 'Are you ready to test that email from your site works?', 'progress-planner' ); ?></p>
				<div id="prpl-sending-email-actions">
					<button class="prpl-button" data-action="showResults"><?php \esc_html_e( 'Yes', 'progress-planner' ); ?></button>
					<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'No', 'progress-planner' ); ?></button>
				</div>
				<div id="prpl-sending-email-result" style="display: none;">
					<p><?php \esc_html_e( 'Was it successful?', 'progress-planner' ); ?></p>
					<p>
						<button class="prpl-button" data-action="completeTask"><?php \esc_html_e( 'Yes', 'progress-planner' ); ?></button>
						<button class="prpl-button" data-action="showTroubleshooting"><?php \esc_html_e( 'No', 'progress-planner' ); ?></button>
					</p>
				</div>
				<div id="prpl-sending-email-troubleshooting" style="display: none;">
					<h2><?php \esc_html_e( 'Email Troubleshooting', 'progress-planner' ); ?></h2>
					<p><?php \esc_html_e( 'Here are some steps to fix email sending issues:', 'progress-planner' ); ?></p>
					<ul>
						<li><?php \esc_html_e( 'Check your SMTP settings are correct', 'progress-planner' ); ?></li>
						<li><?php \esc_html_e( 'Ensure your domain\'s SPF records are properly configured', 'progress-planner' ); ?></li>
						<li><?php \esc_html_e( 'Verify your email provider credentials', 'progress-planner' ); ?></li>
						<li><?php \esc_html_e( 'Try sending from a different email address', 'progress-planner' ); ?></li>
					</ul>
					<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></button>
				</div>

				<button class="prpl-popover-close" data-action="closePopover">
					<span class="dashicons dashicons-no-alt"></span>
					<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
				</button>
			</div>
		</prpl-email-test-popup>
		<?php
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
			'category'    => $this->get_provider_category(),
			'points'      => 1,
			'dismissable' => true,
			'popover_id'  => 'prpl-popover-' . $this->popover_id,
			'description' => '<p>' . \esc_html__( 'Check if email sending is working.', 'progress-planner' ) . '</p>',
		];
	}
}
