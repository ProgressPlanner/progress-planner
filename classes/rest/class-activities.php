<?php
/**
 * REST API endpoint for Activities data.
 *
 * Returns raw activity data needed for badge calculations.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Activities REST API endpoint class.
 */
class Activities extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/activities',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_activities' ],
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
	 * Get activities data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_activities( $request ) {
		$query = \progress_planner()->get_activities__query();

		// Get all activities (we'll filter in React).
		$activities = $query->query_activities( [] );

		// Convert activities to array format.
		$activities_data = [];
		foreach ( $activities as $activity ) {
			$activity_data = [
				'id'       => $activity->id,
				'date'     => $activity->date ? $activity->date->format( 'Y-m-d H:i:s' ) : null,
				'category' => $activity->category,
				'type'     => $activity->type,
				'data_id'  => $activity->data_id,
				'user_id'  => $activity->user_id,
			];

			// For suggested_task activities, get points.
			if ( $activity->category === 'suggested_task' ) {
				$activity_date           = $activity->date ? $activity->date : new \DateTime();
				$activity_data['points'] = $activity->get_points( $activity_date );
			}

			$activities_data[] = $activity_data;
		}

		// Get total posts count for content badges.
		$total_posts_count = 0;
		$post_types        = \progress_planner()
			->get_activities__content_helpers()
			->get_post_types_names();
		foreach ( $post_types as $post_type ) {
			$counts = \wp_count_posts( $post_type );
			if ( isset( $counts->publish ) ) {
				$total_posts_count += (int) $counts->publish;
			}
		}

		// Get activation date.
		$activation_date = \progress_planner()->get_activation_date();

		// Get config (branding, URLs).
		$branding_id       = (int) \progress_planner()->get_ui__branding()->get_branding_id();
		$remote_server_url = \progress_planner()->get_remote_server_root_url();
		$placeholder_url   = \progress_planner()->get_placeholder_svg( 200, 200 );

		// Build response data.
		$response_data = [
			'activities'      => $activities_data,
			'totalPostsCount' => $total_posts_count,
			'activationDate'  => $activation_date->format( 'Y-m-d' ),
			'config'          => [
				'brandingId'      => $branding_id,
				'remoteServerUrl' => $remote_server_url,
				'placeholderUrl'  => $placeholder_url,
			],
		];

		return new \WP_REST_Response( $response_data );
	}
}
