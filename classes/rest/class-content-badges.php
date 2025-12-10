<?php
/**
 * REST API endpoint for Content Badges widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Content_Badges REST API endpoint class.
 */
class Content_Badges extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/content-badges',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_content_badges' ],
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
	 * Get content badges data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_content_badges( $request ) {
		$widget = \progress_planner()->get_admin__widgets__badge_streak_content();

		// Get the current badge in progress.
		$current_badge_obj  = $widget->get_details( 'content' );
		$current_badge_data = null;

		if ( $current_badge_obj ) {
			$progress           = $current_badge_obj->get_progress();
			$current_badge_data = [
				'id'         => $current_badge_obj->get_id(),
				'name'       => $current_badge_obj->get_name(),
				'background' => $current_badge_obj->get_background(),
				'progress'   => $progress['progress'],
				'remaining'  => $progress['remaining'],
			];
		}

		// Get all content badges.
		$all_badges      = \progress_planner()->get_badges()->get_badges( 'content' );
		$all_badges_data = [];

		foreach ( $all_badges as $badge ) {
			$progress          = $badge->get_progress();
			$all_badges_data[] = [
				'id'         => $badge->get_id(),
				'name'       => $badge->get_name(),
				'progress'   => $progress['progress'],
				'isComplete' => 100 === (int) $progress['progress'],
			];
		}

		// Build response data.
		$response_data = [
			'currentBadge'    => $current_badge_data,
			'allBadges'       => $all_badges_data,
			'brandingId'      => (int) \progress_planner()->get_ui__branding()->get_branding_id(),
			'remoteServerUrl' => \progress_planner()->get_remote_server_root_url(),
			'placeholderUrl'  => \progress_planner()->get_placeholder_svg( 200, 200 ),
		];

		return new \WP_REST_Response( $response_data );
	}
}
