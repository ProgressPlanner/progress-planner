<?php
/**
 * Yoast SEO Premium status data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Yoast Premium status data collector class.
 *
 * Returns Yoast Premium status and workout progress for React task evaluation.
 */
class Yoast_Premium_Status extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'yoast_premium_status';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		// Update cache when Yoast Premium options change.
		\add_action( 'update_option_wpseo_premium', [ $this, 'update_cache' ] );
	}

	/**
	 * Calculate the Yoast Premium status data.
	 *
	 * @return array<string, mixed> Premium status and workout data.
	 */
	protected function calculate_data() {
		// Check if Yoast Premium is active.
		$is_premium_active = \defined( 'WPSEO_PREMIUM_FILE' ) || \class_exists( 'WPSEO_Premium' );

		$workouts = [
			'cornerstone' => [
				'finishedSteps' => [],
			],
			'orphaned'    => [
				'finishedSteps' => [],
			],
		];

		// Get workout progress from wpseo_premium option.
		$premium_options = \get_option( 'wpseo_premium', [] );
		if ( \is_array( $premium_options ) && isset( $premium_options['workouts'] ) && \is_array( $premium_options['workouts'] ) ) {
			if ( isset( $premium_options['workouts']['cornerstone']['finishedSteps'] ) ) {
				$workouts['cornerstone']['finishedSteps'] = $premium_options['workouts']['cornerstone']['finishedSteps'];
			}
			if ( isset( $premium_options['workouts']['orphaned']['finishedSteps'] ) ) {
				$workouts['orphaned']['finishedSteps'] = $premium_options['workouts']['orphaned']['finishedSteps'];
			}
		}

		return [
			'active'   => $is_premium_active,
			'workouts' => $workouts,
		];
	}
}
