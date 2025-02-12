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
class Core_Siteicon extends Local_OneTime_Tasks_Abstract {

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
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function check_task_condition() {
		$site_icon = \get_option( 'site_icon' );
		return ( '' !== $site_icon && '0' !== $site_icon ) ? true : false;
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
			'title'       => \esc_html__( 'Set site icon', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( \admin_url( 'options-general.php' ) ) : '',
			'description' => '<p>' . sprintf(
				/* translators: %s:<a href="https://prpl.fyi/set-site-icon" target="_blank">site icon</a> link */
				\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
				'<a href="https://prpl.fyi/set-site-icon" target="_blank">' . \esc_html__( 'site icon', 'progress-planner' ) . '</a>'
			) . '</p>',
		];
	}
}
