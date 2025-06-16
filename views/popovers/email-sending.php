<?php
/**
 * Popover for the email-sending task.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>

<prpl-email-test-popup
	popover-id="<?php echo \esc_attr( 'prpl-popover-' . $prpl_popover_id ); ?>"
	provider-id="<?php echo \esc_attr( $prpl_provider_id ); ?>"
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
						/* translators: %s is a forward arrow icon. */
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
				printf(
					/* translators: %s is the email subject. */
					\esc_attr__( 'We just tried to send the email "%s" to [EMAIL_ADDRESS], but unfortunately it didn’t work.', 'progress-planner' ),
					\esc_attr( $prpl_email_subject )
				);
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
						printf( \esc_attr__( 'The test email didn’t work. The error message was: [ERROR_MESSAGE]', 'progress-planner' ), \esc_attr( $prpl_email_error ) );
					?>
				">
				</span>
			</div>

			<p>
				<?php
				printf(
					/* translators: %s is a link to the troubleshooting guide. */
					\esc_html__( 'There are a few common reasons why your email might not be sending. Check the %s to find out what’s causing the issue and how to fix it.', 'progress-planner' ),
					'<a href="' . \esc_url( $prpl_troubleshooting_guide_url ) . '" target="_blank">' . \esc_html__( 'troubleshooting guide', 'progress-planner' ) . '</a>'
				);
				?>
			</p>

			<div class="prpl-steps-nav-wrapper">
				<button class="prpl-button" data-action="showForm">
					<?php
						/* translators: %s is a back arrow icon. */
						printf( \esc_html__( ' %s Try again', 'progress-planner' ), '<span class="dashicons dashicons-arrow-left-alt2"></span>' );
					?>
				</button>
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
				printf( \esc_attr__( 'We just sent the email "%s" to [EMAIL_ADDRESS].', 'progress-planner' ), \esc_attr( $prpl_email_subject ) );
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
			<p class="prpl-interactive-task-description">
				<?php \esc_html_e( 'We\'re sorry to hear you did not receive our confirmation email yet. On some websites, it make take up to a few hours to send email. That\'s why we strongly advise you to check back in a few hours from now.', 'progress-planner' ); ?>
			</p>
			<p class="prpl-interactive-task-description"><?php \esc_html_e( 'If you already waited a couple of hours and you still didn\'t get our email, your email might not be working well.', 'progress-planner' ); ?>
			</p>
		</div>

		<div class="prpl-column">
			<?php if ( $prpl_is_there_sending_email_override ) : ?>
				<p><?php \esc_html_e( 'What can you do next? Well, it looks like you are already running an SMTP plugin on your website, but it might not be configured correctly.', 'progress-planner' ); ?></p>
				<p><?php \esc_html_e( 'You can find more information about running an SMTP plugin in our troubleshooting guide.', 'progress-planner' ); ?></p>
			<?php else : ?>
				<p><?php \esc_html_e( 'What can you do next? If you haven\'t already, you may need to install a plugin to handle email for you (an SMTP plugin).', 'progress-planner' ); ?></p>
				<p><?php \esc_html_e( 'You can find more information about installing an SMTP plugin in our troubleshooting guide.', 'progress-planner' ); ?></p>
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