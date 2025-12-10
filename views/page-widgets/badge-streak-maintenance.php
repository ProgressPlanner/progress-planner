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
		'badge-streak-maintenance',
		\esc_html__( 'Your streak badges', 'progress-planner' )
	);
	\progress_planner()->get_ui__popover()->the_popover( 'badge-streak' )->render_button(
		'',
		'<span class="icon prpl-info-icon">' . \progress_planner()->get_asset( 'images/icon_info.svg' ) . '</span> <span class="screen-reader-text">' . \esc_html__( 'More info', 'progress-planner' ) . '</span>'
	);
	\progress_planner()->get_ui__popover()->the_popover( 'badge-streak' )->render();
	?>
</h2>

<div id="prpl-streak-badges-root"></div>

<?php
\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button(
	'',
	\esc_html__( 'Show all badges', 'progress-planner' )
);
\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
?>
