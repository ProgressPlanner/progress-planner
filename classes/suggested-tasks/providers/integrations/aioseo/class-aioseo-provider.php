<?php
/**
 * Abstract class for a task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO;

use Progress_Planner\Suggested_Tasks\Providers\Tasks;

/**
 * Add tasks for All in One SEO configuration.
 */
abstract class AIOSEO_Provider extends Tasks {

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
}
