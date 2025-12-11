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

<div id="prpl-monthly-badges-root"></div>

<div class="prpl-widget-content">
	<?php
	\progress_planner()->the_view( 'page-widgets/parts/monthly-badges.php', [ 'title_year' => 2025 ] );

	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button( '', \esc_html__( 'Show all badges', 'progress-planner' ) );
	\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
	?>
</div>
