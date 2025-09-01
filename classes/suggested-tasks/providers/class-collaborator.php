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
class Collaborator extends Tasks {

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
	protected const CATEGORY = 'collaborator';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'collaborator';

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
		// We don't need to inject tasks for this provider.
		return [];
	}

	/**
	 * Check if a specific task is completed.
	 * Child classes can override this method to handle specific task IDs.
	 *
	 * @param string $task_id The task ID to check.
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
		if ( empty( $tasks ) ) {
			return false;
		}

		$task_data = $tasks[0]->get_data();

		return isset( $task_data['is_completed_callback'] ) && \is_callable( $task_data['is_completed_callback'] )
			? \call_user_func( $task_data['is_completed_callback'], $task_id )
			: false;
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		foreach ( $tasks as $task ) {
			if ( $task['task_id'] !== $task_data['task_id'] ) {
				continue;
			}

			return \wp_parse_args(
				$task,
				[
					'task_id'           => '',
					'title'             => '',
					'parent'            => 0,
					'provider_id'       => $this->get_provider_id(),
					'category'          => $this->get_provider_category(),
					'priority'          => 'medium',
					'points'            => 0,
					'url'               => '',
					'url_target'        => '_self',
					'description'       => '',
					'link_setting'      => [],
					'dismissable'       => true,
					'snoozable'         => false,
					'external_link_url' => $this->get_external_link_url(),
					'actions'           => $this->get_task_actions(),
				]
			);
		}

		return [];
	}
}
