<?php
/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Activities\Suggested_Task as Suggested_Task_Activity;
use Progress_Planner\Suggested_Tasks\Tasks_Manager;

/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */
class Suggested_Tasks {

	const STATUS_MAP = [
		'completed'           => 'trash',
		'pending_celebration' => 'pending_celebration',
		'pending'             => 'publish',
		'snoozed'             => 'future',
	];

	/**
	 * An object containing tasks.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Tasks_Manager|null
	 */
	private $tasks_manager;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->tasks_manager = new Tasks_Manager();

		if ( \is_admin() ) {
			\add_action( 'init', [ $this, 'init' ], 100 ); // Wait for the post types to be initialized.
		}
		\add_action( 'wp_ajax_progress_planner_suggested_task_action', [ $this, 'suggested_task_action' ] );

		// Add the automatic updates complete action.
		\add_action( 'automatic_updates_complete', [ $this, 'on_automatic_updates_complete' ] );

		// Register the custom post type.
		\add_action( 'init', [ $this, 'register_post_type' ], 0 );

		// Register the custom taxonomies.
		\add_action( 'init', [ $this, 'register_taxonomy' ], 0 );

		// Filter the REST API tax query.
		\add_filter( 'rest_prpl_recommendations_query', [ $this, 'rest_api_tax_query' ], 10, 2 );

