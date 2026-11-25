<?php
/**
 * Popover for the streak badges.
 *
 * @package Progress_Planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

\progress_planner()->the_view( 'popovers/parts/badge-track-popover.php', [ 'context' => 'maintenance' ] );

/**
 * Fires after the streak badges in their popover.
 *
 * Kept from the former combined streak and content popover.
 */
\do_action( 'progress_planner_popover_after_streak_sections' );
