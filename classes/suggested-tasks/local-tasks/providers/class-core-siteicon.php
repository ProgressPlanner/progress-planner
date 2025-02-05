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
		if ( 0 === strpos( $task_id, $this->get_provider_id() ) && ( '' !== $site_icon && '0' !== $site_icon ) ) {
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
			'title'       => \esc_html__( 'Set site icon', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
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
