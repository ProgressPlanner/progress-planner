<?php
/**
 * REST API endpoint for Badge Stats.
 *
 * Handles getting and saving badge progress stats.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Badge_Stats REST API endpoint class.
 */
class Badge_Stats extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/badge-stats',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_badge_stats' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'save_badge_stats' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'badges' => [
							'required'          => true,
							'type'              => 'object',
							'validate_callback' => [ $this, 'validate_badge_stats' ],
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
	 * Validate badge stats data.
	 *
	 * @param array $badges Badge stats data.
	 *
	 * @return bool
	 */
	public function validate_badge_stats( $badges ) {
		if ( ! \is_array( $badges ) ) {
			return false;
		}

		foreach ( $badges as $badge_id => $badge_data ) {
			if ( ! \is_string( $badge_id ) ) {
				return false;
			}
			if ( ! \is_array( $badge_data ) ) {
				return false;
			}
			// Validate required fields.
			if ( ! isset( $badge_data['progress'] ) || ! \is_numeric( $badge_data['progress'] ) ) {
				return false;
			}
			if ( ! isset( $badge_data['remaining'] ) || ! \is_numeric( $badge_data['remaining'] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Get badge stats.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_badge_stats( $request ) {
		$settings = \progress_planner()->get_settings();
		$badges   = $settings->get( 'badges', [] );

		return new \WP_REST_Response( [ 'badges' => $badges ] );
	}

	/**
	 * Save badge stats.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function save_badge_stats( $request ) {
		$badges_data = $request->get_param( 'badges' );

		if ( ! \is_array( $badges_data ) ) {
			return new \WP_Error(
				'invalid_data',
				\__( 'Invalid badge data.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		$settings = \progress_planner()->get_settings();
		$existing = $settings->get( 'badges', [] );

		// Merge with existing data, preserving completion dates for completed badges.
		foreach ( $badges_data as $badge_id => $badge_data ) {
			// If badge is being marked as complete (100%), set completion date.
			if (
				isset( $badge_data['progress'] ) &&
				100 === (int) $badge_data['progress'] &&
				( ! isset( $existing[ $badge_id ]['progress'] ) ||
					100 !== (int) $existing[ $badge_id ]['progress'] )
			) {
				$badge_data['date'] = ( new \DateTime() )->format( 'Y-m-d H:i:s' );
			} elseif ( isset( $existing[ $badge_id ]['date'] ) ) {
				// Preserve existing completion date.
				$badge_data['date'] = $existing[ $badge_id ]['date'];
			}

			$existing[ $badge_id ] = $badge_data;
		}

		$settings->set( 'badges', $existing );

		return new \WP_REST_Response(
			[
				'success' => true,
				'badges'  => $existing,
			]
		);
	}
}

