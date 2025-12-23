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
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex prpl-columns-1-2">
			<div class="prpl-column">
				<div class="prpl-background-content">
					<p>
						<?php \esc_html_e( 'Stay on track with emails that include recommendations, updates and useful news.', 'progress-planner' ); ?>
					</p>
					<p>
						<?php \esc_html_e( 'Choose how often you want a little nudge to keep your site moving forward.', 'progress-planner' ); ?>
					</p>
				</div>
			</div>
			<div class="prpl-column">
				<h3 class="tour-title">
					<?php \esc_html_e( 'Email Frequency', 'progress-planner' ); ?>
				</h3>

				<div class="prpl-email-frequency-options">
					<?php
					\progress_planner()->the_view(
						'onboarding/form-inputs/radio.php',
						[
							'name'          => 'email_frequency',
							'current_value' => 'weekly',
							'options'       => [
								[
									'id'    => 'prpl-email-weekly',
									'label' => \esc_html__( 'Email me weekly', 'progress-planner' ),
									'value' => 'weekly',
								],
								[
									'id'    => 'prpl-dont-email',
									'label' => \esc_html__( 'Don\'t email me', 'progress-planner' ),
									'value' => 'none',

								],
							],
						]
					);
					?>
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
			<button class="prpl-tour-next prpl-btn prpl-btn-secondary"><?php \esc_html_e( 'Got it', 'progress-planner' ); ?></button>
		</div>
	</div>
</script>
