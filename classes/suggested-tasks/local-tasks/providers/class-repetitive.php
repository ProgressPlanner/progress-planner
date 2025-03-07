<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Task_Local;
/**
 * Add tasks for content updates.
 */
abstract class Repetitive extends Local_Tasks {

	/**
	 * Get the task ID.
	 *
	 * @return string
	 */
	public function get_task_id() {
		return $this->get_provider_id() . '-' . \gmdate( 'YW' );
	}

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|Task_Local The task data or false if the task is not completed.
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() || 0 !== strpos( $task_id, $this->get_task_id() ) ) {
			return false;
		}

		$task_object = ( new Local_Task_Factory( $task_id ) )->get_task();
		$task_data   = $task_object->get_data();

		if ( $task_data['provider_id'] === $this->get_provider_id() && \gmdate( 'YW' ) === $task_data['date'] && $this->is_task_completed() ) {
			// Allow adding more data, for example in case of 'create-post' or 'review-content' tasks we are adding the post_id.
			$task_data = apply_filters( "progress_planner_task_data_{$task_data['provider_id']}", $task_data );

			$task_object->set_data( $task_data );

			return $task_object;
		}

		return false;
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	abstract protected function should_add_task();

	/**
	 * Alias for should_add_task(), for better readability when using in the evaluate_task() method.
	 *
	 * @return bool
	 */
	public function is_task_completed() {
		return ! $this->should_add_task();
	}

	/**
	 * Backwards-compatible method to check if the task condition is satisfied.
	 *
	 * @return bool
	 */
	protected function check_task_condition() {
		return ! $this->should_add_task();
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		$task_id = $this->get_task_id();

		if (
			true === $this->is_task_snoozed() ||
			! $this->should_add_task() || // No need to add the task.
			true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id )
		) {
			return [];
		}

		return [
			$this->get_task_details( $task_id ),
		];
	}
}
