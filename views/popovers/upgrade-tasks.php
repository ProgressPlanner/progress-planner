<?php
/**
 * Monthly badges popover.
 *
 * @package Progress_Planner
 */


// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

\progress_planner()->the_view( 'popovers/parts/upgrade-tasks.php' );
