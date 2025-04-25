<?php
/**
 * Handle suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Local_Tasks_Manager;
use Progress_Planner\Suggested_Tasks\Remote_Tasks;
use Progress_Planner\Suggested_Tasks\Task_Factory;
/**
 * Suggested_Tasks class.
 */
class Suggested_Tasks {

	/**
	 * An object containing local tasks.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Local_Tasks_Manager|null
	 */
	private $local;

	/**
	 * The API object.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Remote_Tasks|null
	 */
	private $remote;

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->local  = new Local_Tasks_Manager();
		$this->remote = new Remote_Tasks();

		if ( \is_admin() ) {
			\add_action( 'init', [ $this, 'init' ], 1 );
		}
	}

	/**
	 * Run the local tasks.
	 *
	 * @return void
	 */
	public function init() {
		// Init the remote tasks.
		$this->remote->init();  // @phpstan-ignore-line method.nonObject

		// Check for completed tasks.
		$completed_tasks = $this->local->evaluate_tasks(); // @phpstan-ignore-line method.nonObject

		foreach ( $completed_tasks as $task ) {

			// Get the task data.
			$task_data = $task->get_data();

			// Update the task data.
			$this->update_pending_task( $task_data['task_id'], $task_data );

			// Change the task status to pending celebration.
			\progress_planner()->get_recommendations()->mark_task_as( 'pending_celebration', $task_data['task_id'] );

			// Insert an activity.
			\progress_planner()->get_recommendations()->insert_activity( $task_data['task_id'] );
		}
	}

	/**
	 * Get the API object.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Remote_Tasks
	 */
	public function get_remote() {
		return $this->remote; // @phpstan-ignore-line return.type
	}

	/**
	 * Get the local tasks object.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks_Manager
	 */
	public function get_local() {
		return $this->local; // @phpstan-ignore-line return.type
	}

	/**
	 * Return filtered items.
	 *
	 * @return array
	 */
	public function get_tasks() {
		$tasks = [];
		/**
		 * Filter the suggested tasks.
		 *
		 * @param array $tasks The suggested tasks.
		 * @return array
		 */
		$tasks    = \apply_filters( 'progress_planner_suggested_tasks_items', $tasks );
		$db_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		foreach ( $tasks as $key => $task ) {
			if ( isset( $task['status'] ) && ! empty( $task['status'] ) ) {
				continue;
			}

			foreach ( $db_tasks as $db_task_key => $db_task ) {
				if ( $db_task['task_id'] === $task['task_id'] ) {
					$tasks[ $key ]['status'] = $db_task['status'];
					unset( $db_tasks[ $db_task_key ] );
					break;
				}
			}
		}

		return $tasks;
	}

	/**
	 * Get pending tasks with details.
	 *
	 * @return array
	 */
	public function get_pending_tasks_with_details() {
		$tasks              = $this->get_tasks();
		$tasks_with_details = [];

		foreach ( $tasks as $key => $task ) {
			$task_details = Task_Factory::create_task_from( 'id', $task['task_id'] )->get_task_details();

			if ( $task_details ) {
				$tasks_with_details[] = $task_details;
			}
		}

		return $tasks_with_details;
	}

	/**
	 * Get tasks by.
	 *
	 * @param string $param The parameter.
	 * @param string $value The value.
	 *
	 * @return array
	 */
	public function get_tasks_by( $param, $value ) {
		$tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$tasks = array_filter(
			$tasks,
			function ( $task ) use ( $param, $value ) {
				return isset( $task[ $param ] ) && $task[ $param ] === $value;
			}
		);

		return array_values( $tasks );
	}

	/**
	 * Get remote task by id.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array|null
	 */
	public function get_remote_task_by_task_id( $task_id ) {
		$tasks = $this->get_remote_tasks();
		foreach ( $tasks as $task ) {
			if ( $task['task_id'] === $task_id ) {
				return $task;
			}
		}

		return null;
	}

	/**
	 * Get remote tasks.
	 *
	 * @return array
	 */
	public function get_remote_tasks() {
		return $this->remote->get_tasks_to_inject(); // @phpstan-ignore-line method.nonObject
	}

	/**
	 * Delete a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function delete_task( $task_id ) {
		$tasks    = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$modified = false;
		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] === $task_id ) {
				unset( $tasks[ $key ] );
				$modified = true;
				break;
			}
		}

		return $modified
			? \progress_planner()->get_settings()->set( 'local_tasks', $tasks )
			: false;
	}

	/**
	 * Remove a task from a given status (sets it as `pending`).
	 *
	 * @param string $status The status.
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function remove_task_from( $status, $task_id ) {
		$tasks         = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$tasks_changed = false;

		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] !== $task_id ) {
				continue;
			}

			if ( ! isset( $task['status'] ) || $task['status'] !== $status ) {
				return false;
			}

			$tasks[ $key ]['status'] = 'pending';
			$tasks_changed           = true;
		}

		if ( ! $tasks_changed ) {
			return false;
		}

		return \progress_planner()->get_settings()->set( 'local_tasks', $tasks );
	}

	/**
	 * Transition a task from one status to another.
	 *
	 * @param string $task_id The task ID.
	 * @param string $old_status The old status.
	 * @param string $new_status The new status.
	 * @param array  $data The data.
	 *
	 * @return bool
	 */
	public function transition_task_status( $task_id, $old_status, $new_status, $data = [] ) {

		$return_old_status = false;
		$return_new_status = false;

		if ( $old_status ) {
			$return_old_status = $this->remove_task_from( $old_status, $task_id );
		}

		if ( $new_status ) {
			$return_new_status = \progress_planner()->get_recommendations()->mark_task_as( $new_status, $task_id, $data );
		}

		return $return_old_status && $return_new_status;
	}

	/**
	 * Update a task.
	 *
	 * @param string $task_id The task ID.
	 * @param array  $data The data.
	 *
	 * @return bool
	 */
	public function update_pending_task( $task_id, $data ) {
		$tasks         = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$tasks_changed = false;
		foreach ( $tasks as $key => $task ) {
			if ( 'pending' !== $task['status'] || $task['task_id'] !== $task_id ) {
				continue;
			}

			// Don't update the task_id.
			if ( isset( $data['task_id'] ) ) {
				unset( $data['task_id'] );
			}

			// Update the task data except the 'task_id' key.
			$tasks[ $key ] = array_merge( $tasks[ $key ], $data );
			$tasks_changed = true;

			break;
		}

		if ( ! $tasks_changed ) {
			return false;
		}
		return \progress_planner()->get_settings()->set( 'local_tasks', $tasks );
	}

	/**
	 * Add a remote task to the pending tasks.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function add_remote_task_to_pending_tasks( $task_id ) {
		$remote_task_data = $this->get_remote_task_by_task_id( $task_id );

		if ( ! $remote_task_data ) {
			return false;
		}

		return \progress_planner()->get_suggested_tasks()->get_local()->add_pending_task(
			[
				'task_id'     => $task_id,
				'provider_id' => $remote_task_data['category'] ?? '', // Remote tasks use the category as provider_id.
				'category'    => $remote_task_data['category'] ?? '',
			]
		);
	}
}
