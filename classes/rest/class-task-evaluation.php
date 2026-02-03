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
	 * Register the REST API endpoints.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		// Single task creation endpoint.
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

		// Batch task creation endpoint.
		\register_rest_route(
			'progress-planner/v1',
			'/tasks/evaluate-batch',
			[
				[
					'methods'             => 'POST',
					'callback'            => [ $this, 'create_tasks_batch' ],
					'permission_callback' => [ $this, 'permission_callback' ],
					'args'                => [
						'tasks' => [
							'required' => true,
							'type'     => 'array',
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
		$result       = $this->create_single_task( $task_details );

		if ( \is_wp_error( $result ) ) {
			return $result;
		}

		$status_code = isset( $result['post_id'] ) && $result['message'] === \esc_html__( 'Task created successfully.', 'progress-planner' ) ? 201 : 200;
		return new \WP_REST_Response( $result, $status_code );
	}

	/**
	 * Create multiple tasks in a batch with optimized database operations.
	 *
	 * Optimizations over sequential processing:
	 * - Single lock for entire batch (vs per-task locks)
	 * - Bulk existence check with one query (vs per-task queries)
	 * - Pre-fetch all provider terms at once (vs per-task term lookups)
	 * - Direct response building (no internal REST calls)
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 * @return \WP_REST_Response The REST response object.
	 */
	public function create_tasks_batch( $request ) {
		$tasks = $request->get_param( 'tasks' );
		if ( empty( $tasks ) ) {
			return new \WP_REST_Response(
				[
					'success' => true,
					'tasks'   => [],
				],
				200
			);
		}

		// Sanitize all tasks first.
		$sanitized_tasks = [];
		foreach ( $tasks as $task_details ) {
			$sanitized_tasks[] = $this->sanitize_task_details( $task_details, $request, 'tasks' );
		}

		// Acquire a single lock for the entire batch.
		$lock_key   = 'prpl_batch_lock_' . \md5( \wp_json_encode( \array_column( $sanitized_tasks, 'task_id' ) ) );
		$lock_value = \time();

		if ( ! \add_option( $lock_key, $lock_value, '', false ) ) {
			$current = \get_option( $lock_key );
			if ( ! $current || $current >= \time() - 30 ) {
				// Lock is held by another active process.
				return new \WP_REST_Response(
					[
						'success' => false,
						'message' => \esc_html__( 'Batch creation in progress by another process.', 'progress-planner' ),
					],
					409
				);
			}
			// Stale lock, take it over.
			\update_option( $lock_key, $lock_value );
		}

		try {
			$results = $this->process_batch_tasks( $sanitized_tasks );
		} finally {
			\delete_option( $lock_key );
		}

		return new \WP_REST_Response(
			[
				'success' => true,
				'tasks'   => $results,
			],
			201
		);
	}

	/**
	 * Process batch tasks with optimized database operations.
	 *
	 * @param array $sanitized_tasks Array of sanitized task details.
	 * @return array Array of results for each task.
	 */
	private function process_batch_tasks( $sanitized_tasks ) {
		$results = [];

		// Step 1: Bulk check for existing tasks (single query).
		$task_ids     = \array_column( $sanitized_tasks, 'task_id' );
		$existing_map = $this->bulk_check_existing_tasks( $task_ids );

		// Step 2: Pre-fetch/create all needed provider terms.
		$provider_ids = \array_unique( \array_column( $sanitized_tasks, 'provider_id' ) );
		$term_map     = $this->ensure_provider_terms( $provider_ids );

		// Step 3: Process each task - create only those that don't exist.
		foreach ( $sanitized_tasks as $task_details ) {
			$task_id = (string) $task_details['task_id'];

			// Check if task exists from our bulk query.
			if ( isset( $existing_map[ $task_id ] ) ) {
				$existing  = $existing_map[ $task_id ];
				$results[] = [
					'success' => true,
					'post_id' => $existing->ID,
					'task'    => $this->build_task_response_from_post( $existing ),
					'message' => \esc_html__( 'Task already exists.', 'progress-planner' ),
				];
				continue;
			}

			// Prepare task data.
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

			if ( isset( $task_details['link_setting'] ) && \is_array( $task_details['link_setting'] ) ) {
				$task_data['link_setting'] = $task_details['link_setting'];
			}

			// Create the task post directly (bypass Suggested_Tasks_DB::add() to avoid per-task locking).
			$post_id = $this->create_task_post( $task_data, $term_map );

			if ( ! $post_id ) {
				$results[] = [
					'success' => false,
					'message' => \esc_html__( 'Failed to create task.', 'progress-planner' ),
				];
				continue;
			}

			$results[] = [
				'success' => true,
				'post_id' => $post_id,
				'task'    => $this->build_task_response( $post_id, $task_data ),
				'message' => \esc_html__( 'Task created successfully.', 'progress-planner' ),
			];
		}

		return $results;
	}

	/**
	 * Bulk check for existing tasks with a single database query.
	 *
	 * @param string[] $task_ids Array of task IDs to check.
	 * @return array<string, \WP_Post> Map of task_id => WP_Post for existing tasks.
	 */
	private function bulk_check_existing_tasks( array $task_ids ) {
		if ( empty( $task_ids ) ) {
			return [];
		}

		// Convert task IDs to post slugs.
		$slugs         = [];
		$trashed_slugs = [];
		foreach ( $task_ids as $task_id ) {
			$slug            = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task_id );
			$slugs[]         = $slug;
			$trashed_slugs[] = $slug . '__trashed';
		}

		// Single query for all tasks (including trashed).
		$all_slugs = \array_merge( $slugs, $trashed_slugs );
		$posts     = \get_posts(
			[
				'post_type'      => 'prpl_recommendations',
				'post_status'    => [ 'publish', 'trash', 'draft', 'future', 'pending' ],
				'post_name__in'  => $all_slugs,
				'posts_per_page' => \count( $all_slugs ),
				'no_found_rows'  => true,
			]
		);

		// Build map of task_id => post.
		$map = [];
		foreach ( $posts as $post ) {
			// Find the original task_id this post belongs to.
			$slug = $post->post_name;
			// Remove __trashed suffix if present.
			$clean_slug = \preg_replace( '/__trashed$/', '', $slug );

			// Find matching task_id.
			foreach ( $task_ids as $task_id ) {
				$expected_slug = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task_id );
				if ( $clean_slug === $expected_slug ) {
					$map[ $task_id ] = $post;
					break;
				}
			}
		}

		return $map;
	}

	/**
	 * Ensure all provider terms exist, creating any that don't.
	 *
	 * @param string[] $provider_ids Array of provider IDs.
	 * @return array<string, int> Map of provider_id => term_id.
	 */
	private function ensure_provider_terms( array $provider_ids ) {
		if ( empty( $provider_ids ) ) {
			return [];
		}

		$taxonomy = 'prpl_recommendations_provider';
		$term_map = [];

		// Get all existing terms in one query.
		$existing_terms = \get_terms(
			[
				'taxonomy'   => $taxonomy,
				'name'       => $provider_ids,
				'hide_empty' => false,
			]
		);

		if ( ! \is_wp_error( $existing_terms ) ) {
			foreach ( $existing_terms as $term ) {
				$term_map[ $term->name ] = $term->term_id;
			}
		}

		// Create any missing terms.
		foreach ( $provider_ids as $provider_id ) {
			if ( ! isset( $term_map[ $provider_id ] ) ) {
				$result = \wp_insert_term( $provider_id, $taxonomy );
				if ( ! \is_wp_error( $result ) ) {
					$term_map[ $provider_id ] = $result['term_id'];
				}
			}
		}

		return $term_map;
	}

	/**
	 * Create a task post directly (optimized for batch processing).
	 *
	 * @param array<string, mixed> $task_data The task data.
	 * @param array<string, int>   $term_map  Map of provider_id => term_id.
	 * @return int|false The post ID or false on failure.
	 */
	private function create_task_post( array $task_data, array $term_map ) {
		$args = [
			'post_type'    => 'prpl_recommendations',
			'post_title'   => $task_data['post_title'],
			'post_content' => $task_data['description'] ?? '',
			'post_status'  => 'publish',
			'menu_order'   => $task_data['order'] ?? 0,
			'post_name'    => \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( (string) $task_data['task_id'] ),
		];

		$post_id = \wp_insert_post( $args );
		if ( ! $post_id ) {
			return false;
		}

		// Set provider term using pre-fetched term_id.
		$provider_id = (string) $task_data['provider_id'];
		if ( isset( $term_map[ $provider_id ] ) ) {
			\wp_set_post_terms( $post_id, [ $term_map[ $provider_id ] ], 'prpl_recommendations_provider' );
		}

		// Set meta fields.
		$meta_fields = [
			'task_id',
			'priority',
			'points',
			'url',
			'url_target',
			'external_link_url',
			'dismissable',
			'link_setting',
		];

		foreach ( $meta_fields as $field ) {
			if ( isset( $task_data[ $field ] ) ) {
				\update_post_meta( $post_id, "prpl_$field", $task_data[ $field ] );
			}
		}

		return $post_id;
	}

	/**
	 * Build task response from an existing post object.
	 *
	 * @param \WP_Post $post The post object.
	 * @return array The task response data.
	 */
	private function build_task_response_from_post( $post ) {
		// Fetch all meta values.
		$priority      = \get_post_meta( $post->ID, 'prpl_priority', true );
		$points        = \get_post_meta( $post->ID, 'prpl_points', true );
		$url           = \get_post_meta( $post->ID, 'prpl_url', true );
		$url_target    = \get_post_meta( $post->ID, 'prpl_url_target', true );
		$external_link = \get_post_meta( $post->ID, 'prpl_external_link_url', true );
		$link_setting  = \get_post_meta( $post->ID, 'prpl_link_setting', true );

		return [
			'id'                 => $post->ID,
			'date'               => $post->post_date,
			'date_gmt'           => $post->post_date_gmt,
			'modified'           => $post->post_modified,
			'modified_gmt'       => $post->post_modified_gmt,
			'slug'               => $post->post_name,
			'status'             => $post->post_status,
			'type'               => $post->post_type,
			'link'               => \get_permalink( $post->ID ),
			'title'              => [
				'rendered' => $post->post_title,
			],
			'content'            => [
				'rendered' => $post->post_content,
			],
			'menu_order'         => $post->menu_order,
			'prpl_priority'      => $priority ? $priority : 50,
			'prpl_points'        => $points ? $points : 1,
			'prpl_url'           => $url ? $url : '',
			'prpl_url_target'    => $url_target ? $url_target : '_self',
			'prpl_external_link' => $external_link ? $external_link : '',
			'prpl_dismissable'   => (bool) \get_post_meta( $post->ID, 'prpl_dismissable', true ),
			'prpl_link_setting'  => $link_setting ? $link_setting : null,
			'prpl_provider'      => $this->get_post_provider( $post->ID ),
		];
	}

	/**
	 * Get the provider ID for a post.
	 *
	 * @param int $post_id The post ID.
	 * @return string|null The provider ID or null.
	 */
	private function get_post_provider( $post_id ) {
		$terms = \wp_get_post_terms( $post_id, 'prpl_recommendations_provider' );
		if ( ! empty( $terms ) && ! \is_wp_error( $terms ) ) {
			return $terms[0]->name;
		}
		return null;
	}

	/**
	 * Create a single task (internal helper).
	 *
	 * @param array $task_details The task details.
	 * @return array|\WP_Error Result array with task data or WP_Error.
	 */
	private function create_single_task( $task_details ) {
		// Check if task already exists.
		$existing_task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_details['task_id'] );
		if ( $existing_task ) {
			// Task already exists, return full task data.
			$task_data = $this->get_full_task_data( $existing_task->ID );
			return [
				'success' => true,
				'post_id' => $existing_task->ID,
				'task'    => $task_data,
				'message' => \esc_html__( 'Task already exists.', 'progress-planner' ),
			];
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

		// Build response directly from task data (avoids expensive internal REST call).
		$full_task_data = $this->build_task_response( $post_id, $task_data );

		return [
			'success' => true,
			'post_id' => $post_id,
			'task'    => $full_task_data,
			'message' => \esc_html__( 'Task created successfully.', 'progress-planner' ),
		];
	}

	/**
	 * Get full task data via REST API internal request.
	 * Used for existing tasks where we don't have the original data.
	 *
	 * @param int $post_id The post ID.
	 * @return array|null The task data or null on error.
	 */
	private function get_full_task_data( $post_id ) {
		$request = new \WP_REST_Request( 'GET', '/wp/v2/prpl_recommendations/' . $post_id );
		$request->set_param( '_embed', true );
		$response = \rest_do_request( $request );

		if ( $response->is_error() ) {
			return null;
		}

		return $response->get_data();
	}

	/**
	 * Build task response directly from task data (avoids internal REST call).
	 *
	 * @param int   $post_id   The post ID.
	 * @param array $task_data The task data used to create the post.
	 * @return array The task response data.
	 */
	private function build_task_response( $post_id, $task_data ) {
		$post = \get_post( $post_id );
		if ( ! $post ) {
			return null;
		}

		// Build response matching REST API format.
		return [
			'id'                 => $post_id,
			'date'               => $post->post_date,
			'date_gmt'           => $post->post_date_gmt,
			'modified'           => $post->post_modified,
			'modified_gmt'       => $post->post_modified_gmt,
			'slug'               => $post->post_name,
			'status'             => $post->post_status,
			'type'               => $post->post_type,
			'link'               => \get_permalink( $post_id ),
			'title'              => [
				'rendered' => $task_data['post_title'],
			],
			'content'            => [
				'rendered' => $task_data['description'] ?? '',
			],
			'menu_order'         => $post->menu_order,
			'prpl_priority'      => $task_data['priority'] ?? 50,
			'prpl_points'        => $task_data['points'] ?? 1,
			'prpl_url'           => $task_data['url'] ?? '',
			'prpl_url_target'    => $task_data['url_target'] ?? '_self',
			'prpl_external_link' => $task_data['external_link_url'] ?? '',
			'prpl_dismissable'   => $task_data['dismissable'] ?? false,
			'prpl_link_setting'  => $task_data['link_setting'] ?? null,
			'prpl_provider'      => $task_data['provider_id'],
		];
	}
}
