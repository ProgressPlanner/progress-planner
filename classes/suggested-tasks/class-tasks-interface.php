<?php
/**
 * Interface for tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks;

/**
 * Tasks interface.
 */
interface Tasks_Interface {

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init();

	/**
	 * Get the points.
	 *
	 * @return int
	 */
	public function get_points();

	/**
	 * Get tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject();

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function evaluate_task( $task_id );

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' );

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_data_from_task_id( $task_id );

	/**
	 * Get the provider category.
	 *
	 * @return string
	 */
	public function get_provider_category();

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id();

	/**
	 * Check if the user has the capability to perform the task.
	 *
	 * @return bool
	 */
	public function capability_required();

	/**
	 * Check if the task is still relevant.
	 * For example, we have a task to disable author archives if there is only one author.
	 * If in the meantime more authors are added, the task is no longer relevant and the task should be removed.
	 *
	 * @return bool
	 */
	public function is_task_relevant();
}
