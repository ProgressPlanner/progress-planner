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
	 * The task ID.
	 *
	 * @var string
	 */
	private $task_id;

	/**
	 * Constructor.
	 *
	 * @param string $task_id The task ID.
	 */
	public function __construct( string $task_id ) {
		$this->task_id = $task_id;
	}

	/**
	 * Get the task.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	public function get_task(): Task_Local {

		// Parse simple format, e.g. 'update-core-202449' or "hello-world".
		if ( ! str_contains( $this->task_id, '|' ) ) {

			$last_pos = strrpos( $this->task_id, '-' );

			// Check if the task ID ends with a '-12345' or not, if not that would be mostly one time tasks.
			if ( $last_pos === false || ! preg_match( '/-\d+$/', $this->task_id ) ) {
				return new Task_Local(
					[
						'task_id'     => $this->task_id,
						'category'    => $this->task_id,
						'provider_id' => $this->task_id,
					]
				);
			}

			// Remote (remote-12345) or repetitive tasks (update-core-202449).
			$category    = substr( $this->task_id, 0, $last_pos );
			$task_suffix = substr( $this->task_id, $last_pos + 1 );

			$task_suffix_key = 'remote-task' === $category ? 'remote_task_id' : 'date';

			return new Task_Local(
				[
					'task_id'        => $this->task_id,
					'category'       => $category,
					'provider_id'    => $category,
					$task_suffix_key => $task_suffix,
				]
			);
		}

		$data = [ 'task_id' => $this->task_id ];

		// Parse detailed (piped) format (date/202510|long/1|category/create-post).
		$parts = \explode( '|', $this->task_id );
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
		if ( isset( $data['type'] ) && ! isset( $data['category'] ) ) {
			$data['category'] = $data['type'];
			unset( $data['type'] );
		}
		if ( isset( $data['category'] ) && ! isset( $data['provider_id'] ) ) {
			$data['provider_id'] = $data['category'];
		}

		return new Task_Local( $data );
	}
}
