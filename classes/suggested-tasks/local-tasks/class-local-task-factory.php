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
	 * The task ID or task data.
	 *
	 * @var mixed
	 */
	private $task;

	/**
	 * Constructor.
	 *
	 * @param mixed $task The task ID or task data.
	 */
	public function __construct( $task ) {
		$this->task = $task;
	}

	/**
	 * Get the task.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	public function get_task(): Task_Local {

		// If we have task data, return it.
		if ( is_array( $this->task ) ) {
			return new Task_Local( $this->task );
		}

		// We should have all the data saved in the database.
		$data = \progress_planner()->get_suggested_tasks()->get_task_by_task_id( $this->task );

		// If we have the task data, return it.
		if ( $data ) {
			return new Task_Local( $data );
		}

		/*
		We're here in following cases:
		 * - Legacy tasks, happens during v1.1.1 update, where we parsed task data from the task_id.
		 * - Remote tasks, we passed only the task_id.
		*/
		return $this->parse_task_data_from_task_id( $this->task );
	}

	/**
	 * Parse task data from task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local
	 */
	private function parse_task_data_from_task_id( $task_id ) {
		$data = [];

		// TODO: Remove this before Review is implemented.
		if ( 0 === strpos( $this->task, 'review-post-' ) ) {
			// review-post-12345-202501 .
			$parts               = explode( '-', $task_id );
			$data['task_id']     = $task_id;
			$data['provider_id'] = 'review-post';
			$data['category']    = 'content-update';
			$data['post_id']     = $parts[2];
			$data['date']        = $parts[3];

			return new Task_Local( $data );
		}

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

			// Remote (remote-12345) or repetitive tasks (update-core-202449).
			$task_provider_id = substr( $task_id, 0, $last_pos );
			$task_suffix      = substr( $task_id, $last_pos + 1 );

			// Check for legacy create-post task_id, old task_ids were migrated to create-post-short' or 'create-post-long' (since we had 2 such tasks per week).
			if ( 'create-post-short' === $task_provider_id || 'create-post-long' === $task_provider_id ) {
				$task_provider_id = 'create-post';
			}

			$task_suffix_key = 'remote-task' === $task_provider_id ? 'remote_task_id' : 'date';

			$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_provider_id );

			// Remote tasks don't have provider, yet.
			if ( ! $task_provider ) {
				return new Task_Local(
					[
						'task_id' => $task_id,
					]
				);
			} else {
				return new Task_Local(
					[
						'task_id'        => $task_id,
						'category'       => $task_provider->get_provider_category(),
						'provider_id'    => $task_provider->get_provider_id(),
						$task_suffix_key => $task_suffix,
					]
				);
			}
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
			$data[ $part[0] ] = ( \is_numeric( $part[1] ) )
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
			$task_provider    = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $data['provider_id'] );
			$data['category'] = $task_provider ? $task_provider->get_provider_category() : '';
		}

		return new Task_Local( $data );
	}
}
