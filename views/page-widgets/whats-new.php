<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

$prpl_widget     = \progress_planner()->get_admin__widgets__whats_new();
$prpl_blog_posts = $prpl_widget->get_blog_feed();

// If there are no blog posts, don't display the widget.
if ( empty( $prpl_blog_posts ) ) {
	return;
}
?>

<div id="prpl-whats-new-root"></div>
