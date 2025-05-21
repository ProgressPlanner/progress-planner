<?php
/**
 * Task factory.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

use Progress_Planner\Suggested_Tasks\Task;
use Progress_Planner\Suggested_Tasks_DB;

/**
 * Task factory.
 */
class Task_Factory {

	/**
	 * Get the task.
	 *
	 * @param mixed $value The task ID or task data.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task
	 */
	public static function create_task_from_id( $value = null ): Task {
		$task = Suggested_Tasks_DB::get_post( $value );

		// If we have the task data, return it.
		return $task ? $task : new Task( [] );
	}
}
