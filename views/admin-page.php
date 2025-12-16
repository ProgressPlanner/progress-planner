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
?>

<div class="wrap prpl-wrap">
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
	// Enqueue widget styles (scripts are now handled by dashboard.js).
	// Widget styles are enqueued directly based on widget IDs.
	$prpl_widget_style_handles = [
		'progress-planner/page-widgets/suggested-tasks',
		'progress-planner/page-widgets/todo',
		'progress-planner/page-widgets/monthly-badges',
		'progress-planner/page-widgets/badge-streak',
	];
	foreach ( $prpl_widget_style_handles as $prpl_style_handle ) {
		\progress_planner()->get_admin__enqueue()->enqueue_style( $prpl_style_handle );
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
