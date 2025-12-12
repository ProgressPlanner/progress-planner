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
		<?php
		/**
		 * Fires before the dashboard header is rendered.
		 * Useful for adding notices or other content above the header.
		 *
		 * @since 1.0.0
		 */
		\do_action( 'progress_planner_admin_page_header_before' );
		?>
		<div id="prpl-dashboard-root"></div>
		<?php
		// Render the subscribe form popover if the license key is not set.
		// The popover needs to be rendered in PHP for nonces and other server-side data.
		// It's referenced by the React DashboardHeader component.
		if ( 'no-license' === \get_option( 'progress_planner_license_key', 'no-license' ) ) {
			\progress_planner()->get_ui__popover()->the_popover( 'subscribe-form' )->render();
		}
		?>
		<?php
		// Enqueue widget styles (scripts are now handled by dashboard.js).
		// Widget styles are enqueued directly based on widget IDs.
		$widget_style_handles = [
			'progress-planner/page-widgets/suggested-tasks',
			'progress-planner/page-widgets/todo',
			'progress-planner/page-widgets/monthly-badges',
			'progress-planner/page-widgets/badge-streak',
			'progress-planner/page-widgets/activity-scores',
			'progress-planner/page-widgets/content-activity',
			'progress-planner/page-widgets/whats-new',
		];
		foreach ( $widget_style_handles as $style_handle ) {
			\progress_planner()->get_admin__enqueue()->enqueue_style( $style_handle );
		}
		?>

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
		<?php \progress_planner()->the_view( 'welcome.php' ); ?>
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
