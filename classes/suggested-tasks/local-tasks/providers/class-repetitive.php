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
	 * @param array $data Optional data to include in the task ID.
	 * @return string
	 */
	public function get_task_id( $data = [] ) {
		$parts = [ $this->get_provider_id() ];

		// Add optional data parts if provided.
		if ( ! empty( $data ) ) {
			foreach ( $data as $value ) {
				$parts[] = $value;
			}
		}

		// Always add the date as the last part.
		$parts[] = \gmdate( 'YW' );

		return implode( '-', $parts );
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
		if ( ! $this->capability_required() ) {
			return false;
		}

		$task_object = Local_Task_Factory::create_task_from( 'id', $task_id );
		$task_data   = $task_object->get_data();

		if ( $task_data['provider_id'] === $this->get_provider_id() && \gmdate( 'YW' ) === $task_data['date'] && $this->is_task_completed( $task_id ) ) {
			// Allow adding more data, for example in case of 'create-post' tasks we are adding the post_id.
			$task_data = $this->modify_evaluated_task_data( $task_data );
			$task_object->set_data( $task_data );

			return $task_object;
		}

		return false;
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
	 * Modify task data after task was evaluated.
	 * Child classes can override this method to add extra data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	protected function modify_evaluated_task_data( $task_data ) {
		return $task_data;
	}

	/**
	 * Modify task data before injecting it.
	 * Child classes can override this method to add extra data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	protected function modify_injection_task_data( $task_data ) {
		return $task_data;
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

		$task_data = [
			'task_id'     => $task_id,
			'provider_id' => $this->get_provider_id(),
			'category'    => $this->get_provider_category(),
			'date'        => \gmdate( 'YW' ),
		];

		$task_data = $this->modify_injection_task_data( $task_data );

		return [
			$task_data,
		];
	}
}