		// Add the custom post status.
		\add_action( 'init', [ $this, 'register_post_status' ], 1 );
	}

	/**
	 * Run the tasks.
	 *
	 * @return void
	 */
	public function init() {
		// Check for completed tasks.
		$completed_tasks = $this->tasks_manager->evaluate_tasks(); // @phpstan-ignore-line method.nonObject

		foreach ( $completed_tasks as $task ) {

			// Get the task data.
			$task_data = $task->get_data();

			if ( ! isset( $task_data['task_id'] ) && ! isset( $task_data['ID'] ) ) {
				continue;
			}

			// Update the task data.
			$task_post = $this->get_post( $task_data['task_id'] ?? $task_data['ID'] );
			if ( ! $task_post ) {
				continue;
			}
			$this->update_recommendation( $task_post['ID'], $task_data );

			// Change the task status to pending celebration.
			$task_post = \progress_planner()->get_suggested_tasks()->get_post( $task_data['task_id'] );
			if ( ! $task_post ) {
				continue;
			}
			\progress_planner()->get_suggested_tasks()->update_recommendation( $task_post['ID'], [ 'post_status' => 'pending_celebration' ] );

			// Insert an activity.
			\progress_planner()->get_suggested_tasks()->insert_activity( $task_data['task_id'] );
		}
	}

	/**
	 * Insert an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function insert_activity( $task_id ) {
		// Insert an activity.
		$activity          = new Suggested_Task_Activity();
		$activity->type    = 'completed';
		$activity->data_id = (string) $task_id;
		$activity->date    = new \DateTime();
		$activity->user_id = \get_current_user_id();
		$activity->save();

		// Allow other classes to react to the completion of a suggested task.
		do_action( 'progress_planner_suggested_task_completed', $task_id );
	}

	/**
	 * Delete an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function delete_activity( $task_id ) {
		$activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => $task_id,
				'type'    => 'completed',
			]
		);

		if ( empty( $activity ) ) {
			return;
		}

		\progress_planner()->get_activities__query()->delete_activity( $activity[0] );
	}

	/**
	 * If done via automatic updates, the "core update" task should be marked as "completed" (and skip "pending celebration" status).
	 *
	 * @return void
	 */
	public function on_automatic_updates_complete() {

		$pending_tasks = \progress_planner()->get_suggested_tasks()->get(
			[
				'numberposts' => 1,
				'post_status' => 'publish',
				'provider_id' => 'update-core',
				'date_query'  => [ [ 'after' => 'this Monday' ] ],
			]
		);

		if ( empty( $pending_tasks ) ) {
			return;
		}

		\progress_planner()->get_suggested_tasks()->update_recommendation( $pending_tasks[0]['ID'], [ 'post_status' => 'trash' ] );

		// Insert an activity.
		\progress_planner()->get_suggested_tasks()->insert_activity( $pending_tasks[0]['ID'] );
	}

	/**
	 * Get the tasks manager object.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	public function get_tasks_manager() {
		return $this->tasks_manager; // @phpstan-ignore-line return.type
	}

	/**
	 * Get recommendations, filtered by a parameter.
	 *
	 * @param array $params The parameters to filter by ([ 'provider' => 'provider_id' ] etc).
	 *
	 * @return array
	 */
	public function get_tasks_by( $params ) {
		$args = [];

		foreach ( $params as $param => $value ) {
			switch ( $param ) {
				case 'provider':
				case 'provider_id':
				case 'category':
					$args['tax_query']   = isset( $args['tax_query'] ) ? $args['tax_query'] : []; // phpcs:ignore WordPress.DB.SlowDBQuery
					$args['tax_query'][] = [
						'taxonomy' => 'category' === $param
							? 'prpl_recommendations_category'
							: 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => (array) $value,
					];

					unset( $params[ $param ] );
					break;

				case 'task_id':
					$args['meta_query']   = isset( $args['meta_query'] ) ? $args['meta_query'] : []; // phpcs:ignore WordPress.DB.SlowDBQuery
					$args['meta_query'][] = [
						'key'   => 'prpl_task_id',
						'value' => $value,
					];

					unset( $params[ $param ] );
					break;

				default:
					$args[ $param ] = $value;
					break;
			}
		}

		return $this->get( $args );
	}

	/**
	 * Get recommendations.
	 *
	 * @param array $args The arguments.
	 *
	 * @return array
	 */
	public function get( $args = [] ) {
		static $cached = [];
		$args          = \wp_parse_args(
			$args,
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'any',
				'numberposts' => -1,
				'orderby'     => 'menu_order',
				'order'       => 'ASC',
			]
		);

		$cache_key = md5( (string) \wp_json_encode( $args ) );
		if ( isset( $cached[ $cache_key ] ) ) {
			return $cached[ $cache_key ];
		}

		$cached[ $cache_key ] = $this->format_recommendations(
			\get_posts( $args )
		);

		return $cached[ $cache_key ];
	}

	/**
	 * Format recommendations results.
	 *
	 * @param array $recommendations The recommendations.
	 *
	 * @return array
	 */
	public function format_recommendations( $recommendations ) {
		$result = [];
		foreach ( $recommendations as $recommendation ) {
			$result[] = $this->format_recommendation( $recommendation );
		}

		return $result;
	}

	/**
	 * Delete all recommendations.
	 *
	 * @return void
	 */
	public function delete_all_recommendations() {
		// Get all recommendations.
		$recommendations = $this->get();

		// Delete each recommendation.
		foreach ( $recommendations as $recommendation ) {
			$this->delete_recommendation( $recommendation['ID'] );
		}
	}

	/**
	 * Delete a recommendation.
	 *
	 * @param int $id The recommendation ID.
	 *
	 * @return bool
	 */
	public function delete_recommendation( int $id ) {
		return (bool) \wp_delete_post( $id, true );
	}

	/**
	 * Transition a task from one status to another.
	 *
	 * @param int    $task_id The task ID.
	 * @param string $old_status The old status.
	 * @param string $new_status The new status.
	 *
	 * @return bool
	 */
	public function transition_task_status( $task_id, $old_status, $new_status ) {

		$tasks = $this->get( [ 'ID' => (int) $task_id ] );

		if ( empty( $tasks ) ) {
			return false;
		}

		$task = $tasks[0];

		$old_post_status = isset( self::STATUS_MAP[ $old_status ] )
			? self::STATUS_MAP[ $old_status ]
			: $old_status;
		$new_post_status = isset( self::STATUS_MAP[ $new_status ] )
			? self::STATUS_MAP[ $new_status ]
			: $new_status;

		if ( $old_post_status !== $task['post_status'] || $new_post_status === $task['post_status'] ) {
			return false;
		}

		return (bool) \wp_update_post(
			[
				'post_status' => $new_post_status,
				'ID'          => (int) $task_id,
			]
		);
	}

	/**
	 * Snooze a recommendation.
	 *
	 * @param int    $id       The recommendation ID.
	 * @param string $duration The duration to snooze the recommendation.
	 *
	 * @return bool
	 */
	public function snooze( int $id, string $duration ) {
		switch ( $duration ) {
			case '1-month':
				$new_date = \strtotime( '+1 month' );
				break;

			case '3-months':
				$new_date = \strtotime( '+3 months' );
				break;

			case '6-months':
				$new_date = \strtotime( '+6 months' );
				break;

			case '1-year':
				$new_date = \strtotime( '+1 year' );
				break;

			case 'forever':
				$new_date = \strtotime( '+10 years' );
				break;

			default:
				$new_date = \strtotime( '+1 week' );
				break;
		}

		return (bool) \wp_update_post(
			[
				'ID'            => $id,
				'post_status'   => 'future',
				'post_date'     => \gmdate( 'Y-m-d H:i:s', $new_date ),
				'post_date_gmt' => \gmdate( 'Y-m-d H:i:s', $new_date ), // Note: necessary in order to update 'post_status' to 'future'.
			]
		);
	}

	/**
	 * Check if a task meets a condition.
	 *
	 * @param array $condition The condition.
	 *                         [
	 *                           string  'type'         The condition type.
	 *                           string  'task_id'      The task id (optional, used for completed and snoozed conditions).
	 *                           array   'post_lengths' The post lengths (optional, used for snoozed-post-length condition).
	 *                         ].
	 *
	 * @return bool
	 */
	public function check_task_condition( $condition ) {
		$parsed_condition = \wp_parse_args(
			$condition,
			[
				'post_status'  => 'any',
				'task_id'      => '',
				'post_lengths' => [],
			]
		);

		foreach ( \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'post_status' => $parsed_condition['post_status'] ] ) as $task ) {
			if ( $task['task_id'] === $parsed_condition['task_id'] ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if a task was completed. Task is considered completed if it was completed or pending celebration.
	 *
	 * @param string|int $task_id The task ID.
	 *
	 * @return bool
	 */
	public function was_task_completed( $task_id ) {
		$task = $this->get_post( $task_id );
		return $task && in_array( $task['post_status'], [ 'trash', 'pending_celebration' ], true );
	}

	/**
	 * Update a recommendation.
	 *
	 * @param int   $id The recommendation ID.
	 * @param array $data The data to update.
	 *
	 * @return bool
	 */
	public function update_recommendation( $id, $data ) {
		if ( ! $id ) {
			return false;
		}

		$update_data    = [ 'ID' => $id ];
		$update_meta    = [];
		$update_terms   = [];
		$update_results = [];
		foreach ( $data as $key => $value ) {
			switch ( $key ) {
				case 'points':
				case 'prpl_points':
					$update_meta[ 'prpl_' . str_replace( 'prpl_', '', (string) $key ) ] = $value;
					break;

				case 'category':
				case 'provider':
					$update_terms[ "prpl_recommendations_$key" ] = $value;
					break;

				default:
					$update_data[ $key ] = $value;
					break;
			}
		}

		if ( 1 < count( $update_data ) ) {
			$update_results[] = (bool) \wp_update_post( $update_data );
		}

		if ( ! empty( $update_meta ) ) {
			foreach ( $update_meta as $key => $value ) {
				$update_results[] = (bool) \update_post_meta( $id, $key, $value );
			}
		}

		if ( ! empty( $update_terms ) ) {
			foreach ( $update_terms as $taxonomy => $term ) {
				$update_results[] = (bool) \wp_set_post_terms( $id, $term->term_id, $taxonomy );
			}
		}

		return ! in_array( false, $update_results, true );
	}

	/**
	 * Handle the suggested task action.
	 *
	 * @return void
	 */
	public function suggested_task_action() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['task_id'] ) || ! isset( $_POST['action_type'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing data.', 'progress-planner' ) ] );
		}

		$action  = \sanitize_text_field( \wp_unslash( $_POST['action_type'] ) );
		$task_id = (string) \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) );
		$task    = \progress_planner()->get_suggested_tasks()->get_post( $task_id );

		if ( ! $task ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not found.', 'progress-planner' ) ] );
		}

		switch ( $action ) {
			case 'complete':
				// Mark the task as completed.
				\progress_planner()->get_suggested_tasks()->update_recommendation( $task['ID'], [ 'post_status' => 'trash' ] );

				// Insert an activity.
				\progress_planner()->get_suggested_tasks()->insert_activity( $task['ID'] );
				$updated = true;
				break;

			case 'pending':
				\progress_planner()->get_suggested_tasks()->update_recommendation( $task['ID'], [ 'post_status' => 'publish' ] );
				$updated = true;
				\progress_planner()->get_suggested_tasks()->delete_activity( $task['ID'] );
				break;

			case 'snooze':
				$duration = isset( $_POST['duration'] ) ? \sanitize_text_field( \wp_unslash( $_POST['duration'] ) ) : '';
				$updated  = $this->snooze( $task['ID'], $duration );
				break;

			case 'delete':
				$updated = $this->delete_recommendation( $task['ID'] );
				\progress_planner()->get_suggested_tasks()->delete_activity( $task['ID'] );
				break;

			default:
				\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid action.', 'progress-planner' ) ] );
		}

		/**
		 * Allow other classes to react to the completion of a suggested task.
		 *
		 * @param string $task_id The task ID.
		 * @param bool   $updated Whether the action was successful.
		 */
		\do_action( "progress_planner_ajax_task_{$action}", $task_id, $updated );

		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to save.', 'progress-planner' ) ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
	}

	/**
	 * Register a custom post type for suggested tasks.
	 *
	 * @return void
	 */
	public function register_post_type() {
		register_post_type(
			'prpl_recommendations',
			[
				'label'               => \__( 'Recommendations', 'progress-planner' ),
				'public'              => true,
				'show_ui'             => true,
				'show_in_menu'        => true,
				'show_in_nav_menus'   => true,
				'show_in_admin_bar'   => true,
				'show_in_rest'        => true,
				'supports'            => [ 'title', 'editor', 'author', 'custom-fields', 'page-attributes' ],
				'rewrite'             => false,
				'menu_icon'           => 'dashicons-admin-tools',
				'menu_position'       => 5,
				'hierarchical'        => true,
				'exclude_from_search' => true,
				'publicly_queryable'  => true,
			]
		);

		$rest_meta_fields = [
			'prpl_points'      => [
				'type'         => 'number',
				'single'       => true,
				'show_in_rest' => true,
			],
			'prpl_task_id'     => [
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
			],
			'prpl_url'         => [
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
			],
			'prpl_url_target'  => [
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
			],
			'prpl_dismissable' => [
				'type'         => 'boolean',
				'single'       => true,
				'show_in_rest' => true,
			],
		];

		foreach ( $rest_meta_fields as $key => $field ) {
			register_post_meta(
				'prpl_recommendations',
				$key,
				$field
			);
		}
	}

	/**
	 * Register a custom taxonomies for suggested tasks.
	 *
	 * @return void
	 */
	public function register_taxonomy() {
		foreach ( [
			'prpl_recommendations_category' => \__( 'Categories', 'progress-planner' ),
			'prpl_recommendations_provider' => \__( 'Providers', 'progress-planner' ),
		] as $taxonomy => $label ) {
			\register_taxonomy(
				$taxonomy,
				[ 'prpl_recommendations' ],
				[
					'public'            => defined( 'PRPL_DEBUG' ) && PRPL_DEBUG,
					'hierarchical'      => false,
					'labels'            => [
						'name' => $label,
					],
					'show_ui'           => defined( 'PRPL_DEBUG' ) && PRPL_DEBUG,
					'show_admin_column' => false,
					'query_var'         => true,
					'rewrite'           => [ 'slug' => $taxonomy ],
					'show_in_rest'      => true,
					'show_in_menu'      => defined( 'PRPL_DEBUG' ) && PRPL_DEBUG,
				]
			);
		}
	}

	/**
	 * Filter the REST API tax query.
	 *
	 * @param array            $args The arguments.
	 * @param \WP_REST_Request $request The request.
	 *
	 * @return array
	 */
	public function rest_api_tax_query( $args, $request ) {
		$tax_query = [];

		// Include terms (matches any term in list).
		if ( isset( $request['provider'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'prpl_recommendations_provider',
				'field'    => 'slug',
				'terms'    => explode( ',', $request['provider'] ),
				'operator' => 'IN',
			];
		}

		// Exclude terms.
		if ( isset( $request['exclude_provider'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'prpl_recommendations_provider',
				'field'    => 'slug',
				'terms'    => explode( ',', $request['exclude_provider'] ),
				'operator' => 'NOT IN',
			];
		}

		if ( ! empty( $tax_query ) ) {
			$args['tax_query'] = $tax_query;
		}

		return $args;
	}

	/**
	 * Register a custom post status.
	 *
	 * @return void
	 */
	public function register_post_status() {
		register_post_status(
			'pending_celebration',
			[
				'label'               => _x( 'Pending Celebration', 'post', 'progress-planner' ),
				'public'              => false,
				'exclude_from_search' => true,
				'show_in_admin_bar'   => false,
				'show_in_menu'        => false,
				'show_in_nav_menus'   => false,
				'show_in_rest'        => true,
				'show_in_quick_edit'  => false,
				'show_in_table'       => false,
			]
		);
	}

	/**
	 * Add a recommendation.
	 *
	 * @param array $data The data to add.
	 *
	 * @return int
	 */
	public function add( $data ) {
		if ( empty( $data['post_title'] ) ) {
			error_log( 'Task not added - missing title: ' . wp_json_encode( $data ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return 0;
		}

		// Check if we have an existing task with the same title.
		$posts = $this->get_tasks_by(
			[
				'post_status' => 'all',
				'numberposts' => 1,
				'task_id'     => $data['task_id'],
			]
		);

		// If we have an existing task, skip.
		if ( ! empty( $posts ) ) {
			return $posts[0]['ID'];
		}

		$data['post_status'] = $data['post_status'] ?? 'publish';

		$args = [
			'post_type'    => 'prpl_recommendations',
			'post_title'   => $data['post_title'],
			'post_content' => $data['description'] ?? '',
			'menu_order'   => $data['order'] ?? 0,
		];
		switch ( $data['post_status'] ) {
			case 'pending_celebration':
				$args['post_status'] = 'pending_celebration';
				break;

			case 'completed':
				$args['post_status'] = 'trash';
				break;

			case 'snoozed':
				$args['post_status'] = 'future';
				$args['post_date']   = \DateTime::createFromFormat( 'U', $data['time'] )->format( 'Y-m-d H:i:s' );
				break;

			default:
				$args['post_status'] = 'publish';
				break;
		}

		$post_id = \wp_insert_post( $args );

		// Add terms if they don't exist.
		foreach ( [ 'category', 'provider_id' ] as $context ) {
			$taxonomy_name = str_replace( '_id', '', $context );
			$term          = \get_term_by( 'name', $data[ $context ], "prpl_recommendations_$taxonomy_name" );
			if ( ! $term ) {
				\wp_insert_term( $data[ $context ], "prpl_recommendations_$taxonomy_name" );
			}
		}

		// Set the task category.
		\wp_set_post_terms( $post_id, $data['category'], 'prpl_recommendations_category' );

		// Set the task provider.
		\wp_set_post_terms( $post_id, $data['provider_id'], 'prpl_recommendations_provider' );

		// Set the task parent.
		if ( ! empty( $data['parent'] ) ) {
			$parent = \get_post( $data['parent'] );
			if ( $parent ) {
				\wp_update_post(
					[
						'ID'          => $post_id,
						'post_parent' => $parent->ID,
					]
				);
			}
		}

		// Set other meta.
		$default_keys = [
			'title',
			'description',
			'status',
			'category',
			'provider_id',
			'parent',
			'order',
			'post_status',
		];
		foreach ( $data as $key => $value ) {
			if ( in_array( $key, $default_keys, true ) ) {
				continue;
			}

			\update_post_meta( $post_id, "prpl_$key", $value );
		}

		return $post_id;
	}

	/**
	 * Format a recommendation.
	 *
	 * @param \WP_Post $post The recommendation post.
	 *
	 * @return array
	 */
	public function format_recommendation( $post ) {
		static $cached = [];
		if ( isset( $cached[ $post->ID ] ) ) {
			return $cached[ $post->ID ];
		}

		$post_data = (array) $post;

		// Format the post meta.
		$post_meta = \get_post_meta( $post_data['ID'] );
		foreach ( $post_meta as $key => $value ) {
			$post_data[ str_replace( 'prpl_', '', (string) $key ) ] =
				is_array( $value ) && isset( $value[0] ) && 1 === count( $value )
					? $value[0]
					: $value;
		}

		foreach ( [ 'category', 'provider' ] as $context ) {
			$terms                 = \wp_get_post_terms( $post_data['ID'], "prpl_recommendations_$context" );
			$post_data[ $context ] = is_array( $terms ) && isset( $terms[0] ) ? $terms[0] : null;
		}

		$cached[ $post_data['ID'] ] = $post_data;
		return $post_data;
	}

	/**
	 * Check if a recommendation is completed.
	 *
	 * @param int $id The recommendation ID.
	 *
	 * @return bool
	 */
	public function is_completed( int $id ) {
		// Get the post status.
		$post_status = \get_post_status( $id );
		return 'pending_celebration' === $post_status || 'trash' === $post_status;
	}

	/**
	 * Get the post-ID of a recommendation.
	 *
	 * @param string|int $id The recommendation ID. Can be a task-ID or a post-ID.
	 *
	 * @return array|false The recommendation post or false if not found.
	 */
	public function get_post( $id ) {
		$posts = $this->get_tasks_by(
			is_numeric( $id )
				? [ 'ID' => $id ]
				: [ 'task_id' => $id ]
		);

		return isset( $posts[0] ) ? $posts[0] : false;
	}
}
