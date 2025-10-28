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
			\printf( \esc_html__( 'Welcome to %s!', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_progress_planner_name() ) );
			?>
		</h2>
	</div>
	<div class="tour-content">
		<div class="prpl-columns-wrapper-flex">
			<div class="prpl-column prpl-column-content">
				<p>
					<?php
					/* translators: %s: Progress Planner name. */
					\printf( \esc_html__( '%s helps you set clear, focused goals for your website, and actually reach them.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_progress_planner_name() ) );
					?>
				</p>
				<p>
					<?php \esc_html_e( 'Instead of getting stuck in to-do lists or unfinished ideas, you’ll turn your goals into small, achievable steps. Everything happens inside your WordPress dashboard, with no need for extra tools or complicated setups.', 'progress-planner' ); ?>
				</p>
				<p>
					<?php \esc_html_e( 'The onboarding takes just 3 to 5 minutes. You’ll go through a few simple steps and complete your first recommendation. After that, you’ll be ready to start making real progress.', 'progress-planner' ); ?>
				</p>
			</div>
			<div class="prpl-column">
				<div id="prpl-welcome-logo">
					<?php \progress_planner()->get_ui__branding()->the_logo(); ?>
				</div>
			</div>
		</div>
	</div>
</script>
