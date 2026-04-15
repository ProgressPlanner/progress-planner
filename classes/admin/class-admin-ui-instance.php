<?php
/**
 * Singleton accessor for the kit's AdminUI instance used inside
 * progress-planner.
 *
 * Two boot modes, keyed off {@see PROGRESS_PLANNER_USE_ADMIN_UI_PKG}:
 *
 * - Off (default, Phase 4-style): register_page = false. The kit is used
 *   only as a back-end for the Widget base class and AssetEnqueuer.
 *   progress-planner's own Admin\Page class renders the admin page and
 *   enqueues assets. No behavior change.
 *
 * - On (Phase 5): register_page = true. The kit's PageRegistrar takes
 *   over the top-level admin menu and renders views/admin-page.php from
 *   the kit (with progress-planner views/host overrides where present).
 *   Progress-planner's Admin\Page::add_page() short-circuits, and
 *   progress-planner-specific UI (notification counter, welcome/privacy
 *   gate, tour, subscribe, JS templates) attaches via the kit's
 *   {asset_prefix}_admin_ui_* filters/actions.
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

	/**
	 * Whether the kit should render the admin page itself.
	 */
	public static function kit_renders_page(): bool {
		return \defined( 'PROGRESS_PLANNER_USE_ADMIN_UI_PKG' )
			&& (bool) \constant( 'PROGRESS_PLANNER_USE_ADMIN_UI_PKG' );
	}

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
			self::kit_renders_page()
		);

		self::$instance = AdminUI::boot( $config );
		return self::$instance;
	}
}
