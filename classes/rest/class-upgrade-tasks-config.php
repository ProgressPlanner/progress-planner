<?php
/**
 * Upgrade Tasks Config REST API controller.
 *
 * Returns configuration data for the upgrade tasks popover.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Upgrade Tasks Config REST API controller.
 */
class Upgrade_Tasks_Config extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/popover/upgrade-tasks-config',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_config' ],
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
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Get upgrade tasks configuration.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_config( $request ) {
		$plugin_upgrade_tasks = \progress_planner()->get_plugin_upgrade_tasks();
		$task_providers       = $plugin_upgrade_tasks->get_newly_added_task_providers();

		// Build task providers data for React.
		$task_providers_data = [];
		foreach ( $task_providers as $task_provider ) {
			$task_data = [
				'task_id'     => $task_provider->get_task_id(),
				'provider_id' => $task_provider->get_provider_id(),
			];

			// Get task details.
			$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] );

			// If task doesn't exist, add it.
			if ( ! $task ) {
				$task_post_id = \progress_planner()->get_suggested_tasks_db()->add( $task_provider->get_task_details( $task_data ) );
				if ( $task_post_id ) {
					$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_post_id );
				}
			}

			if ( $task ) {
				$task_completed = $task_provider->evaluate_task( $task_data['task_id'] );

				$task_providers_data[] = [
					'task_id'   => $task_data['task_id'],
					'title'     => $task->post_title,
					'points'    => $task->points ?? 0,
					'completed' => $task_completed,
				];
			}
		}

		// Generate monthly badge ID.
		$now      = new \DateTime();
		$badge_id = 'monthly-' . $now->format( 'Y' ) . '-m' . $now->format( 'n' );

		return new \WP_REST_Response(
			[
				'taskProviders'   => $task_providers_data,
				'brandingId'      => (int) \progress_planner()->get_ui__branding()->get_branding_id(),
				'remoteServerUrl' => \progress_planner()->get_remote_server_root_url(),
				'placeholderSvg'  => \progress_planner()->get_placeholder_svg(),
				'badgeId'         => $badge_id,
			],
			200
		);
	}
}
