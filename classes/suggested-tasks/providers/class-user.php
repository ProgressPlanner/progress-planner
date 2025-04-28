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
class User extends One_Time {

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

		$tasks       = [];
		$local_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		foreach ( $local_tasks as $task_data ) {
			if ( isset( $task_data['provider_id'] ) && self::PROVIDER_ID === $task_data['provider_id'] ) {
				$tasks[] = [
					'task_id'     => $task_data['task_id'],
					'provider_id' => $this->get_provider_id(),
					'category'    => $this->get_provider_category(),
					'points'      => 0,
				];
			}
		}

		return $tasks;
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		// Get the user tasks from the database.
		$local_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );

		foreach ( $local_tasks as $task ) {
			if ( $task['task_id'] !== $task_id ) {
				continue;
			}

			return wp_parse_args(
				$task,
				[
					'task_id'      => '',
					'title'        => '',
					'parent'       => 0,
					'provider_id'  => 'user',
					'category'     => 'user',
					'priority'     => 'medium',
					'points'       => 0,
					'url'          => '',
					'url_target'   => '_self',
					'description'  => '',
					'link_setting' => [],
					'dismissable'  => true,
					'snoozable'    => false,
				]
			);
		}

		return [];
	}
}
