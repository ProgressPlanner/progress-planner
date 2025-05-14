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
	 * Constructor.
	 */
	public function __construct() {
		// Add terms for `user` provider and category if they don't exist.
		$taxonomies = [ 'prpl_recommendations_category', 'prpl_recommendations_provider' ];
		foreach ( $taxonomies as $taxonomy ) {
			if ( ! \get_term_by( 'name', 'user', $taxonomy ) ) {
				\wp_insert_term( 'user', $taxonomy );
			}
		}
	}

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
		return \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'provider_id' => self::PROVIDER_ID ] );
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
		$task_post = \progress_planner()->get_suggested_tasks()->get_post( $task_id );
		return $task_post ? $task_post : [];
	}
}
