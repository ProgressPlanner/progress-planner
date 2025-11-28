<?php
/**
 * Tour step view.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<!-- Tour step welcome -->
<script type="text/template" id="onboarding-step-welcome">
	<!-- <div class="tour-header">
		<h2 class="tour-title">
			<?php
			/* translators: %s: Progress Planner name. */
			\printf( \esc_html__( 'Welcome to %s!', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
			?>
		</h2>
	</div> -->
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex prpl-columns-2-1">
			<div class="prpl-column">
				<div class="prpl-background-content">
					<h3 class="tour-title">
						<?php
						\esc_html_e( 'Hi there! Ready to push your website forward? Let\'s go!', 'progress-planner' );
						?>
					</h3>
					<p>
						<?php
						/* translators: %s: Progress Planner name. */
						\printf( \esc_html__( '%s helps you set clear, focused goals for your website. Let\'s go through a few simple steps to get everything set up.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
						?>
					</p>
					<p>
						<?php \esc_html_e( 'This will only take a few minutes.', 'progress-planner' ); ?>
					</p>

					<div class="prpl-privacy-checkbox-wrapper">
						<?php
							\progress_planner()->the_view(
								'onboarding/form-inputs/checkbox.php',
								[
									'name'          => 'privacy_accepted',
									'current_value' => 0,
									'options'       => [
										[
											'id'    => 'prpl-privacy-checkbox',
											'label' => \sprintf(
												/* translators: %s: progressplanner.com/privacy-policy link */
												\esc_html__( 'I accept the %s and the essential data processing needed for the plugin.', 'progress-planner' ),
												'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy' ) ) . '" target="_blank">privacy policy</a>'
											),
											'value' => 1,
										],
									],
								]
							);
							?>
					</div>
				</div>

				<div class="tour-footer">
					<div class="prpl-tour-next-wrapper">
						<button class="prpl-tour-next prpl-btn prpl-btn-primary"><?php \esc_html_e( 'Start onboarding', 'progress-planner' ); ?></button>
					</div>
				</div>
			</div>
			<div class="prpl-column">
				<div id="prpl-welcome-graphic">
					<?php \progress_planner()->the_file( 'assets/onboarding/images/thumbs_up_ravi_rtl.svg' ); ?>
				</div>
			</div>
		</div>
	</div>
</script>
