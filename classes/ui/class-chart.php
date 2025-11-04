<?php
/**
 * Generate charts for the admin page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\UI;

/**
 * Render a chart.
 */
class Chart {

	/**
	 * Build a chart for the stats.
	 *
	 * @param array $args {
	 *     The arguments for the chart. See `get_chart_data` for all available parameters.
	 *
	 *     @type string $type Chart type (e.g., 'line', 'bar').
	 * }
	 *
	 * @return void
	 */
	public function the_chart( $args = [] ) {
		// Render the chart.
		$this->render_chart( $args['type'], $this->get_chart_data( $args ) );
	}

	/**
	 * Get data for the chart.
	 *
	 * Normalized charts:
	 * When $args['normalized'] is true, the chart implements a "decay" algorithm that carries
	 * forward previous period's activities into the current period with decaying values.
	 * This creates a rolling momentum effect where past activities continue to contribute
	 * to current scores, gradually diminishing over time.
	 *
	 * Example: If a user published 10 posts in January, the normalized chart for February
	 * will include both February's new posts plus a decayed value from January's posts.
	 * This encourages consistent activity by showing how past work continues to have impact.
	 *
	 * @param array $args {
	 *     The arguments for the chart.
	 *
	 *     @type callable $items_callback  Callback to fetch items for a date range.
	 *                                     Signature: function( DateTime $start_date, DateTime $end_date ): array
	 *     @type callable|null $filter_results Optional callback to filter results after fetching.
	 *                                         Signature: function( array $activities ): array
	 *     @type array    $dates_params    {
	 *         Date range and frequency parameters.
	 *
	 *         @type DateTime $start_date The start date for the chart.
	 *         @type DateTime $end_date   The end date for the chart.
	 *         @type string   $frequency  The frequency for chart nodes (e.g., 'day', 'week', 'month').
	 *         @type string   $format     The label format (e.g., 'Y-m-d', 'M j').
	 *     }
	 *     @type bool     $normalized     Whether to use normalized scoring with decay from previous periods.
	 *                                    Default false.
	 *     @type callable $color          Callback to determine bar/line color.
	 *                                    Signature: function(): string (hex color code)
	 *     @type callable $count_callback Callback to calculate score from activities.
	 *                                    Signature: function( array $activities, DateTime|null $date ): int|float
	 *     @type int|null $max            Optional maximum value for chart scaling.
	 *     @type string   $type           Chart type: 'line' or 'bar'. Default 'line'.
	 *     @type array    $return_data    Which data fields to return in output.
	 *                                    Default ['label', 'score', 'color'].
	 * }
	 *
	 * @return array Array of chart data points, each containing requested fields (label, score, color, etc).
	 */
	public function get_chart_data( $args = [] ) {
		$activities = [];

		// Set default values for the arguments.
		$args = \wp_parse_args(
			$args,
			[
				'items_callback' => fn( $start_date, $end_date ) => 0, // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
				'filter_results' => null,
				'dates_params'   => [],
				'normalized'     => false,
				'color'          => fn() => '#534786',
				// phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
				'count_callback' => fn( $activities, $date = null ) => \count( $activities ),
				'max'            => null,
				'type'           => 'line',
				'return_data'    => [ 'label', 'score', 'color' ],
			]
		);

		// Get the periods for the chart (e.g., months, weeks, days based on frequency).
		$periods = \progress_planner()->get_utils__date()->get_periods(
			$args['dates_params']['start_date'],
			$args['dates_params']['end_date'],
			$args['dates_params']['frequency']
		);

		/*
		 * For "normalized" charts, implement a decay algorithm:
		 * - Previous period's activities "decay" and carry forward into current period
		 * - This creates momentum: past productivity continues to boost current scores
		 * - We need to fetch activities from the month BEFORE the chart starts
		 * - These previous activities will be added (with decay) to the first period's score
		 *
		 * Example: For a chart starting Feb 1, fetch Jan 1-31 activities to contribute
		 * to February's normalized score.
		 */
		$previous_period_activities = [];
		if ( $args['normalized'] ) {
			$previous_month_start       = ( clone $periods[0]['start_date'] )->modify( '-1 month' );
			$previous_month_end         = ( clone $periods[0]['start_date'] )->modify( '-1 day' );
			$previous_period_activities = $args['items_callback']( $previous_month_start, $previous_month_end );
			if ( $args['filter_results'] ) {
				$activities = $args['filter_results']( $activities );
			}
		}

		$data = [];

		// Loop through the periods and calculate the score for each period.
		foreach ( $periods as $period ) {
			$period_data                = $this->get_period_data( $period, $args, $previous_period_activities );
			$previous_period_activities = $period_data['previous_period_activities'];
			$period_data_filtered       = [];
			foreach ( $args['return_data'] as $key ) {
				$key_string                          = (string) $key; // @phpstan-ignore offsetAccess.invalidOffset
				$period_data_filtered[ $key_string ] = $period_data[ $key_string ]; // @phpstan-ignore offsetAccess.invalidOffset
			}
			$data[] = $period_data_filtered;
		}

		return $data;
	}

