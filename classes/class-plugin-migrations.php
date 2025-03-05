<?php
/**
 * Plugin Upgrade class.
 *
 * Handles database entries migration & updating.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

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
		if ( version_compare( $this->db_version, $this->version, '=' ) &&
			( ! defined( 'PRPL_DEBUG' ) || ! PRPL_DEBUG ) &&
			! \get_option( 'prpl_debug' )
		) {
			return;
		}

		// Run the upgrades.
		foreach ( self::UPGRADE_METHODS as $version => $upgrade_method ) {
			if (
				( defined( 'PRPL_DEBUG' ) && PRPL_DEBUG ) ||
				\get_option( 'prpl_debug' ) ||
				version_compare( $version, $this->db_version, '>' )
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
		$local_tasks         = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$local_tasks_changed = false;

		$add_local_task = function ( $task ) use ( &$local_tasks ) {
			foreach ( $local_tasks as $key => $local_task ) {
				if ( $local_task['task_id'] === $task['task_id'] ) {
					$local_tasks[ $key ] = $task;
					return;
				}
			}
			$local_tasks[] = $task;
		};

		// Migrate the `progress_planner_local_tasks` option.
		$local_tasks_option = \get_option( 'progress_planner_local_tasks', [] );
		if ( ! empty( $local_tasks_option ) ) {
			foreach ( $local_tasks_option as $task_id ) {
				$task           = ( new Local_Task_Factory( $task_id ) )->get_task()->get_data();
				$task['status'] = 'pending';

				if ( ! isset( $task['task_id'] ) ) {
					continue;
				}

				$add_local_task( $task );
				$local_tasks_changed = true;
			}
			\delete_option( 'progress_planner_local_tasks' );
		}

		// Migrate the `progress_planner_suggested_tasks` option.
		$suggested_tasks_option = \get_option( 'progress_planner_suggested_tasks', [] );
		if ( ! empty( $suggested_tasks_option ) ) {
			foreach ( $suggested_tasks_option as $status => $tasks ) {
				foreach ( $tasks as $_task ) {
					$task_id        = is_string( $_task ) ? $_task : $_task['id'];
					$task           = ( new Local_Task_Factory( $task_id ) )->get_task()->get_data();
					$task['status'] = $status;
					if ( 'snoozed' === $status && isset( $_task['time'] ) ) {
						$task['time'] = $_task['time'];
					}
					$add_local_task( $task );
					$local_tasks_changed = true;
				}
			}
		}

		foreach ( $local_tasks as $key => $task ) {
			if ( isset( $task['type'] ) ) {
				$local_tasks[ $key ]['category'] = $task['type'];
				unset( $local_tasks[ $key ]['type'] );
			}
		}

		if ( $local_tasks_changed ) {
			\progress_planner()->get_settings()->set( 'local_tasks', $local_tasks );
		}
	}
}
