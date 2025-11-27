<?php
/**
 * Tour step view - Email Frequency.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

// Get current user data for pre-population.
$prpl_current_user = \wp_get_current_user();
$prpl_user_name    = $prpl_current_user->display_name ?? '';
$prpl_user_email   = $prpl_current_user->user_email ?? '';
?>

<!-- Tour step email frequency -->
<script type="text/template" id="onboarding-step-email-frequency">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php \esc_html_e( 'Email Frequency', 'progress-planner' ); ?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex prpl-columns-1-2">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php \esc_html_e( 'Stay on track with emails that include recommendations, updates and useful news.', 'progress-planner' ); ?>
				</p>
				<p>
					<?php \esc_html_e( 'Choose how often you want a little nudge to keep your site moving forward.', 'progress-planner' ); ?>
				</p>
			</div>
			<div class="prpl-column">

				<div class="prpl-email-frequency-options">
					<div>
						<label class="prpl-radio-label">
							<input type="radio" id="prpl-email-weekly" name="email_frequency" value="weekly">
							<span><?php \esc_html_e( 'Email me weekly', 'progress-planner' ); ?></span>
						</label>
					</div>

					<div>
						<label class="prpl-radio-label">
							<input type="radio" id="prpl-dont-email" name="email_frequency" value="none">
							<span><?php \esc_html_e( 'Don\'t email me', 'progress-planner' ); ?></span>
						</label>
					</div>
				</div>

				<div id="prpl-email-form" class="prpl-email-form" style="display: none;">
					<div class="prpl-form-field">
						<label for="prpl-email-name">
							<?php \esc_html_e( 'First name', 'progress-planner' ); ?>
							<span class="required">*</span>
						</label>
						<input
							type="text"
							id="prpl-email-name"
							name="email_name"
							value="<?php echo \esc_attr( $prpl_user_name ); ?>"
							placeholder="<?php \esc_attr_e( 'Enter your name', 'progress-planner' ); ?>"
							required
						>
					</div>

					<div class="prpl-form-field">
						<label for="prpl-email-address">
							<?php \esc_html_e( 'Email address', 'progress-planner' ); ?>
							<span class="required">*</span>
						</label>
						<input
							type="email"
							id="prpl-email-address"
							name="email_address"
							value="<?php echo \esc_attr( $prpl_user_email ); ?>"
							placeholder="<?php \esc_attr_e( 'Enter your email', 'progress-planner' ); ?>"
							required
						>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="tour-footer">
		<div class="prpl-tour-next-wrapper">
			<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php \esc_html_e( 'Got it', 'progress-planner' ); ?></button>
		</div>
	</div>
</script>
