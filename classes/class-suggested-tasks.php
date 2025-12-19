<?php
/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Activities\Suggested_Task as Suggested_Task_Activity;

/**
 * Recommendations class.
 *
 * @package Progress_Planner
 */
class Suggested_Tasks {

	/**
	 * Status map for task statuses.
	 * This is mostly used for backwards compatibility.
	 *
	 * @var array<string, string>
	 */
	const STATUS_MAP = [
		'completed'           => 'trash',
		'pending_celebration' => 'pending',
		'pending'             => 'publish',
		'snoozed'             => 'future',
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( \is_admin() ) {
			// Check GET parameter and maybe set task as pending.
			\add_action( 'init', [ $this, 'maybe_complete_task' ] );
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

		// Filter the REST API response.
		\add_filter( 'rest_prepare_prpl_recommendations', [ $this, 'rest_prepare_recommendation' ], 10, 2 );

		\add_filter( 'wp_trash_post_days', [ $this, 'change_trashed_posts_lifetime' ], 10, 2 );
	}

	/**
	 * Insert an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function insert_activity( string $task_id ): void {
		// Insert an activity.
		$activity          = new Suggested_Task_Activity();
		$activity->type    = 'completed';
		$activity->data_id = (string) $task_id;
		$activity->date    = new \DateTime();
		$activity->user_id = \get_current_user_id();
		$activity->save();

		// Allow other classes to react to the completion of a suggested task.
		\do_action( 'progress_planner_suggested_task_completed', $task_id );
	}

	/**
	 * Delete an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function delete_activity( string $task_id ): void {
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
	 * If done via automatic updates, the "core update" task should be marked as "trashed" (and skip "pending" status).
	 *
	 * @return void
	 */
	public function on_automatic_updates_complete(): void {
		$pending_tasks = \progress_planner()->get_suggested_tasks_db()->get(
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

		\progress_planner()->get_suggested_tasks_db()->update_recommendation( $pending_tasks[0]->ID, [ 'post_status' => 'trash' ] );

		// Insert an activity.
		$this->insert_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $pending_tasks[0]->post_name ) );
	}

