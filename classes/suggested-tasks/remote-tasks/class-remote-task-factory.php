<?php
/**
 * Remote task factory class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Remote_Tasks;

use Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task;

/**
 * Remote task factory class.
 */
class Remote_Task_Factory {

	/**
	 * Create a task from a parameter and value.
	 *
	 * @param string $param The parameter, 'id' or 'data'.
	 * @param mixed  $value The task ID or task data.
	 *
	 * @return Remote_Task
	 */
	public static function create_task_from( $param, $value = null ): Remote_Task {
		// If we have task data, return it.
		if ( 'data' === $param && is_array( $value ) ) {
			return new Remote_Task( $value );
		}

		if ( 'id' === $param && is_string( $value ) ) {
			$task_data = \progress_planner()->get_suggested_tasks()->get_remote_task_by_task_id( $value );
			if ( $task_data ) {
				return new Remote_Task( $task_data );
			}
		}

		return new Remote_Task( [] );
	}
}
