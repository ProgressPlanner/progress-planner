<?php
/**
 * REST API endpoint for Activity Scores widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest\Widgets;

use Progress_Planner\Rest\Base;
use Progress_Planner\Base as Plugin_Base;
use Progress_Planner\Goals\Goal_Recurring;
use Progress_Planner\Goals\Goal;

/**
 * Activity_Scores REST API endpoint class.
 */
class Activity_Scores extends Base {

	/**
	 * The cache key.
	 *
	 * @var string
	 */
	private const CACHE_KEY = 'activities_weekly_post_record';

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/widgets/activity-scores',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_activity_scores' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'range'     => [
							'type'              => 'string',
							'default'           => '-6 months',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'frequency' => [
							'type'              => 'string',
							'default'           => 'monthly',
							'sanitize_callback' => 'sanitize_text_field',
						],
					],
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
		$range     = $request->get_param( 'range' ) ?? '-6 months';
		$frequency = $request->get_param( 'frequency' ) ?? 'monthly';

		$score     = $this->get_score();
		$record    = $this->personal_record_callback();
		$checklist = $this->get_checklist_results();

		// Get chart data.
		$chart      = \progress_planner()->get_ui__chart();
		$start_date = \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) )->modify( $range );
		$end_date   = new \DateTime();

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
					'start_date' => $start_date,
					'end_date'   => $end_date,
					'frequency'  => $frequency,
					'format'     => 'M',
				],
				'count_callback' => fn( $activities, $date ) => \array_sum( \array_map( fn( $activity ) => $activity->get_points( $date ), $activities ) ) * 100 / Plugin_Base::SCORE_TARGET,
				'normalized'     => true,
				'max'            => 100,
				'return_data'    => [ 'label', 'score' ], // Don't return color - that's presentation logic.
			]
		);

		// Build response data.
		$response_data = [
			'score'          => $score,
			'chartData'      => $chart_data,
			'personalRecord' => [
				'maxStreak'     => (int) $record['max_streak'],
				'currentStreak' => (int) $record['current_streak'],
			],
			'checklist'      => $checklist,
		];

		return new \WP_REST_Response( $response_data );
	}

	/**
	 * Get the score.
	 *
	 * @return int The score.
	 */
	private function get_score() {
		$activities = \progress_planner()->get_activities__query()->query_activities(
			// Use 31 days to take into account the activities score decay from previous activities.
			[ 'start_date' => new \DateTime( '-31 days' ) ]
		);

		$score        = 0;
		$current_date = new \DateTime();
		foreach ( $activities as $activity ) {
			$score += $activity->get_points( $current_date );
		}
		$score = \min( 100, \max( 0, $score ) );

		// Get the number of pending updates.
		$pending_updates = \wp_get_update_data()['counts']['total'];

		// Reduce points for pending updates.
		$score -= \min( \min( $score / 2, 25 ), $pending_updates * 5 );
		return (int) \floor( $score );
	}

	/**
	 * Get the checklist results.
	 *
	 * @return array<string, bool> The checklist results.
	 */
	private function get_checklist_results() {
		$items   = $this->get_checklist();
		$results = [];
		foreach ( $items as $item ) {
			$label             = (string) $item['label']; // @phpstan-ignore offsetAccess.invalidOffset
			$results[ $label ] = $item['callback'](); // @phpstan-ignore offsetAccess.invalidOffset
		}
		return $results;
	}

	/**
	 * Get the checklist items.
	 *
	 * @return array The checklist items.
	 */
	private function get_checklist() {
		return [
			[
				'label'    => \esc_html__( 'published content', 'progress-planner' ),
				'callback' => fn() => \count(
					\progress_planner()->get_activities__query()->query_activities(
						[
							'start_date' => new \DateTime( '-7 days' ),
							'category'   => 'content',
							'type'       => 'publish',
						]
					)
				) > 0,
			],
			[
				'label'    => \esc_html__( 'updated content', 'progress-planner' ),
				'callback' => fn() => \count(
					\progress_planner()->get_activities__query()->query_activities(
						[
							'start_date' => new \DateTime( '-7 days' ),
							'category'   => 'content',
							'type'       => 'update',
						]
					)
				) > 0,
			],
			[
				'label'    => 0 === \wp_get_update_data()['counts']['total']
					? \esc_html__( 'performed all updates', 'progress-planner' )
					: '<a href="' . \esc_url( \admin_url( 'update-core.php' ) ) . '">' . \esc_html__( 'Perform all updates', 'progress-planner' ) . '</a>',
				'callback' => fn() => ! \wp_get_update_data()['counts']['total'],
			],
		];
	}

	/**
	 * Get the personal record goal.
	 *
	 * @return array
	 */
	private function personal_record_callback() {
		$goal = Goal_Recurring::get_instance(
			'weekly_post_record',
			[
				'class_name'  => Goal::class,
				'id'          => 'weekly_post',
				'title'       => \esc_html__( 'Write a weekly blog post', 'progress-planner' ),
				'description' => \esc_html__( 'Streak: The number of weeks this goal has been accomplished consistently.', 'progress-planner' ),
				'status'      => 'active',
				'priority'    => 'low',
				'evaluate'    => function ( $goal_object ) {
					// Get the cached activities.
					$cached_activities = \progress_planner()->get_settings()->get( self::CACHE_KEY, [] );

					// Get the weekly cache key.
					$weekly_cache_key = $goal_object->get_details()['start_date']->format( 'Y-m-d' ) . '_' . $goal_object->get_details()['end_date']->format( 'Y-m-d' );

					// If the cache is set, return the cached value.
					if ( isset( $cached_activities[ $weekly_cache_key ] ) ) {
						return (bool) $cached_activities[ $weekly_cache_key ];
					}

					// Get the activities.
					$activities = \progress_planner()->get_activities__query()->query_activities(
						[
							'category'   => 'content',
							'type'       => 'publish',
							'start_date' => $goal_object->get_details()['start_date'],
							'end_date'   => $goal_object->get_details()['end_date'],
						]
					);

					// Cache the activities.
					$cached_activities[ $weekly_cache_key ] = (bool) \count( $activities );
					\progress_planner()->get_settings()->set( self::CACHE_KEY, $cached_activities );

					// Return the cached value.
					return $cached_activities[ $weekly_cache_key ];
				},
			],
			[
				'frequency'     => 'weekly',
				'start_date'    => \progress_planner()->get_activation_date(),
				'end_date'      => new \DateTime(), // Today.
				'allowed_break' => 0, // Do not allow breaks in the streak.
			]
		);

		return $goal->get_streak();
	}
}
