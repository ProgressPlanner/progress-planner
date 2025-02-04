<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Interface;

/**
 * Add tasks for content updates.
 */
abstract class Local_Tasks_Abstract implements Local_Tasks_Interface {

	/**
	 * The type of the task.
	 *
	 * @var string
	 */
	const TYPE = '';

	/**
	 * The ID of the task.
	 *
	 * @var string
	 */
	const ID = '';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'manage_options';

	/**
	 * Get the provider type.
	 *
	 * @return string
	 */
	public function get_provider_type() {
		return static::TYPE;
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return static::ID;
	}

	/**
	 * Check if the user has the capability to perform the task.
	 *
	 * @return bool
	 */
	public function capability_required() {
		return $this->capability
			? \current_user_can( $this->capability )
			: true;
	}

	/**
	 * Get the data from a task-ID.
	 *
	 * @param string $task_id The task ID (unused here).
	 *
	 * @return array The data.
	 */
	public function get_data_from_task_id( $task_id ) {
		$data = [
			'type' => static::TYPE,
			'id'   => static::ID,
		];

		return $data;
	}

	/**
	 * Check if a task type is snoozed.
	 *
	 * @return bool
	 */
	public function is_task_type_snoozed() {
		$snoozed = \progress_planner()->get_suggested_tasks()->get_snoozed_tasks();
		if ( ! \is_array( $snoozed ) || empty( $snoozed ) ) {
			return false;
		}

		foreach ( $snoozed as $task ) {
			if ( static::ID === $task['id'] ) {
				return true;
			}
		}

		return false;
	}
}
