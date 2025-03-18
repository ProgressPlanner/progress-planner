<?php
/**
 * Remote task class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Remote_Tasks;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local;

/**
 * Remote task class.
 */
class Remote_Task extends Task_Local {
	/**
	 * Get the task details.
	 *
	 * @return array
	 */
	public function get_task_details() {
		// Remote tasks already have their details in the data array.
		return $this->data;
	}
}
