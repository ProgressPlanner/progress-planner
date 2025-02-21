<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Debug_Display extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'wp-debug-display';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		if ( ! $task_id ) {
			$task_id = $this->get_task_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Disable public display of PHP errors', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => '',
			'description' => '<p>' . sprintf(
				// translators: %1$s is the name of the WP_DEBUG_DISPLAY constant, %2$s <a href="https://prpl.fyi/set-wp-debug" target="_blank">We recommend</a> link.
				\esc_html__( '%1$s is enabled. This means that errors are shown to users. %2$s disabling it.', 'progress-planner' ),
				'<code>WP_DEBUG_DISPLAY</code>',
				'<a href="https://prpl.fyi/set-wp-debug" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>'
			) . '</p>',
		];
	}
}
