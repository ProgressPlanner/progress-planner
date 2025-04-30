<?php
/**
 * Add tasks for PHP version.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\One_Time;

use Progress_Planner\Suggested_Tasks\Providers\One_Time;

/**
 * Add tasks for PHP version.
 */
class Php_Version extends One_Time {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'php-version';

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	public function get_title() {
		return \esc_html__( 'Update PHP version', 'progress-planner' );
	}

	/**
	 * Get the description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %1$s: php version, %2$s: <a href="https://prpl.fyi/update-php-version" target="_blank">We recommend</a> link */
			\esc_html__( 'Your site is running on PHP version %1$s. %2$s updating to PHP version 8.0 or higher.', 'progress-planner' ),
			phpversion(),
			'<a href="https://prpl.fyi/update-php-version" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return version_compare( phpversion(), '8.0', '<' );
	}
}
