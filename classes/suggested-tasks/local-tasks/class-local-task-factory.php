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

		// We should have all the data saved in the database.
		$data = \progress_planner()->get_suggested_tasks()->get_task_by_task_id( $this->task_id );

		// If we have the task data, return it.
		if ( $data ) {
			return new Task_Local( $data );
		}

		/*
		We're here in following cases:
		 * - Legacy tasks, happens during v1.1.1 update, where we parsed task data from the task_id.
		 * - When adding new pending task (which is not yet saved in the database).
		 * - Remote tasks.
		*/
		$data = [];

		// Parse simple format, e.g. 'update-core-202449' or "hello-world".
		if ( ! str_contains( $this->task_id, '|' ) ) {

			$last_pos = strrpos( $this->task_id, '-' );

			// Check if the task ID ends with a '-12345' or not, if not that would be mostly one time tasks.
			if ( $last_pos === false || ! preg_match( '/-\d+$/', $this->task_id ) ) {

				$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $this->task_id );

				return new Task_Local(
					[
						'task_id'     => $this->task_id,
						'category'    => $task_provider ? $task_provider->get_provider_category() : '',
						'provider_id' => $task_provider ? $task_provider->get_provider_id() : '',
					]
				);
			}

			// Remote (remote-12345) or repetitive tasks (update-core-202449).
			$task_provider_id = substr( $this->task_id, 0, $last_pos );
			$task_suffix      = substr( $this->task_id, $last_pos + 1 );

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
						'task_id' => $this->task_id,
					]
				);
			} else {
				return new Task_Local(
					[
						'task_id'        => $this->task_id,
						'category'       => $task_provider->get_provider_category(),
						'provider_id'    => $task_provider->get_provider_id(),
						$task_suffix_key => $task_suffix,
					]
				);
			}
		}

		$data = [ 'task_id' => $this->task_id ];

		// Parse detailed (piped) format (date/202510|long/1|provider_id/create-post).
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
