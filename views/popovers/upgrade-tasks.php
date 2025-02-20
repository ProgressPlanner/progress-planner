<?php
/**
 * Monthly badges popover.
 *
 * @package Progress_Planner
 */

use Progress_Planner\Badges\Monthly;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

\progress_planner()->the_view( 'popovers/parts/upgrade-tasks.php', [ 'context' => 'upgrade' ] );
