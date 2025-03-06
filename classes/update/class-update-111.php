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
	private $local_tasks = [];

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

		// Convert local tasks.
		$this->convert_local_tasks();

		if ( $this->local_tasks_changed ) {
			\progress_planner()->get_settings()->set( 'local_tasks', $this->local_tasks );
		}

		// Migrate activities.
		$this->migrate_activities();
	}

	/**
	 * Migrate the `progress_planner_suggested_tasks` option.
	 *
	 * @return void
	 */
	private function migrate_local_tasks() {
		$local_tasks_option = \get_option( 'progress_planner_local_tasks', [] );
		if ( ! empty( $local_tasks_option ) ) {
			foreach ( $local_tasks_option as $task_id ) {
				$task           = ( new Local_Task_Factory( $task_id ) )->get_task()->get_data();
				$task['status'] = 'pending';

				if ( ! isset( $task['task_id'] ) ) {
					continue;
				}
				$this->add_local_task( $task );
				$this->local_tasks_changed = true;
			}
			\delete_option( 'progress_planner_local_tasks' );
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
		\delete_option( 'progress_planner_suggested_tasks' );
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

	/**
	 * Convert task-IDs and add missing categories.
	 *
	 * @return void
	 */
	private function convert_local_tasks() {
		foreach ( $this->local_tasks as $key => $task ) {
			if ( isset( $task['type'] ) ) {
				unset( $this->local_tasks[ $key ]['type'] );
				$this->local_tasks_changed = true;
			}
			$converted_task_id = $this->convert_task_id( $task['task_id'] );
			if ( $converted_task_id !== $task['task_id'] ) {
				$this->local_tasks[ $key ]['task_id'] = $converted_task_id;
				$this->local_tasks_changed            = true;
			}
		}
	}

	/**
	 * Migrate activities.
	 *
	 * @return void
	 */
	private function migrate_activities() {
		// Migrate acgtivities saved in the progress_planner_activities table.
		foreach ( \progress_planner()->get_query()->query_activities(
			[ 'category' => 'suggested_task' ],
		) as $activity ) {
			$data_id     = $activity->data_id;
			$new_data_id = $this->convert_task_id( $data_id );
			if ( $new_data_id !== $data_id ) {
				$activity->data_id = $new_data_id;
				$activity->save();
			}
		}
	}

	/**
	 * Convert a task ID.
	 *
	 * @param string $task_id The task ID to convert.
	 *
	 * @return string
	 */
	private function convert_task_id( $task_id ) {
		if ( ! str_contains( $task_id, '|' ) ) {
			return $task_id;
		}
		$task_id = str_replace( 'type', 'provider_id', $task_id );
		$parts   = \explode( '|', $task_id );
		\ksort( $parts );
		return \implode( '|', $parts );
	}
}
