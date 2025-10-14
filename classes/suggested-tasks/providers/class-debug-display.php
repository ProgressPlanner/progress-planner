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
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = self::PRIORITY_CRITICAL + 5;

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Disable public display of PHP errors', 'progress-planner' );
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
