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
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';

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
	 * Whether wp_mail is filtered.
	 *
	 * @var bool
	 */
	protected $is_wp_mail_filtered = false;

	/**
	 * Whether wp_mail is overridden.
	 *
	 * @var bool
	 */
	protected $is_wp_mail_overridden = false;

	/**
	 * The troubleshooting guide URL.
	 *
	 * @var string
	 */
	protected $troubleshooting_guide_url = 'https://prpl.fyi/troubleshoot-smtp';

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

		// By now all plugins should be loaded and hopefully add actions registered, so we can check if phpmailer is filtered.
		\add_action( 'init', [ $this, 'check_if_wp_mail_is_filtered' ], PHP_INT_MAX );
		\add_action( 'init', [ $this, 'check_if_wp_mail_has_override' ], PHP_INT_MAX );

		$this->email_subject = \esc_html__( 'Your Progress Planner test message!', 'progress-planner' );
		// translators: %1$s <br><br> tags, %2$s the admin URL.
		$this->email_content = sprintf( \esc_html__( 'You just used Progress Planner to verify if sending email works on your website. %1$s The good news; it does! Click here to %2$s.', 'progress-planner' ), '<br><br>', '<a href="' . \admin_url( 'admin.php?page=progress-planner&prpl_complete_task=' . $this->get_task_id() ) . '" target="_blank">' . \esc_html__( 'mark Ravi\'s Recommendation as completed', 'progress-planner' ) . '</a>', '<a href="' . \admin_url( 'admin.php?page=progress-planner&prpl_complete_task=' . $this->get_task_id() ) . '" target="_blank">' . \esc_html__( 'here', 'progress-planner' ) . '</a>' );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Test if your website can send emails correctly', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return \esc_html__( 'Your website tries to send you important email. Test if sending email from your site works well.', 'progress-planner' );
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
					'ajax_url'                  => \admin_url( 'admin-ajax.php' ),
					'nonce'                     => \wp_create_nonce( 'progress_planner' ),
					'unknown_error'             => \esc_html__( 'Unknown error', 'progress-planner' ),
					'troubleshooting_guide_url' => $this->troubleshooting_guide_url,
				],
			]
		);
	}

	/**
	 * Check if wp_mail is filtered.
	 *
	 * @return void
	 */
	public function check_if_wp_mail_is_filtered() {
		global $wp_filter;

		$filters_to_check = [
			'phpmailer_init',
			'pre_wp_mail',
		];

		foreach ( $filters_to_check as $filter ) {
			$has_filter                = isset( $wp_filter[ $filter ] ) && ! empty( $wp_filter[ $filter ]->callbacks ) ? true : false;
			$this->is_wp_mail_filtered = $this->is_wp_mail_filtered || $has_filter;
		}
	}

	/**
	 * Check if wp_mail has an override.
	 *
	 * @return void
	 */
	public function check_if_wp_mail_has_override() {

		// Just in case, since it will trigger PHP fatal error if the function doesn't exist.
		if ( function_exists( 'wp_mail' ) ) {
			$ref       = new \ReflectionFunction( 'wp_mail' );
			$file_path = $ref->getFileName();

			$this->is_wp_mail_overridden = $file_path && $file_path !== ABSPATH . 'wp-includes/pluggable.php';
		}
	}

	/**
	 * Whether there is an email override.
	 *
	 * @return bool
	 */
	protected function is_there_sending_email_override() {
		return $this->is_wp_mail_filtered || $this->is_wp_mail_overridden;
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

		$headers = [ 'Content-Type: text/html; charset=UTF-8' ];

		$result = wp_mail( $email_address, $this->email_subject, $this->email_content, $headers );

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
					<p class="prpl-interactive-task-description"><?php \esc_html_e( 'Your WordPress site sometimes needs to send emails. For example, to reset a password, send a comment notification, or warn you when something breaks. Contact forms also use email.', 'progress-planner' ); ?></p>
					<p class="prpl-interactive-task-description"><?php \esc_html_e( 'It’s important to check if these emails are actually sent. Enter your email address on the right to get a test email.', 'progress-planner' ); ?></p>
				</div>
				<div class="prpl-column">
					<p><?php \esc_html_e( 'Where should we send the test email?', 'progress-planner' ); ?></p>
					<div class="prpl-note">
						<span class="prpl-note-icon">
							<?php \progress_planner()->the_asset( 'images/icon_exclamation_triangle_solid.svg' ); ?>
						</span>
						<span class="prpl-note-text">
							<?php \esc_html_e( 'You should get the email in a few minutes. In rare cases, it might take a few hours.', 'progress-planner' ); ?>
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
					<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'We tried to send a test email', 'progress-planner' ); ?></h2>
					<p class="prpl-interactive-task-description" id="prpl-sending-email-error-occurred-message" data-email-message="
					<?php
						/* translators: %s is the email subject. */
						printf( \esc_attr__( 'We just tried to send the email "%s" to [EMAIL_ADDRESS], but unfortunately it didn’t work.', 'progress-planner' ), \esc_attr( $this->email_subject ) );
					?>
					"></p>

				</div>

				<div class="prpl-column">
					<div class="prpl-note prpl-note-error">
						<span class="prpl-note-icon">
							<?php \progress_planner()->the_asset( 'images/icon_exclamation_circle_solid.svg' ); ?>
						</span>
						<span class="prpl-note-text" data-email-message="
						<?php
							/* translators: %s is the error message. */
							printf( \esc_attr__( 'The test email didn’t work. The error message was: [ERROR_MESSAGE]', 'progress-planner' ), \esc_attr( $this->email_error ) );
						?>
						">
						</span>
					</div>

					<p>
					<?php
						printf(
							/* translators: %s is a link to the troubleshooting guide. */
							\esc_html__( 'There are a few common reasons why your email might not be sending. Check the %s to find out what’s causing the issue and how to fix it.', 'progress-planner' ),
							'<a href="' . \esc_url( $this->troubleshooting_guide_url ) . '" target="_blank">' . \esc_html__( 'troubleshooting guide', 'progress-planner' ) . '</a>'
						);
					?>
					</p>

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="showForm"><?php \esc_html_e( 'Try again', 'progress-planner' ); ?></button>
						<button class="prpl-button" data-action="closePopover"><?php \esc_html_e( 'Retry later', 'progress-planner' ); ?></button>
					</div>
				</div>
			</div>

			<?php /* Email sent, asking user if they received it */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-result-step" style="display: none;">
				<div class="prpl-column prpl-column-content">
					<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'We sent a test email', 'progress-planner' ); ?></h2>
					<p class="prpl-interactive-task-description" id="prpl-sending-email-sent-message" data-email-message="
					<?php
						/* translators: %s is the email subject. */
						printf( \esc_attr__( 'We just sent the email "%s" to [EMAIL_ADDRESS].', 'progress-planner' ), \esc_attr( $this->email_subject ) );
					?>
					"></p>

				</div>

				<div class="prpl-column">
					<p><?php \esc_html_e( 'Did you get the test email?', 'progress-planner' ); ?></p>
					<div class="prpl-note">
						<span class="prpl-note-icon">
							<?php \progress_planner()->the_asset( 'images/icon_exclamation_triangle_solid.svg' ); ?>
						</span>
						<span class="prpl-note-text">
							<?php \esc_html_e( 'You should get the email in a few minutes. In rare cases, it might take a few hours.', 'progress-planner' ); ?>
						</span>
					</div>
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
					<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Your email is set up properly!', 'progress-planner' ); ?></h2>
					<?php \esc_html_e( 'Great, you received the test email! This indicates email is set up properly on your website.', 'progress-planner' ); ?>
				</div>

				<div class="prpl-column">
					<p><?php \esc_html_e( 'Celebrate this achievement!', 'progress-planner' ); ?></p>

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="completeTask"><?php \esc_html_e( 'Collect your point!', 'progress-planner' ); ?></button>
					</div>
				</div>
			</div>

			<?php /* Email not received, showing troubleshooting */ ?>
			<div class="prpl-columns-wrapper-flex prpl-sending-email-step" id="prpl-sending-email-troubleshooting-step" style="display: none;">
				<div class="prpl-column prpl-column-content">
					<h2 class="prpl-interactive-task-title"><?php \esc_html_e( 'Your email might not be working well', 'progress-planner' ); ?></h2>
					<p>
					<?php
					\esc_html_e( 'We\'re sorry to hear you did not receive our confirmation email yet. On some websites, it make take up to a few hours to send email. That\'s why we strongly advise you to check back in a few hours from now.', 'progress-planner' );
					?>
					</p>
					<p>
					<?php
					\esc_html_e( 'If you already waited a couple of hours and you still didn\'t get our email, your email might not be working well.', 'progress-planner' );
					?>
					</p>
				</div>

				<div class="prpl-column">
					<p><?php \esc_html_e( 'What can you do next?', 'progress-planner' ); ?></p>

					<?php if ( $this->is_there_sending_email_override() ) : ?>
						<p>
						<?php
						\esc_html_e( 'We\'ve detected you\'re most likely already running an SMTP plugin. Please check its documentation to help you in troubleshooting.', 'progress-planner' );
						?>
						</p>
					<?php else : ?>
					<p>
						<?php
						printf(
						/* translators: %s is a link to the troubleshooting guide. */
							\esc_html__( 'We\'ve not detected an SMTP plugin on your site. Installing one may help resolving the email problem. You can read more about this at %s.', 'progress-planner' ),
							'<a href="' . \esc_url( $this->troubleshooting_guide_url ) . '" target="_blank">' . \esc_html__( 'troubleshooting guide', 'progress-planner' ) . '</a>'
						);
						?>
					</p>
					<?php endif; ?>

					<div class="prpl-steps-nav-wrapper">
						<button class="prpl-button" data-action="openTroubleshootingGuide"><?php \esc_html_e( 'Take me to your troubleshooting guide', 'progress-planner' ); ?></button>
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
			'title'       => $this->get_title(),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'provider_id' => $this->get_provider_id(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'popover_id'  => 'prpl-popover-' . $this->popover_id,
			'description' => $this->get_description(),
		];
	}
}
