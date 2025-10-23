<?php
/**
 * Progress_Planner REST-API.
 *
 * Adds a REST-API endpoint to get tasks, in a URL like:
 * <site-url>/wp-json/progress-planner/v1/tasks
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Rest_API_Tasks class.
 */
class Tasks extends Base {
	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_action( 'rest_api_init', [ $this, 'register_rest_endpoint' ] );
	}

	/**
	 * Register the REST-API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/tasks',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_tasks' ],
					'permission_callback' => '__return_true',
					'args'                => [
						'token' => [
							'required'          => true,
							'validate_callback' => [ $this, 'validate_token' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Get task recommendations.
	 *
	 * @return \WP_REST_Response The REST response object containing the recommendations.
	 */
	public function get_tasks() {
		// Collection of task objects.
		$tasks           = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => [ 'publish', 'trash', 'draft', 'future', 'pending' ] ] );
		$tasks_to_return = [];

		foreach ( $tasks as $task ) {
			$tasks_to_return[] = $task->get_data();
		}
		return new \WP_REST_Response( $tasks_to_return );
	}
}
