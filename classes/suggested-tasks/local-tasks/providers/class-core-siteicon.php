<?php
/**
 * Add tasks for Core siteicon.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

/**
 * Add tasks for Core siteicon.
 */
class Core_Siteicon extends Local_Tasks_Abstract {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'core-siteicon';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'configuration';

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

		$site_icon = \get_option( 'site_icon' );
		if ( 0 === strpos( $task_id, static::ID ) && ( '' !== $site_icon && '0' !== $site_icon ) ) {
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

		$site_icon = \get_option( 'site_icon' );
		// If site icon is set, do not add the task.
		if ( '' !== $site_icon && '0' !== $site_icon ) {
			return [];
		}

		// If the task with this id is completed, don't add a task.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( static::ID ) ) {
			return [];
		}

		return [
			$this->get_task_details( static::ID ),
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
			'title'       => \esc_html__( 'Set site icon', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => static::TYPE,
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'options-general.php' ) ) : '',
			'description' => '<p>' . sprintf(
				/* translators: %s:<a href="https://progressplanner.com/recommendations/set-a-site-icon-aka-favicon/" target="_blank">site icon</a> link */
				\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
				'<a href="https://progressplanner.com/recommendations/set-a-site-icon-aka-favicon/" target="_blank">' . \esc_html__( 'site icon', 'progress-planner' ) . '</a>'
			) . '</p>',
		];
	}
}
