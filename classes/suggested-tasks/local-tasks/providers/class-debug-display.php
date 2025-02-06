<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks to check if WP debug is enabled.
 */
class Debug_Display extends Local_OneTime_Tasks_Abstract {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'wp-debug-display';

	/**
	 * Check if the task condition is met.
	 *
	 * @return bool
	 */
	public function check_task_condition() {
		return ( ! defined( 'WP_DEBUG_DISPLAY' ) || ! WP_DEBUG_DISPLAY ) ? true : false;
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
			$task_id = $this->get_provider_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Disable public display of PHP errors', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => '',
			// translators: %s is the name of the WP_DEBUG_DISPLAY constant.
			'description' => '<p>' . sprintf( \esc_html__( '%s is enabled. This means that errors are shown to users. We recommend disabling it.', 'progress-planner' ), '<code>WP_DEBUG_DISPLAY</code>' ) . '</p>',
		];
	}
}
