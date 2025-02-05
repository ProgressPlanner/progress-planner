<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks for settings saved.
 */
class Settings_Saved extends Local_Tasks_Abstract {

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

		if ( 0 === strpos( $task_id, $this->get_provider_id() ) && false !== \get_option( 'progress_planner_pro_license_key', false ) ) {
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
		if ( true === $this->is_task_type_snoozed() || ! $this->capability_required() || true === \progress_planner()->get_suggested_tasks()->was_task_completed( $this->get_provider_id() ) ) {
			return [];
		}

		$prpl_pro_license_key = \get_option( 'progress_planner_pro_license_key', false );

		if ( false !== $prpl_pro_license_key ) {
			return [];
		}

		return [
			$this->get_task_details( $this->get_provider_id() ),
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
