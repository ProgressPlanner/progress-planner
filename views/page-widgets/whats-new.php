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

<h2 class="prpl-widget-title">
	<?php
	echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		'whats-new',
		\esc_html__( 'What\'s new on the Progress Planner blog', 'progress-planner' )
	);
	?>
</h2>

<div id="prpl-whats-new-root"></div>
