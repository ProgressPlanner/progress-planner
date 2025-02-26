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
	 * An array of upgrade methods.
	 *
	 * @var array
	 */
	private const UPGRADE_METHODS = [
		'1.1.1' => 'upgrade_1_1_1',
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->db_version = $this->get_db_version();
		$this->version    = $this->get_plugin_version();
		$this->maybe_upgrade();
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
	private function maybe_upgrade() {
		// If the current version is the same as the plugin version, do nothing.
		if ( version_compare( $this->db_version, $this->version, '=' ) ) {
			return;
		}

		// Run the upgrades.
		foreach ( self::UPGRADE_METHODS as $version => $upgrade_method ) {
			if (
				( defined( 'PRPL_DEBUG' ) && PRPL_DEBUG ) ||
				\get_option( 'prpl_debug' ) || version_compare( $version, $this->db_version, '>' )
			) {
				$this->$upgrade_method();
			}
		}

		\update_option( 'progress_planner_version', $this->version );

		/**
		 * Fires when the plugin is updated.
		 *
		 * @param string $version The new version of the plugin.
		 * @param string $db_version The old version of the plugin.
		 */
		do_action( 'progress_planner_plugin_updated', $this->version, $this->db_version );
	}

	/**
	 * Upgrade the database to version 1.1.1.
	 *
	 * @return void
	 */
	private function upgrade_1_1_1() {
		// Migrate the `progress_planner_local_tasks` option.
		$local_tasks_option = \get_option( 'progress_planner_local_tasks', [] );
		if ( ! empty( $local_tasks_option ) ) {
			\progress_planner()->get_settings()->set( 'local_tasks', $local_tasks_option );
			\delete_option( 'progress_planner_local_tasks' );
		}

		// Migrate the `progress_planner_suggested_tasks` option.
		$suggested_tasks_option = \get_option( 'progress_planner_suggested_tasks', [] );
		if ( ! empty( $suggested_tasks_option ) ) {
			$sorted_tasks = [];
			foreach ( $suggested_tasks_option as $status => $tasks ) {
				foreach ( $tasks as $task ) {
					if ( is_string( $task ) ) {
						$task = [ 'id' => $task ];
					}
					$task['status'] = $status;
					$sorted_tasks[] = $task;
				}
			}
			\progress_planner()->get_settings()->set( 'suggested_tasks', $sorted_tasks );
			\delete_option( 'progress_planner_suggested_tasks' );
		}
	}
}
