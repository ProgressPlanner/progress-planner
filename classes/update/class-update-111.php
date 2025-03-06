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

		// Migrate the 'create-post' tasks, they are now repetitive tasks.
		$this->migrate_create_post_tasks();

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
	 * Migrate the 'create-post' tasks, they are now repetitive tasks.
	 *
	 * @return void
	 */
	private function migrate_create_post_tasks() {

		// Migrate the 'create-post' completed tasks.
		if ( ! empty( $this->local_tasks ) ) {
			foreach ( $this->local_tasks as $key => $task ) {
				if ( false !== strpos( $task['task_id'], '|type/create-post' ) ) {
					// TODO: task_id needs to be unique, before we had 2 'create-post' tasks for the same week (short and long).
					$this->local_tasks[ $key ]['task_id'] = $task['type'] . '-' . $task['date'];
					$this->local_tasks_changed            = true;
				}
			}
		}

		// Migrate the 'create-post' activities.
		$activities = \progress_planner()->get_query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'completed',
			]
		);

		if ( ! empty( $activities ) ) {
			foreach ( $activities as $activity ) {
				if ( false !== strpos( $activity->data_id, '|type/create-post' ) ) {
					$data = $this->get_data_from_task_id( $activity->data_id );

					// TODO: task_id needs to be unique, before we had 2 'create-post' tasks for the same week (short and long).
					$new_data_id = $data['type'] . '-' . $data['date'];
					if ( $new_data_id !== $activity->data_id ) {
						$activity->data_id = $new_data_id;
						$activity->save();
					}
				}
			}
		}
	}

	/**
	 * Get the data from a task-ID.
	 * This is copied from the Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Content class, since we might remove that function in the future.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array The data.
	 */
	private function get_data_from_task_id( $task_id ) {
		$parts = \explode( '|', $task_id );
		$data  = [];
		foreach ( $parts as $part ) {
			$part = \explode( '/', $part );
			if ( 2 !== \count( $part ) ) {
				continue;
			}
			$data[ $part[0] ] = ( \is_numeric( $part[1] ) )
				? (int) $part[1]
				: $part[1];
		}
		\ksort( $data );

		// Convert (int) 1 and (int) 0 to (bool) true and (bool) false.
		if ( isset( $data['long'] ) ) {
			$data['long'] = (bool) $data['long'];
		}

		return $data;
	}
}
