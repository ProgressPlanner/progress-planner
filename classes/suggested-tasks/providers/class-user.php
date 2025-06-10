<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for content updates.
 */
class User extends Tasks {

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * Whether the task is snoozable.
	 *
	 * @var bool
	 */
	protected $is_snoozable = false;

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'user';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'user';

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return true;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		return [];
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data Optional data to include in the task.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		// Get the user tasks from the database.
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] );
		return $task_post ? $task_post->get_data() : [];
	}
}
