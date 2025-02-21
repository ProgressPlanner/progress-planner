<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for settings saved.
 */
class Settings_Saved extends One_Time {

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
	const ID = 'settings-saved';

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return false === \get_option( 'progress_planner_pro_license_key', false );
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
			'title'       => \esc_html__( 'Fill settings page', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'admin.php?page=progress-planner-settings' ) ) : '',
			'description' => '<p>' . \esc_html__( 'Head over to the settings page and fill in the required information.', 'progress-planner' ) . '</p>',
		];
	}
}
