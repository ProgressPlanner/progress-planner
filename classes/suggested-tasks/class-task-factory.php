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
	 * Create a task from a parameter and value.
	 *
	 * @param string $param The parameter, 'id' or 'data'.
	 * @param mixed  $value The task ID or task data.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local|\Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task
	 * @throws \InvalidArgumentException If the parameter or value type is invalid.
	 */
	public static function create_task_from( $param, $value = null ) {
		if ( 'data' === $param && is_array( $value ) ) {
			return self::create_from_data( $value );
		}

		if ( 'id' === $param && is_string( $value ) ) {
			return self::create_from_id( $value );
		}

		throw new \InvalidArgumentException( 'Invalid parameter or value type' );
	}

	/**
	 * Create a task from data array.
	 *
	 * @param array $data The task data.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local|\Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task
	 * @throws \InvalidArgumentException If the task data does not contain a task_id.
	 */
	private static function create_from_data( array $data ) {
		if ( ! isset( $data['task_id'] ) ) {
			throw new \InvalidArgumentException( 'Task data must contain task_id' );
		}

		if ( 0 === strpos( $data['task_id'], 'remote-task-' ) ) {
			return Remote_Task_Factory::create_task_from( 'data', $data );
		}
		return Local_Task_Factory::create_task_from( 'data', $data );
	}

	/**
	 * Create a task from task ID.
	 *
	 * @param string $task_id The task ID.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local|\Progress_Planner\Suggested_Tasks\Remote_Tasks\Remote_Task
	 */
	private static function create_from_id( string $task_id ) {
		if ( 0 === strpos( $task_id, 'remote-task-' ) ) {
			return Remote_Task_Factory::create_task_from( 'id', $task_id );
		}
		return Local_Task_Factory::create_task_from( 'id', $task_id );
	}
}
