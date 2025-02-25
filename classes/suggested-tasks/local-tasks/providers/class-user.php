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
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		// Get the user tasks from the database.
		$user_tasks = \progress_planner()->get_settings()->get( 'user_tasks', [] );

		if ( ! isset( $user_tasks[ $task_id ] ) ) {
			return [];
		}

		return wp_parse_args(
			$user_tasks[ $task_id ],
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
			]
		);
	}
}
