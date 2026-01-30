<?php
/**
 * Remote Recommendations REST API endpoints.
 *
 * Provides complete and snooze actions for recommendations
 * via PP Server as an authenticated relay.
 *
 * Endpoints:
 * - POST /wp-json/progress-planner/v1/remote/recommendations/{id}/complete
 * - POST /wp-json/progress-planner/v1/remote/recommendations/{id}/snooze
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Remote_Recommendations class.
 *
 * @since x.x.x
 */
class Remote_Recommendations extends Remote_Base {

	/**
	 * Valid snooze durations and their corresponding day counts.
	 *
	 * @since x.x.x
	 *
	 * @var array<string, int>
	 */
	const SNOOZE_DURATIONS = [
		'1_day'   => 1,
		'3_days'  => 3,
		'1_week'  => 7,
		'2_weeks' => 14,
		'1_month' => 30,
	];

	/**
	 * Register the REST-API endpoints.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/remote/recommendations/(?P<rec_id>[a-zA-Z0-9_-]+)/complete',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'complete_recommendation' ],
					'permission_callback' => [ $this, 'check_permission' ],
					'args'                => [
						'rec_id' => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
					],
				],
			]
		);

		\register_rest_route(
			'progress-planner/v1',
			'/remote/recommendations/(?P<rec_id>[a-zA-Z0-9_-]+)/snooze',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'snooze_recommendation' ],
					'permission_callback' => [ $this, 'check_permission' ],
					'args'                => [
						'rec_id'   => [
							'required'          => true,
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'duration' => [
							'required'          => true,
							'type'              => 'string',
							'enum'              => array_keys( self::SNOOZE_DURATIONS ),
							'sanitize_callback' => 'sanitize_text_field',
						],
					],
				],
			]
		);
	}

	/**
	 * Mark a recommendation as complete.
	 *
	 * @since x.x.x
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return \WP_REST_Response
	 */
	public function complete_recommendation( $request ) {
		$rec_id = $request->get_param( 'rec_id' );
		$task   = \progress_planner()->get_suggested_tasks_db()->get_post( $rec_id );

		if ( ! $task ) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'error'   => [
						'code'    => 'recommendation_not_found',
						'message' => 'Recommendation ID does not exist',
					],
				],
				404
			);
		}

		$success = \progress_planner()->get_suggested_tasks()->mark_task_as_completed( $rec_id, null, true );

		if ( ! $success ) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'error'   => [
						'code'    => 'recommendation_not_found',
						'message' => 'Recommendation could not be completed',
					],
				],
				404
			);
		}

		return new \WP_REST_Response(
			[
				'success'        => true,
				'message'        => 'Recommendation marked as complete',
				'recommendation' => [
					'id'           => $rec_id,
					'status'       => 'completed',
					'completed_at' => \gmdate( 'c' ),
				],
			]
		);
	}

	/**
	 * Snooze a recommendation for a specified duration.
	 *
	 * @since x.x.x
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return \WP_REST_Response
	 */
	public function snooze_recommendation( $request ) {
		$rec_id   = $request->get_param( 'rec_id' );
		$duration = $request->get_param( 'duration' );

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $rec_id );

		if ( ! $task ) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'error'   => [
						'code'    => 'recommendation_not_found',
						'message' => 'Recommendation ID does not exist',
					],
				],
				404
			);
		}

		if ( ! isset( self::SNOOZE_DURATIONS[ $duration ] ) ) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'error'   => [
						'code'    => 'invalid_duration',
						'message' => 'Invalid snooze duration provided',
					],
				],
				400
			);
		}

		$days        = self::SNOOZE_DURATIONS[ $duration ];
		$future_date = \gmdate( 'Y-m-d H:i:s', \time() + ( $days * DAY_IN_SECONDS ) );

		\progress_planner()->get_suggested_tasks_db()->update_recommendation(
			$task->ID,
			[
				'post_status'   => 'future',
				'post_date'     => $future_date,
				'post_date_gmt' => $future_date,
			]
		);

		$label = \str_replace( '_', ' ', $duration );

		return new \WP_REST_Response(
			[
				'success'        => true,
				'message'        => "Recommendation snoozed for {$label}",
				'recommendation' => [
					'id'            => $rec_id,
					'status'        => 'snoozed',
					'snoozed_until' => \gmdate( 'c', \strtotime( $future_date ) ),
				],
			]
		);
	}
}
