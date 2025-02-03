<?php
/**
 * Abstract class for a local task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Local_Tasks_Interface;

/**
 * Add tasks for content updates.
 */
abstract class Local_Tasks_Abstract implements Local_Tasks_Interface {

	const TYPE = '';
	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected $capability = 'manage_options';

	/**
	 * Get the provider ID.
	 *
	 * @return string
	 */
	public function get_provider_type() {
		return self::TYPE;
	}

	/**
	 * Check if the user has the capability to perform the task.
	 *
	 * @return bool
	 */
	public function capability_required() {
		return $this->capability
			? \current_user_can( $this->capability )
			: true;
	}
}
