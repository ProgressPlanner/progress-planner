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
	 * Goes through LiteSpeed's own Conf::update_confs() rather than writing the
	 * option row directly, because saving a setting is more than a database
	 * write there: it casts the value to the option's declared type, purges the
	 * caches the change invalidates, updates the relevant cron, and refreshes
	 * LiteSpeed's in-memory config so the rest of the request sees the new
	 * value.
	 *
	 * Guest mode is the clearest example -- Conf::update_confs() clears the
	 * crawler's disabled list when `guest` changes, so writing the row on its
	 * own leaves that list stale.
	 *
	 * Falls back to a direct write when LiteSpeed's class is unavailable, which
	 * keeps this working if the plugin's internals move.
	 *
	 * @param string $option_key The LiteSpeed option key (e.g., 'cache', 'cache-browser').
	 * @param mixed  $value      The value to set.
	 *
	 * @return bool Whether the option was updated.
	 */
	protected function update_litespeed_option( $option_key, $value ) {
		$conf_class = '\LiteSpeed\Conf';

		// @phpstan-ignore-next-line function.impossibleType -- LiteSpeed is not a dependency, so PHPStan cannot see the class; class_exists() guards it at runtime.
		if ( \class_exists( $conf_class ) && \method_exists( $conf_class, 'cls' ) ) {
			$conf = $conf_class::cls();

			if ( \is_object( $conf ) && \method_exists( $conf, 'update_confs' ) ) {
				$conf->update_confs( [ $option_key => $value ] );

				// update_confs() returns nothing, so report on the stored value.
				return (int) $this->get_litespeed_option( $option_key ) === (int) $value;
			}
		}

		return \update_option( 'litespeed.conf.' . $option_key, $value );
	}
}
