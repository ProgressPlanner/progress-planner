<?php
/**
 * A plugin to help you fight procrastination and get things done.
 *
 * @package Progress_Planner
 *
 * Plugin name:       Progress Planner
 * Plugin URI:        https://prpl.fyi/home
 * Description:       A plugin to help you fight procrastination and get things done.
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Version:           1.7.0
 * Author:            Team Emilia Projects
 * Author URI:        https://prpl.fyi/about
 * License:           GPL-3.0+
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain:       progress-planner
 */

// Exit if accessed directly.
if ( ! \defined( 'ABSPATH' ) ) {
	exit;
}

\define( 'PROGRESS_PLANNER_FILE', __FILE__ );
\define( 'PROGRESS_PLANNER_DIR', __DIR__ );
\define( 'PROGRESS_PLANNER_URL', \untrailingslashit( \plugin_dir_url( __FILE__ ) ) );

require_once PROGRESS_PLANNER_DIR . '/autoload.php';

/**
 * Get the progress planner instance.
 *
 * @return \Progress_Planner\Base
 */
function progress_planner() {
	global $progress_planner;
	if ( ! $progress_planner ) {
		$progress_planner = new \Progress_Planner\Base();
		$progress_planner->init();
	}
	return $progress_planner;
}

\progress_planner();
