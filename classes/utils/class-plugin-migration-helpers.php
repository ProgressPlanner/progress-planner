<?php
/**
 * Plugin migration helpers.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

use Progress_Planner\Suggested_Tasks\Task;

/**
 * Plugin migration helpers.
 */
class Plugin_Migration_Helpers {

	/**
	 * Legacy function for parsing task data from task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task
	 */
	public static function parse_task_data_from_task_id( $task_id ) {
		$data = [];

		// Parse simple format, e.g. 'update-core-202449' or "hello-world".
		if ( ! \str_contains( $task_id, '|' ) ) {
			$last_pos = \strrpos( $task_id, '-' );

			// Check if the task ID ends with a '-12345' or not, if not that would be mostly one time tasks.
			if ( $last_pos === false || ! \preg_match( '/-\d+$/', $task_id ) ) {
				$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_id );
				return new Task(
					[
						'task_id'     => $task_id,
						'category'    => $task_provider ? $task_provider->get_provider_category() : '',
						'provider_id' => $task_provider ? $task_provider->get_provider_id() : '',
					]
				);
			}

			// Repetitive tasks (update-core-202449).
			$task_provider_id = \substr( $task_id, 0, $last_pos );

			// Check for legacy create-post task_id, old task_ids were migrated to create-post-short' or 'create-post-long' (since we had 2 such tasks per week).
			if ( 'create-post-short' === $task_provider_id || 'create-post-long' === $task_provider_id ) {
				$task_provider_id = 'create-post';
			}

			$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_provider_id );

			return new Task(
				[
					'task_id'     => $task_id,
					'category'    => $task_provider ? $task_provider->get_provider_category() : '',
					'provider_id' => $task_provider ? $task_provider->get_provider_id() : '',
					'date'        => \substr( $task_id, $last_pos + 1 ),
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
			$task_provider    = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $data['provider_id'] ); // @phpstan-ignore-line
			$data['category'] = $task_provider ? $task_provider->get_provider_category() : '';
		}

		return new Task( $data );
	}
}
