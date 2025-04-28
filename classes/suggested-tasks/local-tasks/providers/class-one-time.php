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
abstract class One_Time extends Local_Tasks {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'configuration';

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|Task_Local
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() || 0 !== strpos( $task_id, $this->get_task_id() ) ) {
			return false;
		}

		return $this->is_task_completed( $task_id ) ? Local_Task_Factory::create_task_from( 'id', $task_id ) : false;
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
		if (
			true === $this->is_task_snoozed() ||
			! $this->should_add_task() || // No need to add the task.
			true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_task_id() )
		) {
			return [];
		}

		return [
			[
				'task_id'     => $this->get_task_id(),
				'provider_id' => $this->get_provider_id(),
				'category'    => $this->get_provider_category(),
			],
		];
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		return [
			'task_id'      => $this->get_task_id(),
			'provider_id'  => $this->get_provider_id(),
			'title'        => $this->get_title(),
			'parent'       => $this->get_parent(),
			'priority'     => $this->get_priority(),
			'category'     => $this->get_provider_category(),
			'points'       => $this->get_points(),
			'url'          => $this->capability_required() ? \esc_url( $this->get_url() ) : '',
			'description'  => $this->get_description(),
			'link_setting' => $this->get_link_setting(),
			'dismissable'  => $this->is_dismissable(),
		];
	}
}
