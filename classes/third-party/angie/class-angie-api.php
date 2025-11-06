<?php
/**
 * Progress_Planner Angie Integration REST-API.
 *
 * Provides REST-API endpoints for Angie AI integration:
 * - <site-url>/wp-json/progress-planner/v1/angie/tasks - Get active tasks
 * - <site-url>/wp-json/progress-planner/v1/angie/tasks/completed - Get completed tasks
 * - <site-url>/wp-json/progress-planner/v1/angie/tasks/complete - Complete a task
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
		// Get all active (published) tasks.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/tasks',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_active_tasks' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);

		// Get all completed (trashed) tasks.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/tasks/completed',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_completed_tasks' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);

		// Complete a task.
		\register_rest_route(
			'progress-planner/v1',
			'/angie/tasks/complete',
			[
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
			foreach ( $tasks as $task ) {
				$task_data         = $task->get_data();
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

		try {
			// Special handling for blog description task.
			if ( 'core-blogdescription' === $task_id ) {
				return $this->complete_blog_description_task( $value );
			}

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

			// Mark task as completed (celebrate).
			$task->celebrate();

			return new \WP_REST_Response(
				[
					'success' => true,
					'message' => \sprintf(
						/* translators: %s: task title */
						\__( 'Task "%s" has been marked as completed.', 'progress-planner' ),
						$task->get_data()['title']
					),
					'task_id' => $task_id,
				],
				200
			);
		} catch ( \Exception $e ) {
			return new \WP_Error(
				'task_completion_error',
				$e->getMessage(),
				[ 'status' => 500 ]
			);
		}
	}

	/**
	 * Complete the blog description task.
	 *
	 * @param string $value The blog description value.
	 * @return \WP_REST_Response|\WP_Error The REST response object.
	 */
	private function complete_blog_description_task( $value ) {
		// Check if task exists and is active.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => 'publish',
				'provider_id' => 'core-blogdescription',
			]
		);

		if ( empty( $tasks ) ) {
			return new \WP_Error(
				'task_not_found',
				\__( 'The "Set blog description" task is not currently active. It may have already been completed or the blog description is already set.', 'progress-planner' ),
				[ 'status' => 404 ]
			);
		}

		// Validate the value parameter.
		if ( empty( $value ) ) {
			return new \WP_Error(
				'missing_value',
				\__( 'The "value" parameter is required to complete the blog description task. Please provide a blog description.', 'progress-planner' ),
				[ 'status' => 400 ]
			);
		}

		// Update the blog description.
		$updated = \update_option( 'blogdescription', \sanitize_text_field( $value ) );

		if ( ! $updated ) {
			return new \WP_Error(
				'update_failed',
				\__( 'Failed to update the blog description. Please try again.', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		// Mark the task as completed.
		$task = $tasks[0];
		$task->celebrate();

		return new \WP_REST_Response(
			[
				'success'          => true,
				'message'          => \__( 'Blog description has been set successfully and the task has been marked as completed.', 'progress-planner' ),
				'task_id'          => 'core-blogdescription',
				'blog_description' => $value,
			],
			200
		);
	}
}
