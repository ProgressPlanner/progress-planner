<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks;

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
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'configuration';

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
	 * @return string
	 */
	public function get_description() {
		return $this->description;
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
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() || 0 !== strpos( $task_id, $this->get_task_id() ) ) {
			return false;
		}

		return $this->is_task_completed() ? $task_id : false;
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
			true === $this->is_task_type_snoozed() ||
			! $this->should_add_task() || // No need to add the task.
			true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_task_id() )
		) {
			return [];
		}

		return [
			$this->get_task_details( $this->get_task_id() ),
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
			'title'        => $this->get_title(),
			'parent'       => $this->get_parent(),
			'priority'     => $this->get_priority(),
			'type'         => $this->get_provider_type(),
			'points'       => 1,
			'url'          => $this->capability_required() ? \esc_url( $this->get_url() ) : '',
			'description'  => '<p>' . $this->get_description() . '</p>',
			'link_setting' => $this->get_link_setting(),
			'dismissable'  => $this->is_dismissable(),
		];
	}
}
