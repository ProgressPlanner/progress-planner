<?php
/**
 * The admin page
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_privacy_policy_accepted = \progress_planner()->is_privacy_policy_accepted();

if ( 0 !== (int) \progress_planner()->get_ui__branding()->get_branding_id() ) {
	$prpl_license_key = \progress_planner()->get_utils__onboard()->make_remote_onboarding_request();
	if ( '' !== $prpl_license_key ) {
		\update_option( 'progress_planner_license_key', $prpl_license_key );
		$prpl_privacy_policy_accepted = true;
	}
}
?>

<div class="wrap prpl-wrap <?php echo \esc_attr( $prpl_privacy_policy_accepted ? '' : 'prpl-pp-not-accepted' ); ?>">
	<?php if ( true === $prpl_privacy_policy_accepted ) : ?>
		<a href="#prpl-main-content" class="screen-reader-text prpl-skip-link"><?php \esc_html_e( 'Skip to main content', 'progress-planner' ); ?></a>
		<h1 class="screen-reader-text"><?php \esc_html_e( 'Progress Planner', 'progress-planner' ); ?></h1>
		<?php \progress_planner()->the_view( 'admin-page-header.php' ); ?>
		<div id="prpl-main-content" class="prpl-widgets-container">
			<?php foreach ( \progress_planner()->get_admin__page()->get_widgets() as $prpl_admin_widget ) : ?>
				<?php $prpl_admin_widget->render(); ?>
			<?php endforeach; ?>
		</div>

		<?php
			/**
			 * Fires after the widgets are rendered.
			 * Nice place to add custom content since our styling is in general applied inside .prpl-wrap .
			 *
			 * @since 1.1.1
			 */
			\do_action( 'progress_planner_admin_page_after_widgets' );
		?>
	<?php else : ?>
		<div class="prpl-start-onboarding-container">
			<div class="prpl-start-onboarding-graphic">
				<?php \progress_planner()->the_file( 'assets/images/onboarding/thumbs_up_ravi_rtl.svg' ); ?>
			</div>
			<button class="prpl-button-primary" id="prpl-start-onboarding-button" onclick="window.prplOnboardWizard.startOnboarding();return false;">
				<?php \esc_html_e( 'Are you ready to work on your site?', 'progress-planner' ); ?>
			</button>
		</div>
	<?php endif; ?>
</div>
<div class="prpl-overlay" id="prpl-overlay" style="display: none;"></div>

<script>
// Add event listener for overlay click to close tooltips.
document.getElementById( 'prpl-overlay' )?.addEventListener( 'click', function() {
	const visibleTooltip = document.querySelector( '[data-tooltip-visible=true]' );
	if ( visibleTooltip ) {
		visibleTooltip.removeAttribute( 'data-tooltip-visible' );
	}
} );
</script>

<?php \progress_planner()->the_view( 'js-templates/suggested-task.html' ); ?>
