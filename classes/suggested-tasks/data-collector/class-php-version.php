<?php
/**
 * PHP Version data collector.
 *
 * Returns the current PHP version for React task providers to evaluate.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * PHP Version data collector class.
 */
class PHP_Version extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'php_version';

	/**
	 * Calculate the data.
	 *
	 * Returns the current PHP version string.
	 *
	 * @return string The current PHP version.
	 */
	protected function calculate_data() {
		return \phpversion();
	}
}
