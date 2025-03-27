<?php
/**
 * Generate charts for the admin page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Render a chart.
 */
class Chart {

	/**
	 * Build a chart for the stats.
	 *
	 * @param array $args The arguments for the chart.
	 *                    See `get_chart_data` for the available parameters.
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
	 * @param array $args The arguments for the chart.
	 *                    ['items_callback'] The callback to get items.
	 *                    ['filter_results'] The callback to filter the results. Leave empty/null to skip filtering.
	 *                    ['dates_params']   The dates parameters for the query.
	 *                                    ['start_date'] The start date for the chart.
	 *                                    ['end_date']   The end date for the chart.
	 *                                    ['frequency']  The frequency for the chart nodes.
	 *                                    ['format']     The format for the label.
	 *
	 * @return array
	 */
	public function get_chart_data( $args = [] ) {
		$activities = [];

		/*
		 * Set default values for the arguments.
		 */
		$args = \wp_parse_args(
			$args,
			[
				'items_callback' => function ( $start_date, $end_date ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
					return 0;
				},
				'filter_results' => null,
				'dates_params'   => [],
				'normalized'     => false,
				'color'          => function () {
					return '#534786';
				},
				// phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
				'count_callback' => function ( $activities, $date = null ) {
					return count( $activities );
				},
				'max'            => null,
				'type'           => 'line',
			]
		);

		// Get the periods for the chart.
		$periods = \progress_planner()->get_date()->get_periods(
			$args['dates_params']['start_date'],
			$args['dates_params']['end_date'],
			$args['dates_params']['frequency']
		);

		/*
		 * "Normalized" charts decay the score of previous months activities,
		 * and add them to the current month score.
		 * This means that for "normalized" charts, we need to get activities
		 * for the month prior to the first period.
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
			$data[]                     = [
				'label' => $period_data['label'],
				'score' => $period_data['score'],
				'color' => $period_data['color'],
			];
		}

		return $data;
	}

	/**
	 * Get the data for a period.
	 *
	 * @param array $period                    The period.
	 * @param array $args                      The arguments for the chart.
	 * @param array $previous_period_activities The activities for the previous month.
	 *
	 * @return array
	 */
	public function get_period_data( $period, $args, $previous_period_activities ) {
		// Get the activities for the period.
		$activities = $args['items_callback']( $period['start_date'], $period['end_date'] );
		// Filter the results if a callback is provided.
		if ( $args['filter_results'] ) {
			$activities = $args['filter_results']( $activities );
		}

		// Calculate the score for the period.
		$period_score = $args['count_callback']( $activities, $period['start_date'] );

		// If this is a "normalized" chart, we need to calculate the score for the previous month activities.
		if ( $args['normalized'] ) {
			// Add the previous month activities to the current month score.
			$period_score += $args['count_callback']( $previous_period_activities, $period['start_date'] );
			// Update the previous month activities for the next iteration of the loop.
			$previous_period_activities = $activities;
		}

		return [
			'label'                      => $period['start_date']->format( $args['dates_params']['format'] ),
			'score'                      => null === $args['max']
				? $period_score
				: min( $period_score, $args['max'] ),
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
		new \Progress_Planner\Web_Component( 'prpl-chart-' . $type );

		echo '<prpl-chart-' . esc_attr( $type ) . ' data="' . \esc_attr( (string) \wp_json_encode( $data ) ) . '"></prpl-chart-' . esc_attr( $type ) . '>';
	}
}
