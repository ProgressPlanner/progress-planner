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
<script type="text/template" id="tour-step-welcome">
	<div class="tour-header">
		<h2 class="tour-title">
			<?php
			/* translators: %s: Progress Planner name. */
			\printf( \esc_html__( 'Welcome to %s!', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
			?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php
					/* translators: %s: Progress Planner name. */
					\printf( \esc_html__( '%s helps you set clear, focused goals for your website. Let\'s go through a few simple steps to get everything set up.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
					?>
				</p>
				<p>
					<?php \esc_html_e( 'This will only take 3 to 5 minutes.', 'progress-planner' ); ?>
				</p>

				<div class="prpl-privacy-checkbox-wrapper">
					<label>
						<input type="checkbox" id="prpl-privacy-checkbox" name="privacy_accepted" value="1">
						<?php
						\printf(
							/* translators: %s: progressplanner.com/privacy-policy link */
							\esc_html__( 'I agree to the %s.', 'progress-planner' ),
							'<a href="' . \esc_url( \progress_planner()->get_ui__branding()->get_url( 'https://progressplanner.com/privacy-policy/#h-plugin-privacy-policy' ) ) . '" target="_blank">Privacy policy</a>'
						);
						?>
					</label>
				</div>
			</div>
			<div class="prpl-column">
				<div id="prpl-welcome-logo">
					<?php \progress_planner()->get_ui__branding()->the_logo(); ?>
				</div>
			</div>
		</div>
	</div>
</script>
