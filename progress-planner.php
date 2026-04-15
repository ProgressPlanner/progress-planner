<?php
/**
 * A plugin to help you fight procrastination and get things done.
 *
 * @package Progress_Planner
 *
 * Plugin name:       Progress Planner
 * Plugin URI:        https://prpl.fyi/home
 * Description:       A plugin to help you fight procrastination and get things done.
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Version:           1.9.0
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

// Load the Composer autoloader if present — currently only used by the
// optional wp-admin-ui package integration (Phase 2 dual-load).
if ( \file_exists( PROGRESS_PLANNER_DIR . '/vendor/autoload.php' ) ) {
	require_once PROGRESS_PLANNER_DIR . '/vendor/autoload.php';
}

// Dual-load the extracted admin-ui kit behind a feature flag so we can
// validate it boots cleanly in the host context without changing any
// existing behavior. Off by default — define the constant to true in
// wp-config.php to see the shadow page at
// /wp-admin/admin.php?page=progress-planner-adminui.
if (
	\defined( 'PROGRESS_PLANNER_USE_ADMIN_UI_PKG' )
	&& \constant( 'PROGRESS_PLANNER_USE_ADMIN_UI_PKG' )
	&& \class_exists( \ProgressPlanner\AdminUI\AdminUI::class )
) {
	require_once PROGRESS_PLANNER_DIR . '/classes/admin/class-admin-ui-kit-integration.php';
	\add_action( 'plugins_loaded', [ \Progress_Planner\Admin\Admin_UI_Kit_Integration::class, 'boot' ], 20 );
}

if ( ! \function_exists( 'progress_planner' ) ) {
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
}
\progress_planner();
