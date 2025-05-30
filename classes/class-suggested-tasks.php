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

	/**
	 * Status map for task statuses.
	 *
	 * @var array<string, string>
	 */
	const STATUS_MAP = [
		'completed'           => 'trash',
		'pending_celebration' => 'pending_celebration',
		'pending'             => 'publish',
		'snoozed'             => 'future',
	];

	/**
	 * An object containing tasks.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	private Tasks_Manager $tasks_manager;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->tasks_manager = new Tasks_Manager();

		if ( \is_admin() ) {
			\add_action( 'init', [ $this, 'init' ], 100 ); // Wait for the post types to be initialized.

			// Check GET parameter and maybe set task as pending celebration.
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

		// Add the custom post status.
		\add_action( 'init', [ $this, 'register_post_status' ], 1 );
	}

	/**
	 * Run the tasks.
	 *
	 * @return void
	 */
	public function init(): void {
		// Check for completed tasks.
		$completed_tasks = $this->tasks_manager->evaluate_tasks();

		foreach ( $completed_tasks as $task ) {
			if ( ! $task->task_id && $task->ID ) {
				continue;
			}

			// Change the task status to pending celebration.
			$task->celebrate();

			// Insert an activity.
			$this->insert_activity( $task->task_id );
		}
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
		do_action( 'progress_planner_suggested_task_completed', $task_id );
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
	 * If done via automatic updates, the "core update" task should be marked as "completed" (and skip "pending celebration" status).
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
		$this->insert_activity( $pending_tasks[0]->ID );
	}

	/**
	 * Get the tasks manager.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	public function get_tasks_manager(): Tasks_Manager {
		return $this->tasks_manager;
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
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $id );
		if ( ! $task ) {
			return false;
		}

		return $task->snooze( $duration );
	}

	/**
	 * Check if a task was completed. Task is considered completed if it was completed or pending celebration.
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

		if ( ! $this->was_task_completed( $task_id ) ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

			if ( $task ) {
				\progress_planner()->get_suggested_tasks_db()->update_recommendation( $task->ID, [ 'post_status' => 'pending_celebration' ] );
			}
		}
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

		$updated = false;

		switch ( $action ) {
			case 'complete':
				// Insert an activity.
				$this->insert_activity( $task->task_id );
				$updated = true;
				break;

			case 'pending':
			case 'delete':
				$this->delete_activity( $task->task_id );
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
		register_post_type(
			'prpl_recommendations',
			[
				'label'                 => \__( 'Recommendations', 'progress-planner' ),
				'public'                => true,
				'show_ui'               => true,
				'show_in_menu'          => true,
				'show_in_nav_menus'     => true,
				'show_in_admin_bar'     => true,
				'show_in_rest'          => true,
				'rest_controller_class' => \Progress_Planner\Rest\Recommendations_Controller::class,
				'supports'              => [ 'title', 'editor', 'author', 'custom-fields', 'page-attributes' ],
				'rewrite'               => false,
				'menu_icon'             => 'dashicons-admin-tools',
				'menu_position'         => 5,
				'hierarchical'          => true,
				'exclude_from_search'   => true,
				'publicly_queryable'    => true,
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
			'prpl_snoozable'   => [
				'type'         => 'boolean',
				'single'       => true,
				'show_in_rest' => true,
			],
			'menu_order'       => [
				'type'         => 'number',
				'single'       => true,
				'show_in_rest' => true,
				'default'      => 0,
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
			$args['tax_query'] = $tax_query; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		}

		// Handle sorting parameters.
		if ( isset( $request['filter']['orderby'] ) ) {
			$args['orderby'] = sanitize_sql_orderby( $request['filter']['orderby'] );
		}
		if ( isset( $request['filter']['order'] ) ) {
			$args['order'] = in_array( strtoupper( $request['filter']['order'] ), [ 'ASC', 'DESC' ], true )
				? strtoupper( $request['filter']['order'] )
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
		$provider_term = wp_get_object_terms( $post->ID, 'prpl_recommendations_provider' );
		if ( $provider_term && ! is_wp_error( $provider_term ) ) {
			$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $provider_term[0]->slug );

			if ( $provider ) {
				// Link should be added during run time, since it is not added for users without required capability.
				$response->data['meta']['prpl_url'] = $response->data['meta']['prpl_url'] && $provider->capability_required()
				? \esc_url( (string) $response->data['meta']['prpl_url'] )
				: '';
			}
		}

		return $response;
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
}
