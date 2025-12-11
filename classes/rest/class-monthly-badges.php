<?php
/**
 * REST API endpoint for Monthly Badges widget.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

use Progress_Planner\Badges\Monthly;

/**
 * Monthly_Badges REST API endpoint class.
 */
class Monthly_Badges extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/monthly-badges',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_monthly_badges' ],
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
	 * Get monthly badges data.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_monthly_badges( $request ) {
		$widget = \progress_planner()->get_admin__widgets__monthly_badges();

		// Get current month score.
		$score = $widget->get_score();

		// Get current month badge.
		$current_date       = new \DateTime();
		$current_badge_id   = Monthly::get_badge_id_from_date( $current_date );
		$current_badge      = Monthly::get_instance_from_id( $current_badge_id );
		$current_badge_name = $current_badge ? $current_badge->get_name() : '';
		$current_badge_data = [
			'id'   => $current_badge_id,
			'name' => $current_badge_name,
		];

		// Get previous incomplete badges.
		$previous_incomplete = [];
		$previous_badges     = $widget->get_previous_incomplete_months_badges();

		foreach ( $previous_badges as $badge ) {
			$progress              = $badge->progress_callback( [ 'no_next_badge_points' => true ] );
			$previous_incomplete[] = [
				'id'        => $badge->get_id(),
				'name'      => $badge->get_name(),
				'points'    => $progress['points'],
				'maxPoints' => Monthly::TARGET_POINTS,
			];
		}

		// Build response data.
		$response_data = [
			'score'                    => $score,
			'currentBadge'             => $current_badge_data,
			'previousIncompleteBadges' => $previous_incomplete,
			'brandingId'               => (int) \progress_planner()->get_ui__branding()->get_branding_id(),
			'remoteServerUrl'          => \progress_planner()->get_remote_server_root_url(),
			'placeholderUrl'           => \progress_planner()->get_placeholder_svg( 200, 200 ),
		];

		return new \WP_REST_Response( $response_data );
	}
}
