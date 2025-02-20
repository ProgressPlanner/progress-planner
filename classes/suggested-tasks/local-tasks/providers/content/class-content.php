<?php
/**
 * Abstract class for a local content task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Content;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Abstract;
/**
 * Add tasks for content updates.
 */
abstract class Content extends Local_Tasks_Abstract {

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'edit_others_posts';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'writing';

	/**
	 * Get the task ID.
	 *
	 * @param array $data The data to use for the task ID.
	 *
	 * @return string The task ID.
	 */
	public function get_task_id( $data ) {

		// Remove the task_id if it was added to the data.
		if ( isset( $data['task_id'] ) ) {
			unset( $data['task_id'] );
		}

		\ksort( $data );
		$parts = [];
		foreach ( $data as $key => $value ) {
			$parts[] = $key . '/' . $value;
		}
		return \implode( '|', $parts );
	}

	/**
	 * Get the data from a task-ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array The data.
	 */
	public function get_data_from_task_id( $task_id ) {
		$parts = \explode( '|', $task_id );
		$data  = [];
		foreach ( $parts as $part ) {
			$part = \explode( '/', $part );
			if ( 2 !== \count( $part ) ) {
				continue;
			}
			$data[ $part[0] ] = ( \is_numeric( $part[1] ) )
				? (int) $part[1]
				: $part[1];
		}
		\ksort( $data );

		// Convert (int) 1 and (int) 0 to (bool) true and (bool) false.
		if ( isset( $data['long'] ) ) {
			$data['long'] = (bool) $data['long'];
		}

		return $data;
	}
}
