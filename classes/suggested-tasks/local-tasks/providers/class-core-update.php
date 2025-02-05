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
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'update-core';

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return static::ID . '-' . \gmdate( 'YW' );
	}

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

		if ( $task_data['type'] === static::ID && \gmdate( 'YW' ) === $task_data['year_week'] && 0 === \wp_get_update_data()['counts']['total'] ) {
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
	public function get_task_details( $task_id ) {

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Perform all updates', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => static::TYPE,
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'update-core.php' ) ) : '',
			'description' => '<p>' . \esc_html__( 'Perform all updates to ensure your website is secure and up-to-date.', 'progress-planner' ) . '</p>',
		];
	}
}
