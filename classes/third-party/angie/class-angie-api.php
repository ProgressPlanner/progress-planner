<?php
/**
 * Progress_Planner Angie Integration REST-API.
 *
 * Provides REST-API endpoints for Angie AI integration.
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
	 * @param mixed            $result  Response to replace the requested version with.
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

		// Email test endpoints.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/email-test/send',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'send_test_email' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'email' => [
							'required'          => false,
							'type'              => 'string',
							'description'       => 'Email address to send test to (defaults to current user email)',
							'sanitize_callback' => 'sanitize_email',
							'validate_callback' => function ( $param ) {
								return empty( $param ) || \is_email( $param );
							},
						],
					],
				],
			]
		);

		\register_rest_route(
			'progress-planner/v1',
			'/angie/email-test/confirm',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'confirm_email_received' ],
					'permission_callback' => [ $this, 'check_permissions' ],
					'args'                => [
						'received' => [
							'required'    => true,
							'type'        => 'boolean',
							'description' => 'Whether the email was received',
						],
					],
				],
			]
		);

		// Email test status resource.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/email-test/status',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_email_test_status' ],
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

			return new \WP_REST_Response(
				[
					'success' => true,
					'tools'   => $remote_data['tools'],
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
	 * Send test email.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object.
	 */
	public function send_test_email( $request ) {
		try {
			// Get email from request, or default to current user's email.
			$email = $request->get_param( 'email' );

			if ( empty( $email ) ) {
				$current_user = \wp_get_current_user();
				$email        = $current_user->user_email;
			}

			// Validate email.
			if ( ! \is_email( $email ) ) {
				return new \WP_Error(
					'invalid_email',
					\__( 'Please provide a valid email address.', 'progress-planner' ),
					[ 'status' => 400 ]
				);
			}

			$subject = \__( 'WordPress Test Email from Progress Planner', 'progress-planner' );
			$message = \__(
				'If you received this email, your WordPress site can send emails successfully!',
				'progress-planner'
			);

			$sent = \wp_mail( $email, $subject, $message );

			if ( $sent ) {
				// Store that we sent an email (for tracking).
				\update_option( 'progress_planner_email_test_sent', \time() );
				\update_option( 'progress_planner_email_test_step', 'email_sent' );
				\update_option( 'progress_planner_email_test_address', $email );
				\delete_option( 'progress_planner_email_test_failed' );

				return new \WP_REST_Response(
					[
						'success'       => true,
						'message'       => \sprintf(
							/* translators: %s: email address */
							\__( 'Test email sent to %s. Please check your inbox and spam folder.', 'progress-planner' ),
							$email
						),
						'sent_to_email' => $email,
						'step'          => 'email_sent',
					],
					200
				);
			} else {
				return new \WP_Error(
					'email_send_failed',
					\__( 'Failed to send test email. There may be an issue with your email configuration.', 'progress-planner' ),
					[ 'status' => 500 ]
				);
			}
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'email_test_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Confirm email received.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object.
	 */
	public function confirm_email_received( $request ) {
		$received = $request->get_param( 'received' );

		try {
			if ( $received ) {
				// Success! Email is working.
				\delete_option( 'progress_planner_email_test_failed' );
				\update_option( 'progress_planner_email_working', '1' );
				\update_option( 'progress_planner_email_test_step', 'confirmed' );

				// Mark the "sending-email" task as complete.
				$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
					[
						'post_status' => 'publish',
						'provider_id' => 'sending-email',
					]
				);

				if ( ! empty( $tasks ) ) {
					$tasks[0]->celebrate();
				}

				return new \WP_REST_Response(
					[
						'success'       => true,
						'message'       => \__(
							'✓ Great! Your WordPress site is correctly configured to send emails.',
							'progress-planner'
						),
						'email_working' => true,
						'step'          => 'confirmed',
					],
					200
				);
			} else {
				// Email not received - troubleshooting needed.
				\update_option( 'progress_planner_email_test_failed', '1' );
				\delete_option( 'progress_planner_email_working' );
				\update_option( 'progress_planner_email_test_step', 'troubleshooting' );

				$troubleshooting = \__(
					'Email delivery needs attention. Here are some common solutions:

1. Install an SMTP plugin like WP Mail SMTP or Post SMTP
2. Check your hosting email settings
3. Verify your spam/junk folder
4. Contact your hosting provider about email deliverability
5. Consider using a transactional email service (SendGrid, Mailgun, etc.)',
					'progress-planner'
				);

				return new \WP_REST_Response(
					[
						'success'       => true,
						'message'       => $troubleshooting,
						'email_working' => false,
						'step'          => 'troubleshooting',
					],
					200
				);
			}
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'email_confirm_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Get email test status (Resource).
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object.
	 */
	public function get_email_test_status( $request ) {
		try {
			$step          = \get_option( 'progress_planner_email_test_step', 'not_started' );
			$email_sent_at = \get_option( 'progress_planner_email_test_sent', 0 );
			$email_working = \get_option( 'progress_planner_email_working', '0' ) === '1';
			$test_failed   = \get_option( 'progress_planner_email_test_failed', '0' ) === '1';
			$test_email    = \get_option( 'progress_planner_email_test_address', '' );

			$current_user  = \wp_get_current_user();
			$default_email = $current_user->user_email;

			$status = [
				'step'          => $step,
				'email_working' => $email_working,
				'test_failed'   => $test_failed,
				'default_email' => $default_email,
				'test_email'    => $test_email, // Shows which email was actually tested.
			];

			// Add contextual information based on step.
			switch ( $step ) {
				case 'not_started':
					$status['message']     = \__( 'Email test has not been started yet. Use send-test-email tool to begin.', 'progress-planner' );
					$status['next_action'] = 'send-test-email';
					break;

				case 'email_sent':
					$status['message'] = \sprintf(
						/* translators: %s: email address */
						\__( 'Test email was sent to %s. Waiting for user confirmation.', 'progress-planner' ),
						$test_email
					);
					$status['sent_at']     = $email_sent_at;
					$status['next_action'] = 'confirm-email-received';
					break;

				case 'confirmed':
					$status['message']     = \__( 'Email test completed successfully. Email delivery is working.', 'progress-planner' );
					$status['next_action'] = null;
					break;

				case 'troubleshooting':
					$status['message']     = \__( 'Email test failed. User needs to follow troubleshooting steps.', 'progress-planner' );
					$status['next_action'] = 'send-test-email'; // Can retry.
					break;

				default:
					$status['message']     = \__( 'Unknown email test status.', 'progress-planner' );
					$status['next_action'] = null;
			}

			return new \WP_REST_Response( $status, 200 );
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'status_error',
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
