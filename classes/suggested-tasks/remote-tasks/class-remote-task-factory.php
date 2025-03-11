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
	 * Get a remote task.
	 *
	 * @param string $task_id The task ID.
	 * @return Remote_Task
	 */
	public function get_task( $task_id ) {
		$task_data = \progress_planner()->get_suggested_tasks()->get_remote_task_by_task_id( $task_id );
		return new Remote_Task( $task_data );
	}
}
