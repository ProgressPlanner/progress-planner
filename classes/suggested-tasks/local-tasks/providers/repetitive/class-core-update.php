<?php
/**
 * Add tasks for Core updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;
/**
 * Add tasks for Core updates.
 */
class Core_Update extends Repetitive {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	private const TYPE = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	private const ID = 'update-core';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	private const CAPABILITY = 'update_core';

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Without this \wp_get_update_data() might not return correct data for the core updates (depending on the timing).
		if ( ! function_exists( 'get_core_updates' ) ) {
			require_once ABSPATH . 'wp-admin/includes/update.php'; // @phpstan-ignore requireOnce.fileNotFound
		}
		return 0 < \wp_get_update_data()['counts']['total'];
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id ) {

		if ( ! $task_id ) {
			$task_id = $this->get_provider_id() . '-' . \gmdate( 'YW' );
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Perform all updates', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'update-core.php' ) ) : '',
			'description' => '<p>' . \esc_html__( 'Perform all updates to ensure your website is secure and up-to-date.', 'progress-planner' ) . '</p>',
		];
	}
}
