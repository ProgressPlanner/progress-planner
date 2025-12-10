<?php
/**
 * REST API endpoint for Activity Scores widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

use Progress_Planner\Base;

/**
 * Activity_Scores REST API endpoint class.
 */
class Activity_Scores extends \Progress_Planner\Rest\Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/activity-scores',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_activity_scores' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);
	}

	/**
	 * Check if the current user has permission to access this endpoint.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return \current_user_can( 'edit_posts' );
	}

	/**
	 * Get activity scores data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_activity_scores( $request ) {
		$widget = \progress_planner()->get_admin__widgets__activity_scores();
		$record = $widget->personal_record_callback();
		$score  = $widget->get_score();

		// Get chart data.
		$chart      = \progress_planner()->get_ui__chart();
		$chart_data = $chart->get_chart_data(
			[
				'type'           => 'bar',
				'items_callback' => fn( $start_date, $end_date ) => \progress_planner()->get_activities__query()->query_activities(
					[
						'start_date' => $start_date,
						'end_date'   => $end_date,
					]
				),
				'dates_params'   => [
					'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( $widget->get_range() ),
					'end_date'   => new \DateTime(),
					'frequency'  => $widget->get_frequency(),
					'format'     => 'M',
				],
				'count_callback' => fn( $activities, $date ) => \array_sum( \array_map( fn( $activity ) => $activity->get_points( $date ), $activities ) ) * 100 / Base::SCORE_TARGET,
				'normalized'     => true,
				'color'          => [ $widget, 'get_color' ],
				'max'            => 100,
			]
		);

		// Build response data.
		$response_data = [
			'score'          => $score,
			'gaugeColor'     => $widget->get_gauge_color( $score ),
			'chartData'      => $chart_data,
			'personalRecord' => [
				'maxStreak'     => (int) $record['max_streak'],
				'currentStreak' => (int) $record['current_streak'],
			],
		];

		return new \WP_REST_Response( $response_data );
	}
}
