<?php
/**
 * Header for the admin page.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

\do_action( 'progress_planner_admin_page_header_before' );
?>
<div id="prpl-dashboard-header-root"></div>
<?php
// Render the subscribe form popover if the license key is not set.
// The popover needs to be rendered in PHP for nonces and other server-side data.
if ( 'no-license' === \get_option( 'progress_planner_license_key', 'no-license' ) ) {
	\progress_planner()->get_ui__popover()->the_popover( 'subscribe-form' )->render();
}
