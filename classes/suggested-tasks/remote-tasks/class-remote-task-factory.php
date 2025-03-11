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
	 * The task ID or task data.
	 *
	 * @var mixed
	 */
	private $task;

	/**
	 * Constructor.
	 *
	 * @param mixed $task The task data.
	 */
	public function __construct( $task ) {
		$this->task = $task;
	}

	/**
	 * Get a remote task.
	 *
	 * @return Remote_Task
	 */
	public function get_task() {

		// If we have task data, return it.
		if ( is_array( $this->task ) ) {
			return new Remote_Task( $this->task );
		}

		$task_data = \progress_planner()->get_suggested_tasks()->get_remote_task_by_task_id( $this->task );
		return new Remote_Task( $task_data );
	}
}
