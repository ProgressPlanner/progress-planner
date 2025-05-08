<?php
/**
 * Abstract class for a task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Providers\Tasks;

/**
 * Add tasks for Yoast SEO configuration.
 */
abstract class Yoast_Provider extends Tasks {

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'configuration';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * Get the focus tasks.
	 *
	 * @return array
	 */
	public function get_focus_tasks() {
		return [];
	}
}
