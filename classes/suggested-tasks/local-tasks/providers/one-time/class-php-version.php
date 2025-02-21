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
class Php_Version extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'php-version';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return version_compare( phpversion(), '8.0', '<' );
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
			$task_id = $this->get_task_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Update PHP version', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'description' => '<p>' . sprintf(
				/* translators: %1$s: php version, %2$s: <a href="https://prpl.fyi/update-php-version" target="_blank">We recommend</a> link */
				\esc_html__( 'Your site is running on PHP version %1$s. %2$s updating to PHP version 8.0 or higher.', 'progress-planner' ),
				phpversion(),
				'<a href="https://prpl.fyi/update-php-version" target="_blank">' . \esc_html__( 'We recommend', 'progress-planner' ) . '</a>',
			) . '</p>',
		];
	}
}
