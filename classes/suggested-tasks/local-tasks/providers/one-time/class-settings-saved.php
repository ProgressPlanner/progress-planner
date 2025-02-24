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
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'settings-saved';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->title = \esc_html__( 'Fill settings page', 'progress-planner' );
		$this->description = sprintf(
			/* translators: %s:<a href="https://prpl.fyi/fill-settings-page" target="_blank">settings page</a> link */
			\esc_html__( 'Head over to the settings page and fill in the required information. %s', 'progress-planner' ),
			'<a href="https://prpl.fyi/fill-settings-page" target="_blank">' . \esc_html__( 'settings page', 'progress-planner' ) . '</a>'
		);
		$this->url = \admin_url( 'admin.php?page=progress-planner-settings' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return false === \get_option( 'progress_planner_pro_license_key', false );
	}
}
