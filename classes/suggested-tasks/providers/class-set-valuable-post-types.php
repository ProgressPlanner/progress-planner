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
class Set_Valuable_Post_Types extends Tasks {

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
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/valuable-content';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 70;

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=progress-planner-settings' );
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
		if ( true === (bool) \get_option( 'progress_planner_set_valuable_post_types', false ) ) {
			\delete_option( 'progress_planner_set_valuable_post_types' );
		}
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set valuable content types', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Tell us which post types matter most for your site. Go to your settings and select your valuable content types.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 * We add tasks only to users who have have completed "Fill the settings page" task
	 * and have upgraded from v1.2 or have 'include_post_types' option empty.
	 * Reason being that this option was migrated,
	 * but it could be missed, and post type selection should be revisited.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$saved_posts = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => 'settings-saved' ] );
		if ( empty( $saved_posts ) ) {
			return false;
		}

		// Is the task trashed?
		$post_trashed = 'trash' === $saved_posts[0]->post_status;

		// Upgraded from <= 1.2?
		$upgraded = (bool) \get_option( 'progress_planner_set_valuable_post_types', false );

		// Include post types option empty?
		$include_post_types = \progress_planner()->get_settings()->get( 'include_post_types', [] );

		// Add the task only to users who have completed the "Settings saved" task and have upgraded from v1.2 or have 'include_post_types' option empty.
		return $post_trashed && ( true === $upgraded || empty( $include_post_types ) );
	}

	/**
	 * Check if the task is completed.
	 * We are checking the 'is_task_completed' method only if the task was added previously.
	 * If it was and the option is not set it means that user has completed the task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return false === \get_option( 'progress_planner_set_valuable_post_types', false );
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$actions[] = [
			'priority' => 10,
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'admin.php?page=progress-planner-settings' ) . '" target="_self">' . \esc_html__( 'Go to the settings page', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
