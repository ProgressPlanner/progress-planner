<?php
/**
 * Local task factory.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks;

/**
 * Local task factory.
 */
class Local_Task_Factory {

	/**
	 * Get the task.
	 *
	 * @param string $param The parameter, 'id' or 'data'.
	 * @param mixed  $value The task ID or task data.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	public static function create_task_from( $param, $value = null ): Task_Local {

		// If we have task data, return it.
		if ( 'data' === $param && is_array( $value ) ) {
			return new Task_Local( $value );
		}

		if ( 'id' === $param && is_string( $value ) ) {
			// We should have all the data saved in the database.
			$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $value );

			// If we have the task data, return it.
			if ( isset( $tasks[0] ) ) {
				return new Task_Local( $tasks[0] );
			}

			/*
			We're here in following cases:
			 * - Legacy tasks, happens during v1.1.1 update, where we parsed task data from the task_id.
			*/
			return self::parse_task_data_from_task_id( $value );
		}

		return new Task_Local( [] );
	}

	/**
	 * Legacy function for parsing task data from task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	public static function parse_task_data_from_task_id( $task_id ) {
		$data = [];

		// Parse simple format, e.g. 'update-core-202449' or "hello-world".
		if ( ! str_contains( $task_id, '|' ) ) {

			$last_pos = strrpos( $task_id, '-' );

			// Check if the task ID ends with a '-12345' or not, if not that would be mostly one time tasks.
			if ( $last_pos === false || ! preg_match( '/-\d+$/', $task_id ) ) {

				$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_id );

				return new Task_Local(
					[
						'task_id'     => $task_id,
						'category'    => $task_provider ? $task_provider->get_provider_category() : '',
						'provider_id' => $task_provider ? $task_provider->get_provider_id() : '',
					]
				);
			}

			// Repetitive tasks (update-core-202449).
			$task_provider_id = substr( $task_id, 0, $last_pos );

			// Check for legacy create-post task_id, old task_ids were migrated to create-post-short' or 'create-post-long' (since we had 2 such tasks per week).
			if ( 'create-post-short' === $task_provider_id || 'create-post-long' === $task_provider_id ) {
				$task_provider_id = 'create-post';
			}

			$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_provider_id );

			return new Task_Local(
				[
					'task_id'     => $task_id,
					'category'    => $task_provider ? $task_provider->get_provider_category() : '',
					'provider_id' => $task_provider ? $task_provider->get_provider_id() : '',
					'date'        => substr( $task_id, $last_pos + 1 ),
				]
			);
		}

		// Legacy piped format.
		$data = [ 'task_id' => $task_id ];

		// Parse detailed (piped) format (date/202510|long/1|provider_id/create-post).
		$parts = \explode( '|', $task_id );
		foreach ( $parts as $part ) {
			$part = \explode( '/', $part );
			if ( 2 !== \count( $part ) ) {
				continue;
			}
			// Date should be a string, not a number.
			$data[ $part[0] ] = ( 'date' !== $part[0] && \is_numeric( $part[1] ) )
				? (int) $part[1]
				: $part[1];
		}
		\ksort( $data );

		// Convert (int) 1 and (int) 0 to (bool) true and (bool) false.
		if ( isset( $data['long'] ) ) {
			$data['long'] = (bool) $data['long'];
		}
		if ( isset( $data['type'] ) && ! isset( $data['provider_id'] ) ) {
			$data['provider_id'] = $data['type'];
			unset( $data['type'] );
		}

		if ( isset( $data['provider_id'] ) ) {
			$task_provider    = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $data['provider_id'] ); // @phpstan-ignore-line
			$data['category'] = $task_provider ? $task_provider->get_provider_category() : '';
		}

		return new Task_Local( $data );
	}
}
