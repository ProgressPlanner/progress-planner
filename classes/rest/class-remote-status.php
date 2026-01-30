<?php
/**
 * Remote Status REST API endpoint.
 *
 * Provides site status and recommendations for external clients
 * (e.g., Moltbot) via PP Server as an authenticated relay.
 *
 * Endpoint: /wp-json/progress-planner/v1/remote/status
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Remote_Status class.
 */
class Remote_Status extends Remote_Base {

	/**
	 * Register the REST-API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/remote/status',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_status' ],
					'permission_callback' => [ $this, 'check_permission' ],
				],
			]
		);
	}

	/**
	 * Get site status and recommendations.
	 *
	 * @return \WP_REST_Response The REST response.
	 */
	public function get_status() {
		$pending_tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[ 'post_status' => 'publish' ]
		);

		$snoozed_count         = \count(
			\progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[ 'post_status' => 'future' ]
			)
		);
		$completed_today_count = $this->get_completed_today_count();

		$recommendations = [];
		foreach ( $pending_tasks as $task ) {
			$recommendations[] = $this->format_task( $task );
		}

		return new \WP_REST_Response(
			[
				'site'            => [
					'name'        => \get_bloginfo( 'name' ),
					'wp_version'  => \get_bloginfo( 'version' ),
					'php_version' => \phpversion(),
					'pp_version'  => \progress_planner()->get_plugin_version(),
				],
				'recommendations' => $recommendations,
				'stats'           => [
					'pending'         => \count( $pending_tasks ),
					'snoozed'         => $snoozed_count,
					'completed_today' => $completed_today_count,
				],
			]
		);
	}

	/**
	 * Format a task object for the remote API response.
	 *
	 * @param \Progress_Planner\Suggested_Tasks\Task $task The task object.
	 *
	 * @return array{id: string, type: string, title: string, description: string, priority: string, category: string, created_at: string}
	 */
	private function format_task( $task ) {
		$data = $task->get_data();

		return [
			'id'          => $data['task_id'] ?? $data['post_name'] ?? '',
			'type'        => $task->get_provider_id(),
			'title'       => $data['post_title'] ?? '',
			'description' => $data['post_content'] ?? '',
			'priority'    => $this->map_priority( (int) ( $data['menu_order'] ?? 50 ) ),
			'category'    => $task->get_provider_id(),
			'created_at'  => ! empty( $data['post_date'] )
				? \gmdate( 'c', \strtotime( $data['post_date'] ) )
				: '',
		];
	}

	/**
	 * Map numeric menu_order priority to a human-readable string.
	 *
	 * @param int $menu_order The menu order value (lower = higher priority).
	 *
	 * @return string One of 'high', 'medium', or 'low'.
	 */
	private function map_priority( $menu_order ) {
		if ( $menu_order <= 30 ) {
			return 'high';
		}

		if ( $menu_order <= 60 ) {
			return 'medium';
		}

		return 'low';
	}

	/**
	 * Count tasks completed today.
	 *
	 * Uses the site's local timezone via post_modified column.
	 *
	 * @return int Number of tasks completed today.
	 */
	private function get_completed_today_count() {
		$today = \current_time( 'Y-m-d' );

		$completed = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => [ 'trash', 'pending' ],
				'numberposts' => -1,
				'fields'      => 'ids',
				'date_query'  => [
					[
						'after'     => $today . ' 00:00:00',
						'before'    => $today . ' 23:59:59',
						'inclusive' => true,
						'column'    => 'post_modified',
					],
				],
			]
		);

		return \count( $completed );
	}
}
