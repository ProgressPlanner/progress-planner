<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for settings saved.
 */
class Settings_Saved extends Tasks {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'settings-saved';

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * Get the task URL.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_url( $task_data = [] ) {
		return \admin_url( 'admin.php?page=progress-planner-settings' );
	}

	/**
	 * Get the title.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_title( $task_data = [] ) {
		return \esc_html__( 'Fill settings page', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return \esc_html__( 'Head over to the settings page and fill in the required information.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return false === \get_option( 'progress_planner_pro_license_key', false );
	}
}
