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

<div id="prpl-streak-badges-root"></div>

<?php
\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render_button(
	'',
	\esc_html__( 'Show all badges', 'progress-planner' )
);
\progress_planner()->get_ui__popover()->the_popover( 'monthly-badges' )->render();
?>
