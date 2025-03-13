<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Interface;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

/**
 * Add tasks for content updates.
 */
abstract class Local_Tasks implements Local_Tasks_Interface {

	/**
	 * The category of the task.
	 *
	 * @var string
	 */
	protected const CATEGORY = '';

	/**
	 * The ID of the task provider.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = '';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'manage_options';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
	}

	/**
	 * Alias for get_provider_category(), to provide backwards compatibility.
	 *
	 * @return string
	 */
	public function get_provider_type() {
		_deprecated_function( 'Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks::get_provider_type()', '1.1.1', 'get_provider_category' );
		return $this->get_provider_category();
	}

	/**
	 * Get the provider category.
	 *
	 * @return string
	 */
	public function get_provider_category() {
		return static::CATEGORY;
	}

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return static::PROVIDER_ID;
	}

	/**
	 * Get the task ID.
	 *
	 * @return string
	 */
	public function get_task_id() {
		return $this->get_provider_id();
	}

	/**
	 * Check if the user has the capability to perform the task.
	 *
	 * @return bool
	 */
	public function capability_required() {
		return static::CAPABILITY
			? \current_user_can( static::CAPABILITY )
			: true;
	}

	/**
	 * Check if the task is an onboarding task.
	 *
	 * @return bool
	 */
	public function is_onboarding_task() {
		return static::IS_ONBOARDING_TASK;
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
			'provider_id' => $this->get_provider_id(),
			'id'          => $task_id,
		];

		return $data;
	}

	/**
	 * Check if a task category is snoozed.
	 *
	 * @return bool
	 */
	public function is_task_snoozed() {
		$snoozed = \progress_planner()->get_suggested_tasks()->get_tasks_by_status( 'snoozed' );
		if ( ! \is_array( $snoozed ) || empty( $snoozed ) ) {
			return false;
		}

		foreach ( $snoozed as $task ) {
			$task_object = ( new Local_Task_Factory( $task['task_id'] ) )->get_task();
			$provider_id = $task_object->get_provider_id();

			if ( $provider_id === $this->get_provider_id() ) {
				return true;
			}
		}

		return false;
	}
}
