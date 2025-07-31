<?php
/**
 * Plugin Upgrade class.
 *
 * Handles database entries migration & updating.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

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
	 * Constructor.
	 */
	public function __construct() {
		$this->db_version = $this->get_db_version();
		$this->version    = $this->get_plugin_version();
		\add_action( 'init', [ $this, 'maybe_upgrade' ], 1 );
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
		if ( \version_compare( $this->db_version, $this->version, '=' ) &&
			! \get_option( 'prpl_debug_migrations' )
		) {
			return;
		}

		// Get all available updates, as an array of integers.
		$updates_files = \glob( PROGRESS_PLANNER_DIR . '/classes/update/*.php' );
		if ( ! \is_array( $updates_files ) ) {
			return;
		}
		$updates = \array_map(
			function ( $file ) {
				return \str_replace( 'class-update-', '', \basename( $file, '.php' ) );
			},
			$updates_files
		);
		\sort( $updates );

		// Remove "class-update" from the updates.
		$updates = \array_filter(
			$updates,
			function ( $update ) {
				return $update !== 'class-update';
			}
		);

		// Run the upgrades.
		foreach ( $updates as $version_int ) {
			$upgrade_class = 'Progress_Planner\Update\Update_' . $version_int;
			$version       = $upgrade_class::VERSION;
			if (
				\get_option( 'prpl_debug_migrations' ) ||
				\version_compare( $version, $this->db_version, '>' )
			) {
				$upgrade_class = new $upgrade_class();
				if ( \method_exists( $upgrade_class, 'run' ) ) {
					$upgrade_class->run();
				}
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
		\do_action( 'progress_planner_plugin_updated', $this->version, $this->db_version );
	}
}
