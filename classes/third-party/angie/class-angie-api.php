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
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct();
		// Add logging filter for all Angie endpoints.
		if ( \defined( 'PRPL_DEBUG' ) && \constant( 'PRPL_DEBUG' ) ) {
			\add_filter( 'rest_pre_dispatch', [ $this, 'log_angie_endpoints' ], 10, 3 );
		}
	}

	/**
	 * Log Angie API endpoint requests.
	 *
	 * @param mixed            $result  Response to replace the requested version with. Can be anything a normal endpoint can return, or null to not hijack the request.
	 * @param \WP_REST_Server  $server  Server instance.
	 * @param \WP_REST_Request $request Request used to generate the response.
	 * @return mixed Unchanged result (we're just logging, not hijacking).
	 */
	public function log_angie_endpoints( $result, $server, $request ) {
		$route = $request->get_route();

		// Only log requests to our Angie endpoints.
		if ( \strpos( $route, '/progress-planner/v1/angie/' ) === 0 ) {
			$method = $request->get_method();
			$params = $request->get_params();

			$this->log_angie_request( $route, $method, $params );
		}

		return $result;
	}

	/**
	 * Log a single Angie API request.
	 *
	 * @param string $route  The API route.
	 * @param string $method The HTTP method.
	 * @param array  $params The request parameters.
	 * @return void
	 */
	protected function log_angie_request( $route, $method, $params ) {
		\error_log( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			\sprintf(
				'[Progress Planner Angie] %s %s - Params: %s',
				$method,
				$route,
				\wp_json_encode( $params )
			)
		);
	}

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
	 * Get all tasks by status.
	 *
	 * @param string $post_status The status of the tasks to get.
	 *
	 * @return \WP_REST_Response|\WP_Error The REST response object containing active tasks.
	 */
	public function get_tasks_by_status( $post_status ) {
		try {
			// Get all published recommendations.
			$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => $post_status ] );

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
					'status'      => 'publish' === $task_data['post_status'] ? 'active' : 'completed',
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
	 * Get all active (published) tasks.
	 *
	 * @return \WP_REST_Response|\WP_Error The REST response object containing active tasks.
	 */
	public function get_active_tasks() {
		return $this->get_tasks_by_status( 'publish' );
	}

	/**
	 * Get all completed (trashed) tasks.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object containing completed tasks.
	 */
	public function get_completed_tasks( $request ) {
		return $this->get_tasks_by_status( 'trash' );
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
			$remote_data = $this->get_remote_angie_data();
			if ( empty( $remote_data ) ) {
				return new \WP_Error(
					'tools_error',
					\__( 'Failed to get tool definitions.', 'progress-planner' ),
					[ 'status' => 500 ]
				);
			}

			return new \WP_REST_Response( $remote_data['tools'], 200 );
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

		$remote_data = $this->get_remote_angie_data();
		if ( empty( $remote_data ) ) {
			return [];
		}

		return $remote_data['tasks'];
	}

	/**
	 * Get the remote Angie data.
	 *
	 * @return array The remote Angie data.
	 */
	protected function get_remote_angie_data() {

		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie';
		$url = \add_query_arg(
			[
				'site' => \get_site_url(),
			],
			$url
		);

		$cache_key = \md5( $url );

		$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( $cached ) {
			return $cached;
		}

		$response = \wp_remote_get( $url );

		if ( \is_wp_error( $response ) || 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		$response_body = \json_decode( \wp_remote_retrieve_body( $response ), true );

		\progress_planner()->get_utils__cache()->set( $cache_key, $response_body, 1 * DAY_IN_SECONDS );

		return $response_body;
	}
}
