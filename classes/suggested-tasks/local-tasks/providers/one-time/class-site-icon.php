<?php
/**
 * Add tasks for Core siteicon.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for Core siteicon.
 */
class Site_Icon extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'core-siteicon';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->url          = \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
		$this->link_setting = [
			'hook'   => 'options-general.php',
			'iconEl' => '.site-icon-section th',
		];
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Set site icon', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s:<a href="https://prpl.fyi/set-site-icon" target="_blank">site icon</a> link */
			\esc_html__( 'Set the %s to make your website look more professional.', 'progress-planner' ),
			'<a href="https://prpl.fyi/set-site-icon" target="_blank">' . \esc_html__( 'site icon', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$site_icon = \get_option( 'site_icon' );
		return '' === $site_icon || '0' === $site_icon;
	}
}
