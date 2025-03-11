<?php
/**
 * Task factory class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;
use Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task_Factory;

/**
 * Task factory class.
 */
class Task_Factory {
	/**
	 * Get a task object.
	 *
	 * @param string $task_id The task ID.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local|\Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task
	 */
	public static function get_task( $task_id ) {
		if ( strpos( $task_id, 'remote-task-' ) === 0 ) {
			return ( new Remote_Task_Factory() )->get_task( $task_id );
		}
		return ( new Local_Task_Factory( $task_id ) )->get_task();
	}
}
