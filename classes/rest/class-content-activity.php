<?php
/**
 * REST API endpoint for Content Activity widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Content_Activity REST API endpoint class.
 */
class Content_Activity extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/content-activity',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_content_activity' ],
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
	 * Get content activity data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_content_activity( $request ) {
		$widget = \progress_planner()->get_admin__widgets__content_activity();

		// Activity types configuration.
		$activity_types = [
			'publish' => [
				'label' => \__( 'published', 'progress-planner' ),
				'color' => 'var(--prpl-color-monthly)',
			],
			'update'  => [
				'label' => \__( 'updated', 'progress-planner' ),
				'color' => 'var(--prpl-graph-color-3)',
			],
			'delete'  => [
				'label' => \__( 'deleted', 'progress-planner' ),
				'color' => 'var(--prpl-color-headings)',
			],
		];

		$tracked_post_types = \progress_planner()->get_activities__content_helpers()->get_post_types_names();

		// Prepare chart data and options.
		$chart_data    = [];
		$chart_options = [
			'dataArgs'     => [],
			'chartId'      => 'prpl-chart-content-activity',
			'axisColor'    => 'var(--prpl-color-border)',
			'rulersColor'  => 'var(--prpl-color-border)',
			'filtersLabel' => '<strong>' . \__( 'show:', 'progress-planner' ) . '</strong>',
		];

		foreach ( $activity_types as $activity_type => $activity_data ) {
			$chart_data[ $activity_type ] = \progress_planner()
				->get_ui__chart()
				->get_chart_data(
					$widget->get_chart_args_content_count(
						$activity_type,
						$activity_data['color']
					)
				);

			$chart_options['dataArgs'][ $activity_type ] = [
				'color' => $activity_data['color'],
				'label' => $activity_data['label'],
			];
		}

		// Calculate weekly activity counts.
		$weekly_activity = [];
		$weekly_total    = 0;

		foreach ( \array_keys( $activity_types ) as $activity_type ) {
			$weekly_activity[ $activity_type ] = 0;

			$activities = \progress_planner()->get_activities__query()->query_activities(
				[
					'category'   => 'content',
					'start_date' => \gmdate( 'Y-m-d', \strtotime( '-1 week' ) ),
					'end_date'   => \gmdate( 'Y-m-d' ),
					'type'       => $activity_type,
				]
			);

			if ( $activities ) {
				if ( 'delete' !== $activity_type ) {
					// Filter to only include tracked post types.
					$activities = \array_filter(
						$activities,
						fn( $activity ) => \in_array(
							\get_post_type( $activity->data_id ),
							$tracked_post_types,
							true
						)
					);
				}

				$weekly_activity[ $activity_type ] = \count( $activities );
			}

			$weekly_total += $weekly_activity[ $activity_type ];
		}

		// Response data.
		$response_data = [
			'chartData'        => $chart_data,
			'chartOptions'     => $chart_options,
			'activityTypes'    => $activity_types,
			'weeklyActivity'   => $weekly_activity,
			'weeklyTotalCount' => $weekly_total,
			'totalCount'       => \number_format_i18n( $weekly_total ),
			'i18n'             => [
				'title'                  => \__( 'Content activity', 'progress-planner' ),
				'description'            => \__( 'Here are the updates you made to your content last week. Whether you published something new, updated an existing post, or removed outdated content, it all helps you stay on top of your site!', 'progress-planner' ),
				'piecesOfContentManaged' => \__( 'pieces of content managed', 'progress-planner' ),
				'contentManaged'         => \__( 'Content managed', 'progress-planner' ),
				'lastWeek'               => \__( 'Last week', 'progress-planner' ),
				'total'                  => \__( 'Total', 'progress-planner' ),
				'show'                   => \__( 'show:', 'progress-planner' ),
			],
		];

		return new \WP_REST_Response( $response_data );
	}
}
