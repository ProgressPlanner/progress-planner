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
					'description' => $task_data['post_content'] ?? '',
					'url'         => $task_data['url'] ?? '',
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
				$setting = $angie_tasks_map[ $task_id ];
				if ( ! \is_string( $setting ) ) {
					return new \WP_Error(
						'invalid_task_config',
						\__( 'Invalid task configuration.', 'progress-planner' ),
						[ 'status' => 500 ]
					);
				}

				$updated = $this->update_task_setting( $setting, $value );
				if ( \is_wp_error( $updated ) ) {
					return $updated;
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
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object containing tool definitions.
	 */
	public function get_tools( $request ) {
		try {
			$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/angie-jobs';
			$cache_key = \md5( $url );

			// Get the cached value.
			$cached = \progress_planner()->get_utils__cache()->get( $cache_key );
			if ( \is_array( $cached ) && ! empty( $cached ) ) {
				return new \WP_REST_Response(
					[
						'success' => true,
						'tools'   => $cached,
					],
					200
				);
			}

			// Get the jobs from the remote server.
			$response = \wp_remote_get( $url );

			// Handle network errors.
			if ( \is_wp_error( $response ) ) {
				return $this->get_empty_tools_response( $cache_key );
			}

			// Handle HTTP errors.
			if ( 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
				return $this->get_empty_tools_response( $cache_key );
			}

			// Parse JSON response. IMPORTANT: use true for associative array. Angie is temperamental sometimes.
			$tools = \json_decode( \wp_remote_retrieve_body( $response ), true );

			// Validate response.
			if ( ! \is_array( $tools ) || empty( $tools ) ) {
				return $this->get_empty_tools_response( $cache_key );
			}

			// Cache successful response for 3 days.
			\progress_planner()->get_utils__cache()->set(
				$cache_key,
				$tools,
				3 * DAY_IN_SECONDS
			);

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
	 * Get an empty tools response with caching.
	 *
	 * Helper method to reduce code duplication when returning empty tools responses.
	 *
	 * @param string $cache_key The cache key to use for storing the empty result.
	 * @return \WP_REST_Response The REST response object with empty tools.
	 */
	private function get_empty_tools_response( $cache_key ) {
		\progress_planner()->get_utils__cache()->set(
			$cache_key,
			[],
			5 * MINUTE_IN_SECONDS
		);
		return new \WP_REST_Response(
			[
				'success' => true,
				'tools'   => [],
			],
			200
		);
	}

	/**
	 * Get the Angie tasks map.
	 *
	 * @return array The Angie tasks map, keyed by task ID, value is the option the task updates.
	 */
	protected function get_angie_tasks_map() {
		return [
			'core-blogdescription' => 'blogdescription',
			// 'core-siteicon'        => 'post_id', -- Seems like Angie can't upload media.
			'select-locale'        => 'WPLANG',
			'select-timezone'      => 'timezone_string',
		];
	}

	/**
	 * Update the option behind a task.
	 *
	 * The interactive task providers apply their settings through
	 * handle_interactive_task_submit(), which reads $_POST and terminates with
	 * wp_send_json_*(). That contract cannot be reused from a REST callback,
	 * which has to return a response, so the update is performed here instead.
	 *
	 * The provider's option whitelist is reused rather than bypassed, so this
	 * endpoint can only write options the interactive tasks could already write.
	 *
	 * @param string $setting The option to update.
	 * @param mixed  $value   The value to set.
	 *
	 * @return true|\WP_Error True on success, WP_Error on failure.
	 */
	protected function update_task_setting( $setting, $value ) {
		if ( ! \is_scalar( $value ) ) {
			return new \WP_Error(
				'invalid_value',
				\__( 'The value must be a scalar.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		$value = \sanitize_text_field( (string) $value );

		if ( '' === $value ) {
			return new \WP_Error(
				'invalid_value',
				\__( 'The value cannot be empty.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		/** This filter is documented in classes/suggested-tasks/providers/class-tasks-interactive.php */
		$allowed_options = \apply_filters(
			'progress_planner_interactive_task_allowed_options',
			[
				'blogdescription',
				'default_comment_status',
				'default_ping_status',
				'timezone_string',
				'WPLANG',
				'date_format',
				'time_format',
				'default_pingback_flag',
				'comment_registration',
				'close_comments_for_old_posts',
				'thread_comments',
				'comments_per_page',
				'comment_order',
				'page_comments',
			]
		);

		if ( ! \in_array( $setting, $allowed_options, true ) ) {
			return new \WP_Error(
				'invalid_setting',
				\__( 'Invalid setting. This option cannot be updated through Angie.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// The timezone is stored across two options: a named zone in
		// timezone_string, or a numeric offset in gmt_offset, never both.
		if ( 'timezone_string' === $setting ) {
			return $this->update_timezone( $value );
		}

		\update_option( $setting, $value );

		return true;
	}

	/**
	 * Update the site timezone.
	 *
	 * Mirrors the mapping in Select_Timezone: a "UTC+2"-style value is stored as
	 * a numeric gmt_offset, a named zone as a timezone_string, and the other
	 * option is cleared so the two cannot disagree.
	 *
	 * @param string $timezone The timezone to set.
	 *
	 * @return true|\WP_Error True on success, WP_Error if the timezone is not recognised.
	 */
	protected function update_timezone( $timezone ) {
		if ( \preg_match( '/^UTC[+-]/', $timezone ) ) {
			\update_option( 'gmt_offset', \preg_replace( '/UTC\+?/', '', $timezone ) );
			\update_option( 'timezone_string', '' );

			return true;
		}

		if ( \in_array( $timezone, \timezone_identifiers_list( \DateTimeZone::ALL_WITH_BC ), true ) ) {
			\update_option( 'timezone_string', $timezone );
			\update_option( 'gmt_offset', '' );

			return true;
		}

		return new \WP_Error(
			'invalid_timezone',
			\__( 'Invalid timezone.', 'progress-planner' ),
			[ 'status' => 400 ]
		);
	}
}
