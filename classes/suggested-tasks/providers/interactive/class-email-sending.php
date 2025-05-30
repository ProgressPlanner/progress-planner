<?php
/**
 * Add task for Email sending.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Interactive;

use Progress_Planner\Suggested_Tasks\Providers\Interactive;

/**
 * Add task for Email sending.
 */
class Email_Sending extends Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const PROVIDER_ID = 'sending-email';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const CATEGORY = 'configuration';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	protected $popover_id = 'sending-email';

	/**
	 * The email title.
	 *
	 * @var string
	 */
	protected $email_title = '';

	/**
	 * The email content.
	 *
	 * @var string
	 */
	protected $email_content = '';

	/**
	 * The error.
	 *
	 * @var string
	 */
	protected $email_error = '';

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {

		// Enqueue the scripts.
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );

		// Add the AJAX action.
		add_action( 'wp_ajax_prpl_test_email_sending', [ $this, 'ajax_test_email_sending' ] );

		// Set the email error message.
		add_action( 'wp_mail_failed', [ $this, 'set_email_error' ] );

		$this->email_title = \esc_html__( 'Test email from Progress Planner', 'progress-planner' );
		// translators: %s is the admin URL.
		$this->email_content = sprintf( \esc_html__( 'This is a test email. Complete the task by clicking the link: %s', 'progress-planner' ), \admin_url( 'admin.php?page=progress-planner&prpl_complete_task=' . $this->get_task_id() ) );
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

		$handle = 'progress-planner/web-components/prpl-task-' . $this->get_provider_id();

		// Enqueue the web component.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			$handle,
			[
				'name' => 'prplEmailSending',
				'data' => [
					'ajax_url'      => \admin_url( 'admin-ajax.php' ),
					'unknown_error' => \esc_html__( 'Unknown error', 'progress-planner' ),
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

		$result = wp_mail( \wp_get_current_user()->user_email, $this->email_title, $this->email_content );

		if ( $result ) {
			wp_send_json_success( \esc_html__( 'Email sent successfully.', 'progress-planner' ) );
		} else {
			wp_send_json_error( $this->email_error );
		}
	}

	/**
	 * Set the email error.
	 *
	 * @param \WP_Error $e The error message.
	 *
	 * @return void
	 */
	public function set_email_error( $e ) {
		$this->email_error = $e->get_error_message() ? $e->get_error_message() : \esc_html__( 'Unknown error', 'progress-planner' );
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
			<div class="prpl-columns-wrapper-flex">
				<div class="prpl-column prpl-column-content">
					<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Test email sending', 'progress-planner' ); ?></h2>
					<p class="prpl-interactive-task-description"><?php \esc_html_e( 'Are you ready to test that email from your site works?', 'progress-planner' ); ?></p>
				</div>
				<div class="prpl-column">
					<div id="prpl-sending-email-form">
					<p><?php \esc_html_e( 'What is your contact e-mail address?', 'progress-planner' ); ?></p>
					<div class="prpl-note">
						<span class="prpl-note-icon">
							<?php \progress_planner()->the_asset( 'images/icon_exclamation_triangle_solid.svg' ); ?>
						</span>
						<span class="prpl-note-text">
							<?php \esc_html_e( 'It could take a couple of hours before you receive the email.', 'progress-planner' ); ?>
						</span>
					</div>
					<input type="email" id="prpl-sending-email-address" placeholder="<?php \esc_html_e( 'Enter your e-mail address', 'progress-planner' ); ?>" value="<?php echo \esc_attr( \wp_get_current_user()->user_email ); ?>" />

					<div class="prpl-steps-nav-wrapper">
							<button class="prpl-button" data-action="showResults">
							<?php
								/* translators: %s is an arrow icon. */
								printf( \esc_html__( 'Next step %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
							?>
							</button>
					</div>
					</div>
					<div id="prpl-sending-email-result" style="display: none;">
						<p><?php \esc_html_e( 'Was it successful?', 'progress-planner' ); ?></p>
						<div class="radios">
							<div class="prpl-radio-wrapper">
								<label for="prpl-sending-email-result-yes" class="prpl-custom-radio">
									<input
									type="radio"
									id="prpl-sending-email-result-yes"
									name="prpl-sending-email-result"
									data-action="completeTask"
									>
									<span class="prpl-custom-control"></span>
									<?php \esc_html_e( 'Yes', 'progress-planner' ); ?>
								</label>
							</div>
							<div class="prpl-radio-wrapper">
								<label for="prpl-sending-email-result-no" class="prpl-custom-radio">
								<input
								type="radio"
								id="prpl-sending-email-result-no"
								name="prpl-sending-email-result"
								data-action="showTroubleshooting"
								>
								<span class="prpl-custom-control"></span>
								<?php \esc_html_e( 'No', 'progress-planner' ); ?>
							</label>
							</div>
						</div>

						<div class="radios">
							<div class="prpl-radio-wrapper">
								<label for="prpl-sending-email-result-yes-checkbox" class="prpl-custom-checkbox">
									<input
									type="checkbox"
									id="prpl-sending-email-result-yes-checkbox"
									name="prpl-sending-email-result-checkbox"
									data-action="completeTask"
									>
									<span class="prpl-custom-control"></span>
									<?php \esc_html_e( 'Yes', 'progress-planner' ); ?>
								</label>
							</div>
							<div class="prpl-radio-wrapper">
								<label for="prpl-sending-email-result-no-checkbox" class="prpl-custom-checkbox">
								<input
								type="checkbox"
								id="prpl-sending-email-result-no-checkbox"
								name="prpl-sending-email-result-checkbox"
								data-action="showTroubleshooting"
								>
								<span class="prpl-custom-control"></span>
								<?php \esc_html_e( 'No', 'progress-planner' ); ?>
							</label>
							</div>
						</div>

						<div>
							<textarea id="prpl-sending-email-result-textarea" placeholder="<?php \esc_html_e( 'Enter your message', 'progress-planner' ); ?>" rows="4"></textarea>
						</div>

						<div class="prpl-steps-nav-wrapper">
							<button class="prpl-button" data-action="">
							<?php
								/* translators: %s is an arrow icon. */
								printf( \esc_html__( 'Next step %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
							?>
							</button>
					</div>
					</div>

					<div id="prpl-sending-email-error-occurred" style="display: none;">
						<p id="prpl-sending-email-error-occurred-message" data-email-error-message="
						<?php
							/* translators: %s is the email title. */
							printf( \esc_attr__( 'We\'ve just tried to send an email titled "%s" to "[EMAIL_ADDRESS]". Unfortunately this failed with the following error message: [ERROR_MESSAGE]', 'progress-planner' ), \esc_attr( $this->email_title ) );
						?>
						"</p>

						<div class="prpl-steps-nav-wrapper">
							<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></button>
						</div>
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

						<div class="prpl-steps-nav-wrapper">
							<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></button>
						</div>
					</div>
				</div>
			</div>

			<button class="prpl-popover-close" data-action="closePopover">
				<span class="dashicons dashicons-no-alt"></span>
				<span class="screen-reader-text"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></span>
			</button>
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
			'provider_id' => $this->get_provider_id(),
			'points'      => 1,
			'dismissable' => true,
			'popover_id'  => 'prpl-popover-' . $this->popover_id,
			'description' => '<p>' . \esc_html__( 'Check if email sending is working.', 'progress-planner' ) . '</p>',
		];
	}
}
