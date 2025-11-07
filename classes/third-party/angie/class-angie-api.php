<?php
/**
 * Progress_Planner Angie Integration REST-API.
 *
 * Provides REST-API endpoints for Angie AI integration:
 * - <site-url>/wp-json/progress-planner/v1/angie/tasks (GET) - Get active tasks
 * - <site-url>/wp-json/progress-planner/v1/angie/tasks (POST) - Complete a task
 * - <site-url>/wp-json/progress-planner/v1/angie/tasks/completed (GET) - Get completed tasks
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Third_Party\Angie;

use Progress_Planner\Rest\Base;

/**
 * Angie Integration REST-API class.
 */
class Angie_API extends Base {

	/**
	 * Register the REST-API endpoints.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		// Get all active (published) tasks and complete tasks.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/recommendations',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_active_tasks' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'complete_task' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'task_id' => [
							'required'          => true,
							'type'              => 'string',
							'description'       => 'The task ID to complete (e.g., "core-blogdescription")',
							'sanitize_callback' => 'sanitize_text_field',
						],
						'value'   => [
							'required'          => false,
							'type'              => 'string',
							'description'       => 'The value to set for the task (e.g., blog description text)',
							'sanitize_callback' => 'sanitize_text_field',
						],
					],
				],
			]
		);

		// Get all completed (trashed) tasks.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/recommendations/completed',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_completed_tasks' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);

		// Get MCP tool definitions.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/tools',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_tools' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);
	}

	/**
	 * Check permissions for Angie endpoints.
	 *
	 * @return bool|\WP_Error True if user has permission, WP_Error otherwise.
	 */
	public function check_permissions() {
		// Check if user is logged in and has permission to manage options.
		if ( ! \current_user_can( 'manage_options' ) ) {
			return new \WP_Error(
				'rest_forbidden',
				\__( 'You do not have permission to access this endpoint.', 'progress-planner' ),
				[ 'status' => 403 ]
			);
		}

		return true;
	}

	/**
	 * Get all active (published) tasks.
	 *
	 * @return \WP_REST_Response|\WP_Error The REST response object containing active tasks.
	 */
	public function get_active_tasks() {
		try {
			// Get all published recommendations.
			$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] );

			$tasks_to_return = [];
			$angie_tasks     = $this->get_angie_tasks();
			foreach ( $tasks as $task ) {
				$task_data = $task->get_data();

				// Skip tasks which are not handled by Angie.
				if ( ! \in_array( $task_data['task_id'], $angie_tasks, true ) ) {
					continue;
				}

				$tasks_to_return[] = [
					'id'          => $task_data['task_id'],
					'title'       => $task_data['post_title'],
					'description' => $task_data['post_content'],
					'url'         => $task_data['url'],
					'priority'    => $task_data['priority'] ?? 0,
					'status'      => 'active',
				];
			}

