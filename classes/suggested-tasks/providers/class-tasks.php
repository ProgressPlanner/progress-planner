<?php
/**
 * Abstract class for a task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

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
	protected const CATEGORY = 'configuration';

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
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = false;

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
		_deprecated_function( 'Progress_Planner\Suggested_Tasks\Providers\Tasks::get_provider_type()', '1.1.1', 'get_provider_category' );
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
	 * @param array $data Optional data to include in the task ID.
	 * @return string
	 */
	public function get_task_id( $data = [] ) {
		if ( ! $this->is_repetitive() ) {
			return $this->get_provider_id();
		}

		$parts = [ $this->get_provider_id() ];

		// Add optional data parts if provided.
		if ( ! empty( $data['post_id'] ) ) {
			$parts[] = $data['post_id'];
		}

		// Always add the date as the last part.
		$parts[] = \gmdate( 'YW' );

		return implode( '-', $parts );
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
	 * Check if the task is a repetitive task.
	 *
	 * @return bool
	 */
	public function is_repetitive() {
		return $this->is_repetitive;
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
		$snoozed = \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'post_status' => 'future' ] );
		if ( empty( $snoozed ) ) {
			return false;
		}

		foreach ( $snoozed as $task ) {
			$task_object = Task_Factory::create_task_from_id( $task['task_id'] );
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

	/**
	 * Evaluate a task.
	 *
	 * @param array $task The task data.
	 *
	 * @return false|\Progress_Planner\Suggested_Tasks\Task The task data or false if the task is not completed.
	 */
	public function evaluate_task( $task ) {
		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() ) {
			return false;
		}

		if ( ! $this->is_repetitive() ) {
			if ( ! isset( $task['task_id'] ) || 0 !== strpos( $task['task_id'], $this->get_task_id() ) ) {
				return false;
			}
			return $this->is_task_completed( $task['task_id'] ) ? Task_Factory::create_task_from_id( $task['task_id'] ) : false;
		}

		$task_object = Task_Factory::create_task_from_id( $task['task_id'] );
		$task_data   = $task_object->get_data();

		if (
			$task_data['provider']->slug === $this->get_provider_id() &&
			\DateTime::createFromFormat( 'Y-m-d H:i:s', $task_data['post_date'] ) &&
			\gmdate( 'YW' ) === \gmdate( 'YW', \DateTime::createFromFormat( 'Y-m-d H:i:s', $task_data['post_date'] )->getTimestamp() ) && // @phpstan-ignore-line
			$this->is_task_completed( $task['task_id'] )
		) {
			// Allow adding more data, for example in case of 'create-post' tasks we are adding the post_id.
			$task_data = $this->modify_evaluated_task_data( $task_data );
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
	 * @param string $task_id Optional task ID to check completion for.
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		// If no specific task ID provided, use the default behavior.
		return empty( $task_id )
			? ! $this->should_add_task()
			: $this->is_specific_task_completed( $task_id );
	}

	/**
	 * Check if a specific task is completed.
	 * Child classes can override this method to handle specific task IDs.
	 *
	 * @param string $task_id The task ID to check.
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
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

		$task_data = [
			'task_id'     => $task_id,
			'provider_id' => $this->get_provider_id(),
			'category'    => $this->get_provider_category(),
			'date'        => \gmdate( 'YW' ),
			'post_title'  => $this->get_title(),
		];

		$task_data = $this->modify_injection_task_data( $task_data );

		return [
			$task_data,
		];
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
