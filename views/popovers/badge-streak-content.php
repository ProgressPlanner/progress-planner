<?php
/**
 * Popover for the content badges.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

\progress_planner()->the_view( 'popovers/parts/badge-track-popover.php', [ 'context' => 'content' ] );
