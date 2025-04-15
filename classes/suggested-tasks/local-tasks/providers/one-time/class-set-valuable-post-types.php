<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for settings saved.
 */
class Set_Valuable_Post_Types extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-valuable-post-types';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url = \admin_url( 'admin.php?page=progress-planner-settings' );
	}

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'progress_planner_settings_form_options_stored', [ $this, 'remove_upgrade_option' ] );
	}

	/**
	 * Remove the upgrade option.
	 *
	 * @return void
	 */
	public function remove_upgrade_option() {
		if ( true === (bool) \get_option( 'progress_planner_upgraded_from_v1_2', false ) ) {
			\delete_option( 'progress_planner_upgraded_from_v1_2' );
		}
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Set valuable post types', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s:<a href="https://prpl.fyi/fill-settings-page" target="_blank">settings page</a> link */
			\esc_html__( 'Head over to the settings page and set the valuable post types. %s', 'progress-planner' ),
			'<a href="https://prpl.fyi/fill-settings-page" target="_blank">' . \esc_html__( 'settings page', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Check if the task should be added.
	 * We add tasks only to users who have upgraded from v1.2 and have completed the settings saved task.
	 *
	 * @return bool
	 */
	public function should_add_task() {

		// Upgraded?
		$upgraded = (bool) \get_option( 'progress_planner_upgraded_from_v1_2', false );

		// If the user has not upgraded, don't add the task.
		if ( false === $upgraded ) {
			return false;
		}

		// Check the "Settings saved" task, if the has not been added don't add the task.
		$settings_saved_task = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', 'settings-saved' );
		if ( empty( $settings_saved_task ) ) {
			return false;
		}

		// Add the task only to users who have completed the "Settings saved" task and have upgraded from v1.2.
		return 'completed' === $settings_saved_task[0]['status'];
	}

	/**
	 * Check if the task is completed.
	 * We are checking the 'is_task_completed' method only if the task was added previously.
	 * If it was and the option is not set it means that user has completed the task.
	 *
	 * @return bool
	 */
	public function is_task_completed() {
		return false === \get_option( 'progress_planner_upgraded_from_v1_2', false );
	}
}
