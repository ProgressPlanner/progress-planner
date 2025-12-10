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
		'monthly-badges',
		\esc_html__( 'Your monthly badge', 'progress-planner' )
	);
	?>
</h2>

<div id="prpl-monthly-badges-root"></div>

<div class="prpl-widget-content">
	<?php
	if ( 2024 === (int) \gmdate( 'Y' ) ) {
		\progress_planner()->the_view( 'page-widgets/parts/monthly-badges-2024.php', [ 'title_tag' => 'h2' ] );
	} else {
		\progress_planner()->the_view( 'page-widgets/parts/monthly-badges.php', [ 'title_year' => 2025 ] );
	}

	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button( '', \esc_html__( 'Show all badges', 'progress-planner' ) );
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
	?>
</div>
