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
class Debug_Display extends Local_Tasks_Abstract {

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
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to manage options.
		if ( ! $this->capability_required() ) {
			return false;
		}

		if ( 0 === strpos( $task_id, $this->get_provider_id() ) && ( ! defined( 'WP_DEBUG_DISPLAY' ) || ! WP_DEBUG_DISPLAY ) ) {
			return $task_id;
		}
		return false;
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		return [
			'task_id'     => $this->get_provider_id(),
			'title'       => \esc_html__( 'Disable public display of PHP errors', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => static::TYPE,
			'points'      => 1,
			'url'         => '',
			// translators: %s is the name of the WP_DEBUG_DISPLAY constant.
			'description' => '<p>' . sprintf( \esc_html__( '%s is enabled. This means that errors are shown to users. We recommend disabling it.', 'progress-planner' ), '<code>WP_DEBUG_DISPLAY</code>' ) . '</p>',
		];
	}
}
