<?php
/**
 * Singleton accessor for the kit's AdminUI instance used inside
 * progress-planner.
 *
 * The kit owns the top-level admin page: its PageRegistrar registers the
 * menu and renders views/admin-page.php. Progress-planner-specific UI
 * (notification counter, welcome/privacy gate, tour, subscribe popover,
 * JS templates) attaches via {@see Admin_UI_Kit_Integration} on the
 * kit's {asset_prefix}_admin_ui_* filters/actions.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin;

use ProgressPlanner\AdminUI\AdminUI;
use ProgressPlanner\AdminUI\Config;

/**
 * Lazy accessor for the single kit AdminUI instance used by progress-planner.
 */
final class Admin_UI_Instance {

	/**
	 * @var AdminUI|null
	 */
	private static $instance = null;

	public static function get(): AdminUI {
		if ( null !== self::$instance ) {
			return self::$instance;
		}

		$package_root = \constant( 'PROGRESS_PLANNER_DIR' ) . '/vendor/progressplanner/wp-admin-ui';

		$branding = \progress_planner()->get_ui__branding()->to_kit_branding();

		$config = new Config(
			'progress-planner',
			'progress-planner',
			'progress-planner',
			'progress_planner',
			'progress-planner/v1',
			$branding->name,
			$branding->submenu_name,
			$branding,
			$package_root . '/assets',
			\plugin_dir_url( \constant( 'PROGRESS_PLANNER_FILE' ) ) . 'vendor/progressplanner/wp-admin-ui/assets',
			\constant( 'PROGRESS_PLANNER_DIR' ) . '/assets',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets',
			$package_root . '/views',
			\constant( 'PROGRESS_PLANNER_DIR' ) . '/views',
			'manage_options',
			\progress_planner()->get_ui__branding()->get_admin_submenu_position(),
			true, // show_range_filter — matches progress-planner's existing header.
			true  // register_page — the kit owns the admin menu.
		);

		self::$instance = AdminUI::boot( $config );
		return self::$instance;
	}
}
