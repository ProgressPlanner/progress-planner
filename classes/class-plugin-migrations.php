<?php
/**
 * Plugin Upgrade class.
 *
 * Handles database entries migration & updating.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Update\Update_111;
use Progress_Planner\Update\Update_130;
use Progress_Planner\Update\Update_140;
/**
 * Plugin Upgrade class.
 *
 * Handles database entries migration & updating.
 *
 * @package Progress_Planner
 */
class Plugin_Migrations {

	/**
	 * The plugin database version.
	 *
	 * @var string
	 */
	private $db_version;

	/**
	 * The plugin version.
	 *
	 * @var string
	 */
	private $version;

	/**
	 * An array of upgrade methods.
	 *
	 * @var array
	 */
	private const UPGRADE_CLASSES = [
		'1.1.1' => Update_111::class,
		'1.3.0' => Update_130::class,
		'1.4.0' => Update_140::class,
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->db_version = $this->get_db_version();
		$this->version    = $this->get_plugin_version();
		\add_action( 'init', [ $this, 'maybe_upgrade' ], 100 );
	}

	/**
	 * Get the plugin version.
	 *
	 * @return string
	 */
	private function get_plugin_version() {
		return \get_file_data( PROGRESS_PLANNER_FILE, [ 'Version' => 'Version' ] )['Version'];
	}

	/**
	 * Get the plugin database version.
	 *
	 * @return string
	 */
	private function get_db_version() {
		return \get_option( 'progress_planner_version', '1.1.0' );
	}

	/**
	 * Maybe upgrade the database.
	 *
	 * @return void
	 */
	public function maybe_upgrade() {
		// If the current version is the same as the plugin version, do nothing.
		if ( version_compare( $this->db_version, $this->version, '=' ) &&
			! \get_option( 'prpl_debug_migrations' )
		) {
			return;
		}

		// Run the upgrades.
		foreach ( self::UPGRADE_CLASSES as $version => $upgrade_class ) {
			if (
				\get_option( 'prpl_debug_migrations' ) ||
				version_compare( $version, $this->db_version, '>' )
			) {
				$upgrade_class = new $upgrade_class();
				$upgrade_class->run();
			}
		}

		\update_option( 'progress_planner_version', $this->version );

		// Clear cache.
		\progress_planner()->get_utils__cache()->delete_all();

		/**
		 * Fires when the plugin is updated.
		 *
		 * @param string $version The new version of the plugin.
		 * @param string $db_version The old version of the plugin.
		 */
		do_action( 'progress_planner_plugin_updated', $this->version, $this->db_version );
	}
}
