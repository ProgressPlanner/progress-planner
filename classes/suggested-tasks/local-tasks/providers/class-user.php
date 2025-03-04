<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks for content updates.
 */
class User extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'user';

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
			if ( 'user' === $task_data['type'] ) {
				$tasks[] = $this->get_task_details( $task_data['task_id'] );
			}
		}

		return array_filter( $tasks );
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
					'type'         => 'user',
					'priority'     => 'medium',
					'points'       => 0,
					'url'          => '',
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
