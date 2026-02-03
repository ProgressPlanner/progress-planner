<?php
/**
 * WP Debug data collector.
 *
 * Returns WordPress debug settings for React task providers to evaluate.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * WP Debug data collector class.
 */
class WP_Debug extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'wp_debug_status';

	/**
	 * Calculate the data.
	 *
	 * Returns an object with debug status information.
	 *
	 * @return array{wp_debug: bool, wp_debug_display: bool, should_fix: bool} Debug status data.
	 */
	protected function calculate_data() {
		$wp_debug         = \defined( 'WP_DEBUG' ) && WP_DEBUG;
		$wp_debug_display = \defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;

		return [
			'wp_debug'         => $wp_debug,
			'wp_debug_display' => $wp_debug_display,
			'should_fix'       => $wp_debug && $wp_debug_display,
		];
	}
}
