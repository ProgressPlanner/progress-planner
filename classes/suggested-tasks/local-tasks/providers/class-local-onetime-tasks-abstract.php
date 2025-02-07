<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Abstract;

/**
 * Add tasks for content updates.
 */
abstract class Local_OneTime_Tasks_Abstract extends Local_Tasks_Abstract {

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() || 0 !== strpos( $task_id, $this->get_provider_id() ) ) {
			return false;
		}

		return true === $this->check_task_condition() ? $task_id : false;
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	abstract protected function check_task_condition();

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if (
			true === $this->is_task_type_snoozed() ||
			true === $this->check_task_condition() || // No need to add the task.
			true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_provider_id() )
		) {
			return [];
		}

		return [
			$this->get_task_details( $this->get_provider_id() ),
		];
	}
}
