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
	protected $email_subject = '';

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

		$this->email_subject = \esc_html__( 'Test email from Progress Planner', 'progress-planner' );
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
					'nonce'         => \wp_create_nonce( 'progress_planner' ),
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

		// Check the nonce.
		\check_admin_referer( 'progress_planner' );

		$email_address = isset( $_GET['email_address'] ) ? \sanitize_email( \wp_unslash( $_GET['email_address'] ) ) : '';

		if ( ! $email_address ) {
			wp_send_json_error( \esc_html__( 'Invalid email address.', 'progress-planner' ) );
		}

		$result = wp_mail( $email_address, $this->email_subject, $this->email_content );

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
			<?php /* First step */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-form-step">
				<div class="prpl-column prpl-column-content">
					<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Test if your site can send emails', 'progress-planner' ); ?></h2>
					<p class="prpl-interactive-task-description"><?php \esc_html_e( 'Your WordPress website sometimes needs to send transactional email. For example, to reset passwords, when a fatal error occurs, or comment notifications. And oftentimes contactforms also try to send email. It is therefore important to verify that those emails are actually sent. Start by filling out your email address to send a test.', 'progress-planner' ); ?></p>
				</div>
				<div class="prpl-column">
					<p><?php \esc_html_e( 'To what email address should we send the test email?', 'progress-planner' ); ?></p>
					<div class="prpl-note">
						<span class="prpl-note-icon">
							<?php \progress_planner()->the_asset( 'images/icon_exclamation_triangle_solid.svg' ); ?>
						</span>
						<span class="prpl-note-text">
							<?php \esc_html_e( 'Usually our test email should arrive within a few minutes. In rare cases, it can take up to several hours for our test to arrive in your inbox.', 'progress-planner' ); ?>
						</span>
					</div>
					<form id="prpl-sending-email-form" onsubmit="return false;">
						<input type="email" id="prpl-sending-email-address" placeholder="<?php \esc_html_e( 'Enter your e-mail address', 'progress-planner' ); ?>" value="<?php echo \esc_attr( \wp_get_current_user()->user_email ); ?>" />

						<div class="prpl-steps-nav-wrapper">
							<button class="prpl-button" data-action="showResults" type="submit">
							<?php
								/* translators: %s is an arrow icon. */
								printf( \esc_html__( 'Next step %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
							?>
							</button>
						</div>
					</form>
				</div>
			</div>

			<?php /* We detected an error during sending test email, showing error message */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-error-occurred-step" style="display: none;">
				<div class="prpl-column prpl-column-content">

				</div>

				<div class="prpl-column">
					<p id="prpl-sending-email-error-occurred-message" data-email-message="
					<?php
						/* translators: %s is the email subject. */
						printf( \esc_attr__( 'We\'ve just tried to send an email titled "%s" to "[EMAIL_ADDRESS]". Unfortunately this failed with the following error message: [ERROR_MESSAGE]', 'progress-planner' ), \esc_attr( $this->email_subject ) );
					?>
					"></p>

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="showForm"><?php \esc_html_e( 'Retry now', 'progress-planner' ); ?></button>
						<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></button>
					</div>
				</div>
			</div>

			<?php /* Email sent, asking user if they received it */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-result-step" style="display: none;">
				<div class="prpl-column prpl-column-content">
					<p id="prpl-sending-email-sent-message" data-email-message="
					<?php
						/* translators: %s is the email subject. */
						printf( \esc_attr__( 'We\'ve just tried to send an email titled "%s" to "[EMAIL_ADDRESS]". Usually our test email should arrive within a few minutes. In rare cases, it can take up to several hours for our test to arrive in your inbox.', 'progress-planner' ), \esc_attr( $this->email_subject ) );
					?>
					"></p>

				</div>

				<div class="prpl-column">
					<p><?php \esc_html_e( 'Did you receive our test email?', 'progress-planner' ); ?></p>
					<div class="radios">
						<div class="prpl-radio-wrapper">
							<label for="prpl-sending-email-result-yes" class="prpl-custom-radio">
								<input
								type="radio"
								id="prpl-sending-email-result-yes"
								name="prpl-sending-email-result"
								data-action="showSuccess"
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

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="">
						<?php
							/* translators: %s is an arrow icon. */
							printf( \esc_html__( 'Next step %s', 'progress-planner' ), '<span class="dashicons dashicons-arrow-right-alt2"></span>' );
						?>
						</button>
					</div>
				</div>
			</div>

			<?php /* Email received, showing success message */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-success-step" style="display: none;">
				<div class="prpl-column prpl-column-content">
					<?php \esc_html_e( 'We\'re happy to hear you\'ve received our test email. This indicates email is set up properly on your website.', 'progress-planner' ); ?>
				</div>

				<div class="prpl-column">

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="completeTask"><?php \esc_html_e( 'Mark as completed', 'progress-planner' ); ?></button>
					</div>
				</div>
			</div>

			<?php /* Email not received, showing troubleshooting */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-troubleshooting-step" style="display: none;">
				<div class="prpl-column prpl-column-content">

				</div>

				<div class="prpl-column">
					<h2><?php \esc_html_e( 'Email Troubleshooting', 'progress-planner' ); ?></h2>
					<p><?php \esc_html_e( 'Here are some steps to fix email sending issues:', 'progress-planner' ); ?></p>
					<ul>
						<li><?php \esc_html_e( 'Check your SMTP settings are correct', 'progress-planner' ); ?></li>
						<li><?php \esc_html_e( 'Ensure your domain\'s SPF records are properly configured', 'progress-planner' ); ?></li>
						<li><?php \esc_html_e( 'Verify your email provider credentials', 'progress-planner' ); ?></li>
						<li><?php \esc_html_e( 'Try sending to a different email address', 'progress-planner' ); ?></li>
					</ul>

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'Close', 'progress-planner' ); ?></button>
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
			'title'       => \esc_html__( 'Test if your site can send emails', 'progress-planner' ),
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
