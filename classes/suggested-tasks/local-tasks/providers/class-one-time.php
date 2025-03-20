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
	 * The task description.
	 *
	 * @var string
	 */
	protected $description;

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = false;

	/**
	 * The task link setting.
	 *
	 * @var array
	 */
	protected $link_setting;

	/**
	 * The task parent.
	 *
	 * @var int
	 */
	protected $parent = 0;

	/**
	 * The task points.
	 *
	 * @var int
	 */
	protected $points = 1;

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'medium';

	/**
	 * The task title.
	 *
	 * @var string
	 */
	protected $title;

	/**
	 * The task URL.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * Get the task description.
	 *
	 * @param bool $wrap_in_p Whether to wrap the description in a <p> tag.
	 *
	 * @return string
	 */
	public function get_description( $wrap_in_p = true ) {
		return $wrap_in_p ? '<p>' . $this->description . '</p>' : $this->description;
	}

	/**
	 * Get the task link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return $this->link_setting;
	}

	/**
	 * Get the task parent.
	 *
	 * @return int
	 */
	public function get_parent() {
		return $this->parent;
	}

	/**
	 * Get the task points.
	 *
	 * @return int
	 */
	public function get_points() {
		return $this->points;
	}

	/**
	 * Get the task priority.
	 *
	 * @return string
	 */
	public function get_priority() {
		return $this->priority;
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	public function get_url() {
		if ( $this->url ) {
			return \esc_url( $this->url );
		}

		return '';
	}

	/**
	 * Get the task dismissable setting.
	 *
	 * @return bool
	 */
	public function is_dismissable() {
		return $this->is_dismissable;
	}

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

		return $this->is_task_completed() ? Local_Task_Factory::create_task_from( 'id', $task_id ) : false;
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
