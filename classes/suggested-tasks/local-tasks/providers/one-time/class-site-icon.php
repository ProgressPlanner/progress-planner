<?php
/**
 * Add tasks for Core siteicon.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for Core siteicon.
 */
class Site_Icon extends One_Time {

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
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected $is_onboarding_task = true;

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$site_icon = \get_option( 'site_icon' );
		return '' === $site_icon || '0' === $site_icon;
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
			'task_id'      => $task_id,
			'title'        => \esc_html__( 'Set site icon', 'progress-planner' ),
			'parent'       => 0,
			'priority'     => 'high',
			'type'         => $this->get_provider_type(),
			'points'       => 1,
			'url'          => $this->capability_required() ? \esc_url( \admin_url( 'options-general.php?pp-focus-el=' . $task_id ) ) : '',
			'description'  => '<p>' . sprintf(
				/* translators: %s:<a href="https://prpl.fyi/set-site-icon" target="_blank">site icon</a> link */
				\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
				'<a href="https://prpl.fyi/set-site-icon" target="_blank">' . \esc_html__( 'site icon', 'progress-planner' ) . '</a>'
			) . '</p>',
			'link_setting' => [
				'hook'   => 'options-general.php',
				'iconEl' => '.site-icon-section th',
			],
		];
	}
}
