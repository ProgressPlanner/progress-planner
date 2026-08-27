<?php
/**
 * Sunset notice banner for the Progress Planner dashboard.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="prpl-widget-wrapper prpl-top-notice prpl-sunset-notice" id="prpl-sunset-notice">
	<div class="inner-content">
		<h1><?php \esc_html_e( 'Thank you for using Progress Planner!', 'progress-planner' ); ?></h1>
		<p><?php echo \wp_kses_post( \progress_planner()->get_admin__sunset_notice()->get_message() ); ?></p>
		<p><?php \esc_html_e( 'Want a keepsake? Download a printable certificate showing your website, how long you\'ve been improving it with Progress Planner, and all the badges you\'ve earned along the way.', 'progress-planner' ); ?></p>
		<a class="prpl-button-primary" href="<?php echo \esc_url( \progress_planner()->get_admin__sunset_notice()->get_certificate_url() ); ?>" target="_blank" rel="noopener">
			<?php \esc_html_e( 'Get your certificate', 'progress-planner' ); ?>
		</a>
	</div>
</div>
