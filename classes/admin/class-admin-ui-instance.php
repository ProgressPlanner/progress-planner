<?php
/**
 * Singleton accessor for the kit's AdminUI instance used inside
 * progress-planner (Phase 4+).
 *
 * The kit is booted with register_page: false so its PageRegistrar does
 * not register an admin menu — progress-planner's own Admin\Page class
 * continues to own menu registration. The kit instance is used for:
 *
 * - The Widget base class (Progress_Planner\Admin\Widgets\Widget extends
 *   it and needs an AdminUI in its constructor).
 * - Future phases where the kit's page rendering takes over.
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
			null,
			false,
			false // register_page — progress-planner owns its own admin page.
		);

		self::$instance = AdminUI::boot( $config );
		return self::$instance;
	}
}
