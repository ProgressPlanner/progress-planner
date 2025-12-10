<?php
/**
 * Widget view.
 *
 * @package Progress_Planner
 */

if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}
?>

<h2 class="prpl-widget-title">
	<?php
	echo \progress_planner()->get_ui__branding()->get_widget_title( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		'content-activity',
		\esc_html__( 'Content activity', 'progress-planner' )
	);
	?>
</h2>
<p><?php \esc_html_e( 'Here are the updates you made to your content last week. Whether you published something new, updated an existing post, or removed outdated content, it all helps you stay on top of your site!', 'progress-planner' ); ?></p>

<div id="prpl-content-activity-root"></div>
