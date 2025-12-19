<?php
/**
 * Permalink has date data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Permalink has date data collector class.
 *
 * Checks if the permalink structure contains date tokens (%year%, %monthnum%, %day%).
 */
class Permalink_Has_Date extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'permalink_has_date';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		// Update cache when permalink structure changes.
		\add_action( 'update_option_permalink_structure', [ $this, 'update_cache' ] );
	}

	/**
	 * Calculate whether permalink structure contains date tokens.
	 *
	 * @return bool True if permalink structure contains date tokens.
	 */
	protected function calculate_data() {
		$permalink_structure = \get_option( 'permalink_structure', '' );

		// Check for date tokens in permalink structure.
		$date_tokens = [ '%year%', '%monthnum%', '%day%' ];

		foreach ( $date_tokens as $token ) {
			if ( false !== \strpos( $permalink_structure, $token ) ) {
				return true;
			}
		}

		return false;
	}
}
