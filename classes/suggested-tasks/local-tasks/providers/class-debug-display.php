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
	 * The provider ID.
	 *
	 * @var string
	 */
	const TYPE = 'wp-debug-display';

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

		if ( 0 === strpos( $task_id, self::TYPE ) && defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY ) {
			return $task_id;
		}
		return false;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		// Early bail if the user does not have the capability to manage options or if the task is snoozed.
		if ( true === $this->is_task_type_snoozed() || ! $this->capability_required() ) {
			return [];
		}

		if ( ! defined( 'WP_DEBUG_DISPLAY' ) || ! WP_DEBUG_DISPLAY ) {
			return [];
		}

		$task_id = self::TYPE . '-' . \gmdate( 'YW' );

		// If the task with this id is completed, don't add a task.
		if ( true === \progress_planner()->get_suggested_tasks()->check_task_condition(
			[
				'type'    => 'completed',
				'task_id' => $task_id,
			]
		) ) {
			return [];
		}

		return [
			$this->get_task_details( self::TYPE . '-' . \gmdate( 'YW' ) ),
		];
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id ) {

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Disable public display of PHP errors', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => 'maintenance',
			'points'      => 1,
			'url'         => '',
			'description' => '<p>' . sprintf( \esc_html__( '%s is enabled. This means that errors are shown to users. We recommend disabling it.', 'progress-planner' ), '<code>WP_DEBUG_DISPLAY</code>' ) . '</p>',
		];
	}

	/**
	 * Get the data from a task-ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array The data.
	 */
	public function get_data_from_task_id( $task_id ) {
		$data = [
			'type' => self::TYPE,
			'id'   => $task_id,
		];

		return $data;
	}

	/**
	 * Check if a task type is snoozed.
	 *
	 * @return bool
	 */
	public function is_task_type_snoozed() {
		$snoozed = \progress_planner()->get_suggested_tasks()->get_snoozed_tasks();
		if ( ! \is_array( $snoozed ) || empty( $snoozed ) ) {
			return false;
		}

		foreach ( $snoozed as $task ) {
			if ( self::TYPE === $task['id'] ) {
				return true;
			}
		}

		return false;
	}
}
