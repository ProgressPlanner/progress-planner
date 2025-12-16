<?php
/**
 * Task Evaluation REST API endpoint.
 *
 * Handles task post creation when React tasks determine they should be injected.
 * React evaluates tasks client-side, then uses this endpoint to create task posts.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Task Evaluation REST API class.
 */
class Task_Evaluation extends Base {

	/**
	 * Register the REST API endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/tasks/evaluate',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'create_task' ],
					'permission_callback' => [ $this, 'permission_callback' ],
					'args'                => [
						'task_details' => [
							'required'          => true,
							'type'              => 'object',
							'validate_callback' => [ $this, 'validate_task_details' ],
							'sanitize_callback' => [ $this, 'sanitize_task_details' ],
						],
					],
				],
			]
		);
	}

	/**
	 * Permission callback for task evaluation endpoint.
	 *
	 * @return bool
	 */
	public function permission_callback() {
		return \current_user_can( 'edit_others_posts' );
	}

	/**
	 * Validate task details.
	 *
	 * @param mixed            $value The task details array.
	 * @param \WP_REST_Request $request The request object.
	 * @param string           $param The parameter name.
	 * @return bool
	 */
	public function validate_task_details( $value, $request, $param ) {
		if ( ! \is_array( $value ) ) {
			return false;
		}

		// Required fields.
		$required = [ 'task_id', 'provider_id', 'post_title' ];
		foreach ( $required as $field ) {
			if ( ! isset( $value[ $field ] ) || empty( $value[ $field ] ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Sanitize task details.
	 *
	 * @param array            $value The task details array.
	 * @param \WP_REST_Request $request The request object.
	 * @param string           $param The parameter name.
	 * @return array
	 */
	public function sanitize_task_details( $value, $request, $param ) {
		$sanitized = [];

		// Sanitize string fields.
		$string_fields = [
			'task_id',
			'provider_id',
			'post_title',
			'description',
			'url',
			'url_target',
			'external_link_url',
		];
		foreach ( $string_fields as $field ) {
			if ( isset( $value[ $field ] ) ) {
				$sanitized[ $field ] = \sanitize_text_field( $value[ $field ] );
			}
		}

		// Sanitize integer fields.
		$int_fields = [ 'parent', 'priority', 'points', 'order' ];
		foreach ( $int_fields as $field ) {
			if ( isset( $value[ $field ] ) ) {
				$sanitized[ $field ] = (int) $value[ $field ];
			}
		}

		// Sanitize boolean fields.
		$bool_fields = [ 'dismissable' ];
		foreach ( $bool_fields as $field ) {
			if ( isset( $value[ $field ] ) ) {
				$sanitized[ $field ] = (bool) $value[ $field ];
			}
		}

		// Preserve array fields (like link_setting).
		$array_fields = [ 'link_setting' ];
		foreach ( $array_fields as $field ) {
			if ( isset( $value[ $field ] ) && \is_array( $value[ $field ] ) ) {
				$sanitized[ $field ] = $value[ $field ];
			}
		}

		return $sanitized;
	}

	/**
	 * Create a task post.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response|\WP_Error The REST response object or error.
	 */
	public function create_task( $request ) {
		$task_details = $request->get_param( 'task_details' );

		// Check if task already exists.
		$existing_task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_details['task_id'] );
		if ( $existing_task ) {
			// Task already exists, return its ID.
			return new \WP_REST_Response(
				[
					'success' => true,
					'post_id' => $existing_task->ID,
					'message' => \esc_html__( 'Task already exists.', 'progress-planner' ),
				],
				200
			);
		}

		// Check if task was previously completed.
		if ( \progress_planner()->get_suggested_tasks()->was_task_completed( $task_details['task_id'] ) ) {
			return new \WP_REST_Response(
				[
					'success' => false,
					'message' => \esc_html__( 'Task was already completed.', 'progress-planner' ),
				],
				200
			);
		}

		// Prepare data for task creation.
		$task_data = [
			'task_id'           => $task_details['task_id'],
			'provider_id'       => $task_details['provider_id'],
			'post_title'        => $task_details['post_title'],
			'description'       => $task_details['description'] ?? '',
			'priority'          => $task_details['priority'] ?? 50,
			'points'            => $task_details['points'] ?? 1,
			'parent'            => $task_details['parent'] ?? 0,
			'order'             => $task_details['order'] ?? ( $task_details['priority'] ?? 50 ),
			'url'               => $task_details['url'] ?? '',
			'url_target'        => $task_details['url_target'] ?? '_self',
			'external_link_url' => $task_details['external_link_url'] ?? '',
			'dismissable'       => $task_details['dismissable'] ?? false,
			'post_status'       => 'publish',
		];

		// Add link_setting if provided.
		if ( isset( $task_details['link_setting'] ) && \is_array( $task_details['link_setting'] ) ) {
			$task_data['link_setting'] = $task_details['link_setting'];
		}

		// Create the task post.
		$post_id = \progress_planner()->get_suggested_tasks_db()->add( $task_data );

		if ( ! $post_id ) {
			return new \WP_Error(
				'rest_task_creation_failed',
				\esc_html__( 'Failed to create task.', 'progress-planner' ),
				[ 'status' => 500 ]
			);
		}

		return new \WP_REST_Response(
			[
				'success' => true,
				'post_id' => $post_id,
				'message' => \esc_html__( 'Task created successfully.', 'progress-planner' ),
			],
			201
		);
	}
}
