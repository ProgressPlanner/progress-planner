<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for settings saved.
 */
class Php_Version extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'maintenance';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'php-version';

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
			$task_id = $this->get_provider_id();
		}

		return [
			'task_id'     => $task_id,
			'title'       => \esc_html__( 'Update PHP version', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'description' => '<p>' . sprintf(
				/* translators: %s: php version */
				\esc_html__( 'Your site is running on PHP version %s. We recommend updating to PHP version 8.0 or higher.', 'progress-planner' ),
				phpversion()
			) . '</p>',
		];
	}
}
