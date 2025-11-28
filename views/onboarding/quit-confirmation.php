<?php
/**
 * Quit confirmation template for onboarding wizard.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<!-- Quit confirmation template -->
<script type="text/template" id="prpl-onboarding-quit-confirmation">
	<div class="prpl-columns-wrapper-flex prpl-columns-2-1">
		<div class="prpl-column">
			<div class="prpl-quit-confirmation">
				<div class="prpl-error-box">
					<span class="dashicons dashicons-warning"></span>
					<div>
						<h3><?php \esc_html_e( 'Are you sure you want to quit?', 'progress-planner' ); ?></h3>
						<p>
							<?php
							/* translators: %s: Progress Planner name. */
							\printf( \esc_html__( 'You need to finish the onboarding before you can work with the %s and start improving your site.', 'progress-planner' ), \esc_html( \progress_planner()->get_ui__branding()->get_admin_menu_name() ) );
							?>
						</p>
					</div>
				</div>
				<div class="prpl-quit-actions">
					<a href="#" id="prpl-quit-yes" class="prpl-quit-link"><?php \esc_html_e( 'Yes, quit the onboarding (for now)', 'progress-planner' ); ?></a>
					<a href="#" id="prpl-quit-no" class="prpl-quit-link prpl-quit-link-primary"><?php \esc_html_e( 'No, let\'s finish the onboarding!', 'progress-planner' ); ?></a>
				</div>
			</div>
		</div>
		<div class="prpl-column prpl-hide-on-mobile">
			<div id="prpl-quit-confirmation-graphic">
				<?php \progress_planner()->the_file( 'assets/onboarding/images/neglected_site_ravi.svg' ); ?>
			</div>
		</div>
	</div>
</script>

