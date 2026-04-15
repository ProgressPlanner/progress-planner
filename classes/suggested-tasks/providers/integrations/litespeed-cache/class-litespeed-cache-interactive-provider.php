<?php
/**
 * Abstract class for a LiteSpeed Cache interactive task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Litespeed_Cache;

use Progress_Planner\Suggested_Tasks\Providers\Tasks_Interactive;

/**
 * Add tasks for LiteSpeed Cache configuration.
 */
abstract class Litespeed_Cache_Interactive_Provider extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 20;

	/**
	 * Get the LiteSpeed Cache option value.
	 *
	 * LiteSpeed Cache stores options as individual wp_options rows
	 * with key format: litespeed.conf.{option_key}
	 *
	 * @param string $option_key The LiteSpeed option key (e.g., 'cache', 'cache-browser').
	 *
	 * @return mixed The option value, or false if not found.
	 */
	protected function get_litespeed_option( $option_key ) {
		return \get_option( 'litespeed.conf.' . $option_key, false );
	}

	/**
	 * Update a LiteSpeed Cache option value.
	 *
	 * @param string $option_key The LiteSpeed option key (e.g., 'cache', 'cache-browser').
	 * @param mixed  $value      The value to set.
	 *
	 * @return bool Whether the option was updated.
	 */
	protected function update_litespeed_option( $option_key, $value ) {
		return \update_option( 'litespeed.conf.' . $option_key, $value );
	}
}
