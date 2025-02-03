<?php
/**
 * Add tasks for Core updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;
/**
 * Add tasks for Core updates.
 */
class Core_Update extends Local_Tasks_Abstract {

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'update_core';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const TYPE = 'update-core';

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {

		// Early bail if the user does not have the capability to update the core, since \wp_get_update_data()['counts']['total'] will return 0.
		if ( ! $this->capability_required() ) {
			return false;
		}

		// Without this \wp_get_update_data() might not return correct data for the core updates (depending on the timing).
		if ( ! function_exists( 'get_core_updates' ) ) {
			require_once ABSPATH . 'wp-admin/includes/update.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		$task_object = ( new Local_Task_Factory( $task_id ) )->get_task();
		$task_data   = $task_object->get_data();

		if ( $task_data['type'] === self::TYPE && \gmdate( 'YW' ) === $task_data['year_week'] && 0 === \wp_get_update_data()['counts']['total'] ) {
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

		// Early bail if the user does not have the capability to update the core or if the task is snoozed.
		if ( true === $this->is_task_type_snoozed() || ! $this->capability_required() ) {
			return [];
		}

		// Without this \wp_get_update_data() might not return correct data for the core updates (depending on the timing).
		if ( ! function_exists( 'get_core_updates' ) ) {
			require_once ABSPATH . 'wp-admin/includes/update.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		// If all updates are performed, do not add the task.
		if ( 0 === \wp_get_update_data()['counts']['total'] ) {
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
			'title'       => \esc_html__( 'Perform all updates', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => 'maintenance',
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'update-core.php' ) ) : '',
			'description' => '<p>' . \esc_html__( 'Perform all updates to ensure your website is secure and up-to-date.', 'progress-planner' ) . '</p>',
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
			$task_object = ( new Local_Task_Factory( $task['id'] ) )->get_task();
			$task_data   = $task_object->get_data();
			if ( $task_data['type'] === self::TYPE ) {
				return true;
			}
		}

		return false;
	}
}
