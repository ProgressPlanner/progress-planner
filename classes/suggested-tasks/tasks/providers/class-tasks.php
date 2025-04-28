<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Tasks_Interface;
use Progress_Planner\Suggested_Tasks\Task_Factory;

/**
 * Add tasks for content updates.
 */
abstract class Tasks implements Tasks_Interface {

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
	 * The task points.
	 *
	 * @var int
	 */
	protected $points = 1;

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
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = false;

	/**
	 * The task URL.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * The task URL target.
	 *
	 * @var string
	 */
	protected $url_target = '_self';

	/**
	 * The task link setting.
	 *
	 * @var array
	 */
	protected $link_setting;

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	public function get_title() {
		return '';
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	public function get_description() {
		return '';
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
	 * Get whether the task is dismissable.
	 *
	 * @return bool
	 */
	public function is_dismissable() {
		return $this->is_dismissable;
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
	 * Get the task URL.
	 *
	 * @return string
	 */
	public function get_url_target() {
		return $this->url_target ? $this->url_target : '_self';
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
	 * Alias for get_provider_category(), to provide backwards compatibility.
	 *
	 * @return string
	 */
	public function get_provider_type() {
		_deprecated_function( 'Progress_Planner\Suggested_Tasks\Tasks\Providers\Tasks::get_provider_type()', '1.1.1', 'get_provider_category' );
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
		$snoozed = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'status', 'snoozed' );
		if ( empty( $snoozed ) ) {
			return false;
		}

		foreach ( $snoozed as $task ) {
			$task_object = Task_Factory::create_task_from( 'id', $task['task_id'] );
			$provider_id = $task_object->get_provider_id();

			if ( $provider_id === $this->get_provider_id() ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant() {
		return true;
	}
}
