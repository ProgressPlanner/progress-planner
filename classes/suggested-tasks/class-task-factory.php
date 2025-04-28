<?php
/**
 * Task factory class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

/**
 * Task factory class.
 */
class Task_Factory {
	/**
	 * Create a task from a parameter and value.
	 *
	 * @param string $param The parameter, 'id' or 'data'.
	 * @param mixed  $value The task ID or task data.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	public static function create_task_from( $param, $value = null ) {
		if ( 'data' === $param && is_array( $value ) ) {
			return self::create_from_data( $value );
		}

		if ( 'id' === $param && is_string( $value ) ) {
			return self::create_from_id( $value );
		}

		return Local_Task_Factory::create_task_from( 'data', [] );
	}

	/**
	 * Create a task from data array.
	 *
	 * @param array $data The task data.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	private static function create_from_data( array $data ) {
		return Local_Task_Factory::create_task_from( 'data', isset( $data['task_id'] ) ? $data : [] );
	}

	/**
	 * Create a task from task ID.
	 *
	 * @param string $task_id The task ID.
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	private static function create_from_id( string $task_id ) {
		return Local_Task_Factory::create_task_from( 'id', $task_id );
	}
}
