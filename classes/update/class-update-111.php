<?php
/**
 * Update class for version 1.1.1.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

/**
 * Update class for version 1.1.1.
 *
 * @package Progress_Planner
 */
class Update_111 {

	/**
	 * Local tasks.
	 *
	 * @var array
	 */
	private $local_tasks;

	/**
	 * Whether local tasks have been changed.
	 *
	 * @var boolean
	 */
	private $local_tasks_changed = false;

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Migrate the `progress_planner_local_tasks` option.
		$this->migrate_local_tasks();

		// Migrate the `progress_planner_suggested_tasks` option.
		$this->migrate_suggested_tasks();

		if ( $this->local_tasks_changed ) {
			\progress_planner()->get_settings()->set( 'local_tasks', $this->local_tasks );
		}
	}

	/**
	 * Migrate the `progress_planner_local_tasks` option.
	 *
	 * @return void
	 */
	private function migrate_local_tasks() {
		$suggested_tasks_option = \get_option( 'progress_planner_suggested_tasks', [] );
		if ( empty( $suggested_tasks_option ) ) {
			return;
		}
		foreach ( $suggested_tasks_option as $status => $tasks ) {
			foreach ( $tasks as $_task ) {
				$task_id        = is_string( $_task ) ? $_task : $_task['id'];
				$task           = ( new Local_Task_Factory( $task_id ) )->get_task()->get_data();
				$task['status'] = $status;
				if ( 'snoozed' === $status && isset( $_task['time'] ) ) {
					$task['time'] = $_task['time'];
				}
				$this->add_local_task( $task );
				$this->local_tasks_changed = true;
			}
		}
	}

	/**
	 * Migrate the `progress_planner_suggested_tasks` option.
	 *
	 * @return void
	 */
	private function migrate_suggested_tasks() {
		$suggested_tasks_option = \get_option( 'progress_planner_suggested_tasks', [] );
		if ( empty( $suggested_tasks_option ) ) {
			return;
		}
		foreach ( $suggested_tasks_option as $status => $tasks ) {
			foreach ( $tasks as $_task ) {
				$task_id        = is_string( $_task ) ? $_task : $_task['id'];
				$task           = ( new Local_Task_Factory( $task_id ) )->get_task()->get_data();
				$task['status'] = $status;
				if ( 'snoozed' === $status && isset( $_task['time'] ) ) {
					$task['time'] = $_task['time'];
				}
				$this->add_local_task( $task );
				$this->local_tasks_changed = true;
			}
		}
	}

	/**
	 * Add a local task.
	 *
	 * @param array $task The task to add.
	 *
	 * @return void
	 */
	private function add_local_task( $task ) {
		foreach ( $this->local_tasks as $key => $local_task ) {
			if ( $local_task['task_id'] === $task['task_id'] ) {
				$this->local_tasks[ $key ] = $task;
				return;
			}
		}
		$this->local_tasks[] = $task;
	}
}
