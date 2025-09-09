<?php
/**
 * Add tasks for debug display.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks to check if WP debug display is enabled.
 */
class Debug_Display extends Tasks {

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
	protected const PROVIDER_ID = 'wp-debug-display';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/set-wp-debug';

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Disable public display of PHP errors', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @param array $task_data Optional data to include in the task.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return \sprintf(
			// translators: %s is the name of the WP_DEBUG_DISPLAY constant.
			\esc_html__( '%s is enabled. This means that errors are shown to users. We recommend disabling it.', 'progress-planner' ),
			'<code>WP_DEBUG_DISPLAY</code>',
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return \defined( 'WP_DEBUG' ) && WP_DEBUG && \defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;
	}
}