	/**
	 * Get the data for a single period in the chart.
	 *
	 * For normalized charts, this implements the decay algorithm:
	 * 1. Calculate score from current period's activities (normal scoring)
	 * 2. Add decayed score from previous period's activities (normalized bonus)
	 * 3. Save current activities to decay into next period
	 *
	 * The decay is handled by the count_callback, which typically reduces scores
	 * based on how old the activities are relative to the current period.
	 *
	 * @param array $period {
	 *     The time period being processed.
	 *
	 *     @type DateTime $start_date Period start date.
	 *     @type DateTime $end_date   Period end date.
	 *     @type string   $label      Human-readable label for this period.
	 * }
	 * @param array $args                       The chart arguments (see get_chart_data).
	 * @param array $previous_period_activities Activities from the previous period to apply decay to.
	 *
	 * @return array {
	 *     Period data with score and metadata.
	 *
	 *     @type string      $label                      Period label (e.g., "Jan 2025").
	 *     @type int|float   $score                      Calculated score for this period.
	 *     @type string      $color                      Color for this data point.
	 *     @type array       $previous_period_activities Activities to carry forward to next period.
	 * }
	 */
	public function get_period_data( $period, $args, $previous_period_activities ) {
		// Get the activities for the current period.
		$activities = $args['items_callback']( $period['start_date'], $period['end_date'] );

		// Apply optional filtering callback.
		if ( $args['filter_results'] ) {
			$activities = $args['filter_results']( $activities );
		}

		// Calculate the base score from current period's activities.
		$period_score = $args['count_callback']( $activities, $period['start_date'] );

		// For normalized charts, apply decay algorithm.
		if ( $args['normalized'] ) {
			// Add decayed score from previous period's activities to current score.
			// The count_callback determines the decay rate based on activity age.
			$period_score += $args['count_callback']( $previous_period_activities, $period['start_date'] );

			// Save current activities to decay into the next period.
			// This creates a rolling momentum effect across time periods.
			$previous_period_activities = $activities;
		}

		return [
			'label'                      => $period['start_date']->format( $args['dates_params']['format'] ),
			'score'                      => null === $args['max']
				? $period_score
				: \min( $period_score, $args['max'] ),
			'color'                      => $args['color']( $period_score, $period['start_date'] ),
			'previous_period_activities' => $previous_period_activities,
		];
	}

	/**
	 * Render the charts.
	 *
	 * @param string $type The type of chart.
	 * @param array  $data The data for the chart.
	 *
	 * @return void
	 */
	public function render_chart( $type, $data ) {
		$type = $type ? $type : 'line';
		echo '<prpl-chart-' . \esc_attr( $type ) . ' data="' . \esc_attr( (string) \wp_json_encode( $data ) ) . '"></prpl-chart-' . \esc_attr( $type ) . '>';
	}
}