			return new \WP_REST_Response(
				[
					'success' => true,
					'count'   => \count( $tasks_to_return ),
					'tasks'   => $tasks_to_return,
				],
				200
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'tasks_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Get all completed (trashed) tasks.
	 *
	 * @return \WP_REST_Response|\WP_Error The REST response object containing completed tasks.
	 */
	public function get_completed_tasks() {
		try {
			// Get all trashed recommendations.
			$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'trash' ] );

			$tasks_to_return = [];
			foreach ( $tasks as $task ) {
				$task_data         = $task->get_data();
				$tasks_to_return[] = [
					'id'          => $task_data['task_id'],
					'title'       => $task_data['post_title'],
					'description' => $task_data['post_content'],
					'url'         => $task_data['url'],
					'priority'    => $task_data['priority'] ?? 0,
					'status'      => 'completed',
				];
			}

			return new \WP_REST_Response(
				[
					'success' => true,
					'count'   => \count( $tasks_to_return ),
					'tasks'   => $tasks_to_return,
				],
				200
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'tasks_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Complete a task.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object.
	 */
	public function complete_task( $request ) {
		$task_id = $request->get_param( 'task_id' );
		$value   = $request->get_param( 'value' );

		// Ensure task_id is a string for type safety.
		if ( ! \is_string( $task_id ) ) {
			return new \WP_Error(
				'invalid_task_id',
				\__( 'Task ID must be a string.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		try {
			// For other tasks, try to find and mark as completed.
			$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[
					'post_status' => 'publish',
					'provider_id' => $task_id,
				]
			);

			if ( empty( $tasks ) ) {
				return new \WP_Error(
					'task_not_found',
					\sprintf(
					/* translators: %s: task ID */
						\__( 'Task with ID "%s" not found or already completed.', 'progress-planner' ),
						$task_id
					),
					[ 'status' => 404 ]
				);
			}

			// Get the first matching task.
			$task = $tasks[0];

			$angie_tasks_map = $this->get_angie_tasks_map();

			// Special handling for tasks which are handled by Angie.
			if ( isset( $angie_tasks_map[ $task_id ] ) ) {
				$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task_id ); // @phpstan-ignore-line method.nonObject
				if ( $task_provider ) {
					$param_name = $angie_tasks_map[ $task_id ];
					if ( ! \is_string( $param_name ) ) {
						return new \WP_Error(
							'invalid_task_config',
							\__( 'Invalid task configuration.', 'progress-planner' ),
							[ 'status' => 500 ]
						);
					}
					$task_provider->complete_task( [ $param_name => $value ], $task_id );
				}
			}

			// Mark task as completed (celebrate).
			$task->celebrate();

			$response_data = [
				'success' => true,
				'message' => \sprintf(
					/* translators: %s: task title */
					\__( 'Task "%s" has been marked as completed.', 'progress-planner' ),
					$task->get_data()['post_title']
				),
				'task_id' => $task_id,
			];

			// Include the new value if provided (for tasks that set a value).
			if ( $value ) {
				$response_data['new_value'] = $value;
			}

			return new \WP_REST_Response( $response_data, 200 );
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'task_completion_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Get MCP tool definitions.
	 *
	 * @return \WP_REST_Response|\WP_Error The REST response object containing tool definitions.
	 */
	public function get_tools() {
		try {
			$tools = [
				[
					'name'              => 'list-active-recommendations',
					'description'       => \__(
						'Lists all active Progress Planner recommendations that the user needs to complete. These are recommendations with status "publish" that are currently visible to the user. Use this to see what recommendations are pending or to help the user understand their to-do list.',
						'progress-planner'
					),
					'endpoint'          => '/recommendations',
					'method'            => 'GET',
					'responseFormatter' => 'format_recommendations_list',
					'inputSchema'       => [
						'type'       => 'object',
						'properties' => [],
						'required'   => [],
					],
				],
				[
					'name'              => 'list-completed-recommendations',
					'description'       => \__(
						'Lists all completed Progress Planner recommendations. These are recommendations that have been marked as done (status "trash"). Use this to see what the user has already accomplished or to review their progress history.',
						'progress-planner'
					),
					'endpoint'          => '/recommendations/completed',
					'method'            => 'GET',
					'responseFormatter' => 'format_recommendations_list',
					'inputSchema'       => [
						'type'       => 'object',
						'properties' => [],
						'required'   => [],
					],
				],
				[
					'name'              => 'complete-recommendation',
					'description'       => \__(
						'Completes a specific Progress Planner recommendation. Some recommendations require a value parameter (like "core-blogdescription" which needs the tagline text, or "select-timezone" and "set-locale" which need their respective values). Other recommendations may not require a value. This will mark the recommendation as completed and may perform associated actions (like updating settings).',
						'progress-planner'
					),
					'endpoint'          => '/recommendations',
					'method'            => 'POST',
					'responseFormatter' => 'format_complete_recommendation',
					'inputSchema'       => [
						'type'       => 'object',
						'properties' => [
							'task_id' => [
								'type'        => 'string',
								'description' => \__(
									'The unique identifier of the recommendation to complete (e.g., "core-blogdescription", "select-timezone", "set-locale"). Use list-active-recommendations to see available recommendation IDs and their requirements.',
									'progress-planner'
								),
							],
							'value'   => [
								'type'        => 'string',
								'description' => \__(
									'The value to set for recommendations that require input. Required for: "core-blogdescription" (provide the tagline text), "select-timezone" (provide timezone identifier like "America/New_York"), "set-locale" (provide locale code like "en_US"). Optional or not needed for other recommendations.',
									'progress-planner'
								),
							],
						],
						'required'   => [ 'task_id' ],
					],
				],
			];

			return new \WP_REST_Response(
				[
					'success' => true,
					'tools'   => $tools,
				],
				200
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'tools_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Get the Angie tasks.
	 *
	 * @return array An array of Angie task IDs (for WIP they are the same as the provider IDs).
	 */
	protected function get_angie_tasks() {
		return \array_keys( $this->get_angie_tasks_map() );
	}

	/**
	 * Get the Angie tasks map.
	 *
	 * @return array The Angie tasks map, keyed by task ID, value is the argument name for the complete_task method.
	 */
	protected function get_angie_tasks_map() {
		return [
			'core-blogdescription' => 'blogdescription',
			'core-siteicon'        => 'post_id',
			'set-locale'           => 'language',
			'select-timezone'      => 'timezone',
		];
	}
}
