<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Abstract;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;
/**
 * Add tasks for content updates.
 */
abstract class Local_Repetitive_Tasks_Abstract extends Local_Tasks_Abstract {

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

		$task_object = ( new Local_Task_Factory( $task_id ) )->get_task();
		$task_data   = $task_object->get_data();

		if ( $task_data['type'] === $this->get_provider_id() && \gmdate( 'YW' ) === $task_data['year_week'] && ! $this->maybe_add_task() ) {
			return $task_id;
		}

		return false;
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	abstract protected function maybe_add_task();

	/**
	 * Backwards-compatible method to check if the task condition is satisfied.
	 *
	 * @return bool
	 */
	protected function check_task_condition() {
		return ! $this->maybe_add_task();
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		$task_id = $this->get_provider_id() . '-' . \gmdate( 'YW' );

		if (
			true === $this->is_task_type_snoozed() ||
			false === $this->maybe_add_task() || // No need to add the task.
			true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id )
		) {
			return [];
		}

		return [
			$this->get_task_details( $task_id ),
		];
	}
}
