<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\One_Time;

/**
 * Add tasks for Yoast SEO configuration.
 */
abstract class Yoast_Provider extends One_Time {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'configuration';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The task title.
	 *
	 * @var string
	 */
	protected $title;

	/**
	 * The task URL.
	 *
	 * @var string
	 */
	protected $url;

	/**
	 * The task description.
	 *
	 * @var string
	 */
	protected $description;

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	public function get_description() {
		return $this->description;
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	public function get_title() {
		return $this->title;
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	public function get_url() {
		return \esc_url( $this->url );
	}

	/**
	 * Check if the task should be added.
	 *
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	abstract public function should_add_task();

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		return [
			'task_id'     => $this->get_task_id(),
			'title'       => $this->get_title(),
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => $this->capability_required() ? \esc_url( $this->get_url() ) : '',
			'description' => '<p>' . $this->get_description() . '</p>',
		];
	}
}
