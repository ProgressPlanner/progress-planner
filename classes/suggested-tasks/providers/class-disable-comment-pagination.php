<?php
/**
 * Add tasks for disabling comments.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks to disable comments.
 */
class Disable_Comment_Pagination extends Tasks {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'disable-comment-pagination';

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-discussion.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-discussion.php',
			'iconEl' => 'label[for="page_comments"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Disable comment pagination', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Disable comment pagination', 'progress-planner' );
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return $this->are_dependencies_satisfied() && \get_option( 'page_comments' );
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return ! \get_option( 'page_comments' );
	}
}
