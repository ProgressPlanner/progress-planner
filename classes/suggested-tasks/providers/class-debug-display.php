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
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Disable public display of PHP errors', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return sprintf(
			// translators: %1$s is the name of the WP_DEBUG_DISPLAY constant, %2$s <a href="https://prpl.fyi/set-wp-debug" target="_blank">We recommend</a> link.
			\esc_html__( '%1$s is enabled. This means that errors are shown to users. %2$s disabling it.', 'progress-planner' ),
			'<code>WP_DEBUG_DISPLAY</code>',
			'<a href="https://prpl.fyi/set-wp-debug" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;
	}
}