	/**
	 * Check if a task was completed. Task is considered completed if it was trashed or pending.
	 *
	 * @param string|int $task_id The task ID.
	 *
	 * @return bool
	 */
	public function was_task_completed( $task_id ): bool {
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );
		return $task && $task->is_completed();
	}

	/**
	 * Maybe complete a task.
	 * Primarly this is used for deeplinking, ie user is testing if the emails are working
	 * He gets an email with a link which automatically completes the task.
	 *
	 * Verify token to prevent CSRF attacks.
	 * Tokens are one-time use and expire after 24 hours.
	 *
	 * @return void
	 */
	public function maybe_complete_task() {
		if ( ! \progress_planner()->is_on_progress_planner_dashboard_page() || ! isset( $_GET['prpl_complete_task'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$task_id = \sanitize_text_field( \wp_unslash( $_GET['prpl_complete_task'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! $task_id ) {
			return;
		}

		// Verify token to prevent CSRF attacks.
		if ( ! isset( $_GET['token'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$provided_token = \sanitize_text_field( \wp_unslash( $_GET['token'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$user_id        = \get_current_user_id();

		// Verify the token.
		if ( ! $this->verify_task_completion_token( $task_id, $user_id, $provided_token ) ) {
			return;
		}

		// Mark task as completed and delete the token.
		$this->mark_task_as_completed( $task_id, $user_id );
	}

	/**
	 * Complete a task.
	 *
	 * @param string   $task_id The task ID.
	 * @param int|null $user_id Optional. The user ID for token deletion. If provided, the token will be deleted.
	 * @param bool     $skip_celebration Optional. Whether to skip the celebration.
	 *
	 * @return bool
	 */
	public function mark_task_as_completed( $task_id, $user_id = null, $skip_celebration = false ) {
		if ( ! $this->was_task_completed( $task_id ) ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

			if ( $task ) {
				$post_status = $skip_celebration ? 'trash' : 'pending';
				\progress_planner()->get_suggested_tasks_db()->update_recommendation( $task->ID, [ 'post_status' => $post_status ] );

				// Insert an activity.
				$this->insert_activity( $task_id );

				// Delete the token after successful use (one-time use) if user_id is provided.
				if ( $user_id ) {
					$this->delete_task_completion_token( $task_id, $user_id );
				}

				return true;
			}
		}

		return false;
	}

	/**
	 * Generate a secure token for task completion via email link.
	 *
	 * This token prevents CSRF attacks by ensuring only legitimate email
	 * links can mark tasks as complete.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $user_id The user ID.
	 *
	 * @return string The generated token.
	 */
	public function generate_task_completion_token( $task_id, $user_id ) {
		// Generate a cryptographically secure random token.
		$random = \wp_generate_password( 32, false );
		$token  = \wp_hash( $task_id . $user_id . $random . \wp_salt( 'auth' ) );

		// Store the token in a transient (expires after 24 hours).
		\set_transient(
			'prpl_complete_' . $task_id . '_' . $user_id,
			$token,
			DAY_IN_SECONDS
		);

		return $token;
	}

	/**
	 * Verify a task completion token.
	 *
	 * @param string $task_id        The task ID.
	 * @param int    $user_id        The user ID.
	 * @param string $provided_token The token to verify.
	 *
	 * @return bool True if token is valid, false otherwise.
	 */
	protected function verify_task_completion_token( $task_id, $user_id, $provided_token ) {
		$stored_token = \get_transient( 'prpl_complete_' . $task_id . '_' . $user_id );

		if ( ! $stored_token ) {
			return false; // Token expired or doesn't exist.
		}

		// Use hash_equals to prevent timing attacks.
		return \hash_equals( $stored_token, $provided_token );
	}

	/**
	 * Delete a task completion token after use.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $user_id The user ID.
	 *
	 * @return bool True if deleted, false otherwise.
	 */
	protected function delete_task_completion_token( $task_id, $user_id ) {
		return \delete_transient( 'prpl_complete_' . $task_id . '_' . $user_id );
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

		if ( ! isset( $_POST['post_id'] ) || ! isset( $_POST['action_type'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing data.', 'progress-planner' ) ] );
		}

		$action  = \sanitize_text_field( \wp_unslash( $_POST['action_type'] ) );
		$post_id = (string) \sanitize_text_field( \wp_unslash( $_POST['post_id'] ) );
		$task    = \progress_planner()->get_suggested_tasks_db()->get_post( $post_id );

		if ( ! $task ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not found.', 'progress-planner' ) ] );
		}

		// Capability is checked client-side before task was shown,
		// and user must be logged in with edit_others_posts to reach this endpoint.

		$updated = false;

		switch ( $action ) {
			case 'complete':
				// Insert an activity.
				$this->insert_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ) );
				$updated = true;
				break;

			case 'pending': // User task was marked as pending.
			case 'delete':
				$this->delete_activity( \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $task->post_name ) );
				$updated = true;
				break;
		}

		/**
		 * Allow other classes to react to the completion of a suggested task.
		 *
		 * @param string $post_id The post ID.
		 * @param bool   $updated Whether the action was successful.
		 */
		\do_action( "progress_planner_ajax_task_{$action}", $post_id, $updated );

		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Not saved.', 'progress-planner' ) ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
	}

	/**
	 * Register a custom post type for suggested tasks.
	 *
	 * @return void
	 */
	public function register_post_type() {
		\register_post_type(
			'prpl_recommendations',
			[
				'label'                 => \__( 'Recommendations', 'progress-planner' ),
				'public'                => false,
				'show_ui'               => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				'show_in_admin_bar'     => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				'show_in_rest'          => true,
				'rest_controller_class' => \Progress_Planner\Rest\Recommendations_Controller::class,
				'supports'              => [ 'title', 'excerpt', 'editor', 'author', 'custom-fields', 'page-attributes' ],
				'rewrite'               => false,
				'menu_icon'             => 'dashicons-admin-tools',
				'menu_position'         => 5,
				'hierarchical'          => true,
				'exclude_from_search'   => true,
			]
		);

		$rest_meta_fields = [
			'prpl_url'   => [
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
			],
			'menu_order' => [
				'type'         => 'number',
				'single'       => true,
				'show_in_rest' => true,
				'default'      => 0,
			],
		];

		foreach ( $rest_meta_fields as $key => $field ) {
			\register_post_meta(
				'prpl_recommendations',
				$key,
				$field
			);
		}
	}

	/**
	 * Custom trash lifetime by post type.
	 *
	 * @param int      $days The number of days to keep in trash.
	 * @param \WP_Post $post The post.
	 *
	 * @return int
	 */
	public function change_trashed_posts_lifetime( $days, $post ) {
		return 'prpl_recommendations' === $post->post_type ? 60 : $days;
	}

	/**
	 * Register a custom taxonomies for suggested tasks.
	 *
	 * @return void
	 */
	public function register_taxonomy() {
		// Register only the provider taxonomy.
		\register_taxonomy(
			'prpl_recommendations_provider',
			[ 'prpl_recommendations' ],
			[
				'public'            => false,
				'hierarchical'      => false,
				'labels'            => [
					'name' => \__( 'Providers', 'progress-planner' ),
				],
				'show_ui'           => \apply_filters( 'progress_planner_tasks_show_ui', false ),
				'show_admin_column' => false,
				'query_var'         => true,
				'rewrite'           => [ 'slug' => 'prpl_recommendations_provider' ],
				'show_in_rest'      => true,
				'show_in_menu'      => \apply_filters( 'progress_planner_tasks_show_ui', false ),
			]
		);
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

		// Exclude providers.
		if ( isset( $request['exclude_provider'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'prpl_recommendations_provider',
				'field'    => 'slug',
				'terms'    => \explode( ',', $request['exclude_provider'] ),
				'operator' => 'NOT IN',
			];
		}

		// Include specific providers if requested.
		if ( isset( $request['provider'] ) ) {
			$tax_query[] = [
				'taxonomy' => 'prpl_recommendations_provider',
				'field'    => 'slug',
				'terms'    => \explode( ',', $request['provider'] ),
				'operator' => 'IN',
			];
		}

		if ( ! empty( $tax_query ) ) {
			$args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}

		// Handle sorting parameters.
		if ( isset( $request['filter']['orderby'] ) ) {
			// @phpstan-ignore-next-line argument.templateType
			$orderby         = \sanitize_sql_orderby( $request['filter']['orderby'] ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
			$args['orderby'] = $orderby !== false ? $orderby : 'date';
		}
		if ( isset( $request['filter']['order'] ) ) {
			$args['order'] = \in_array( \strtoupper( $request['filter']['order'] ), [ 'ASC', 'DESC' ], true )
				? \strtoupper( $request['filter']['order'] )
				: 'ASC';
		}

		return $args;
	}

	/**
	 * Filter the REST API response.
	 *
	 * @param \WP_REST_Response $response The response.
	 * @param \WP_Post          $post The post.
	 *
	 * @return \WP_REST_Response
	 */
	public function rest_prepare_recommendation( $response, $post ) {
		$provider_term = \wp_get_object_terms( $post->ID, 'prpl_recommendations_provider' );
		if ( ! isset( $response->data['meta'] ) ) {
			$response->data['meta'] = [];
		}

		if ( $provider_term && ! \is_wp_error( $provider_term ) ) {
			// Set prpl_provider from the term so React can identify the provider and generate actions client-side.
			$response->data['prpl_provider'] = $provider_term[0];
		}

		$response->data['slug'] = \progress_planner()->get_suggested_tasks()->get_task_id_from_slug( $response->data['slug'] );

		return $response;
	}

	/**
	 * Get the pending tasks in REST format.
	 *
	 * @param array $args The arguments.
	 *
	 * @return array
	 */
	public function get_tasks_in_rest_format( array $args = [] ) {
		$args = \wp_parse_args(
			$args,
			[
				'post_status'      => 'publish',
				'exclude_provider' => [],
				'include_provider' => [],
				'posts_per_page'   => -1,
			]
		);

		// Build query args for get_tasks_by.
		$query_args = [
			'post_status'    => $args['post_status'],
			'posts_per_page' => $args['posts_per_page'],
		];

		// Add provider filters if specified.
		if ( ! empty( $args['exclude_provider'] ) ) {
			// Note: Database filtering doesn't support exclude_provider directly,
			// so we'll fetch all tasks, filter, then limit.
			$original_limit               = $query_args['posts_per_page'];
			$query_args['posts_per_page'] = -1; // Fetch all tasks.
			$all_tasks                    = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );
			$all_tasks                    = \array_filter(
				$all_tasks,
				function ( $task ) use ( $args ) {
					return ! \in_array( $task->get_provider_id(), $args['exclude_provider'], true );
				}
			);
			// Now limit to the originally requested number.
			if ( -1 !== $original_limit ) {
				$all_tasks = \array_slice( $all_tasks, 0, $original_limit );
			}
		} elseif ( ! empty( $args['include_provider'] ) ) {
			$query_args['provider'] = $args['include_provider'];
			$all_tasks              = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );
		} else {
			$all_tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $query_args );
		}

		// Convert tasks to REST format.
		$tasks = [];
		foreach ( $all_tasks as $task ) {
			$tasks[] = $task->get_rest_formatted_data();
		}

		/**
		 * Allow other classes to modify the tasks in REST format.
		 *
		 * @param array $tasks The tasks.
		 * @param array $args  The arguments.
		 *
		 * @return array
		 */
		return \apply_filters( 'progress_planner_suggested_tasks_in_rest_format', $tasks, $args );
	}

	/**
	 * Get the task ID from a slug.
	 *
	 * @param string $slug The slug.
	 * @return string
	 */
	public function get_task_id_from_slug( $slug ) {
		return \explode( '__trashed', $slug )[0];
	}
}
