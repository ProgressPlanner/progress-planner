<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Handle TODO list items.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Todo class.
 */
class Todo {

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		// Wait for the CPT to be registered.
		\add_action( 'init', [ $this, 'maybe_change_first_item_points_on_monday' ] );

		// Handle user tasks creation.
		\add_action( 'rest_after_insert_prpl_recommendations', [ $this, 'handle_creating_user_task' ], 10, 3 );

		// Set a reminder for the current post.
		\add_action( 'wp_ajax_progress_planner_set_reminder', [ $this, 'set_reminder' ] );
	}

	/**
	 * Maybe change the points of the first item in the todo list on Monday.
	 *
	 * @return void
	 */
	public function maybe_change_first_item_points_on_monday() {
		// Ordered by menu_order ASC, by default.
		$pending_items = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'provider_id' => 'user',
				'post_status' => 'publish',
			]
		);

		// Bail if there are no items.
		if ( ! \count( $pending_items ) ) {
			return;
		}

		$transient_name = 'todo_points_change_on_monday';
		$next_update    = \progress_planner()->get_utils__cache()->get( $transient_name );

		if ( false !== $next_update && $next_update > \time() ) {
			return;
		}

		$next_monday = new \DateTime( 'monday next week' );

		// Reset the points of all the tasks, except for the first one in the todo list.
		foreach ( $pending_items as $task ) {
			\progress_planner()->get_suggested_tasks_db()->update_recommendation(
				$task->ID,
				[ 'points' => $task->ID === $pending_items[0]->ID ? 1 : 0 ]
			);
		}

		\progress_planner()->get_utils__cache()->set( $transient_name, $next_monday->getTimestamp(), WEEK_IN_SECONDS );
	}

	/**
	 * Handle the creation of the first user task.
	 * We need separate hook, since at the time 'maybe_change_first_item_points_on_monday' is called there might not be any tasks yet.
	 * TODO: Revisit when we see how we handle completed user tasks.
	 *
	 * @param \WP_Post         $post      Inserted or updated post object.
	 * @param \WP_REST_Request $request   Request object.
	 * @param bool             $creating  True when creating a post, false when updating.
	 *
	 * @return void
	 */
	public function handle_creating_user_task( $post, $request, $creating ) {
		if ( ! $creating || ! \has_term( 'user', 'prpl_recommendations_provider', $post->ID ) ) {
			return;
		}

		// Add task_id to the post.
		\update_post_meta( $post->ID, 'prpl_task_id', 'user-' . $post->ID );

		// If it is first task ever created, it should be golden.
		$pending_items = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'provider_id' => 'user',
			]
		);

		// If this is the first task created, it should be golden.
		if ( 1 === \count( $pending_items ) && $pending_items[0]->ID === $post->ID ) {
			$this->maybe_change_first_item_points_on_monday();
			return;
		}
	}

	/**
	 * Set a reminder for the current post.
	 *
	 * @return void
	 */
	public function set_reminder() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		$post_id = isset( $_POST['post_id'] ) ? \sanitize_text_field( \wp_unslash( $_POST['post_id'] ) ) : '';
		if ( ! $post_id ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing post ID.', 'progress-planner' ) ] );
		}

		$post_title = isset( $_POST['post_title'] ) ? \sanitize_text_field( \wp_unslash( $_POST['post_title'] ) ) : '';
		if ( ! $post_title ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing post title.', 'progress-planner' ) ] );
		}

		$reminder_date = isset( $_POST['reminder_date'] ) ? \sanitize_text_field( \wp_unslash( $_POST['reminder_date'] ) ) : '';
		if ( ! $reminder_date ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing reminder date.', 'progress-planner' ) ] );
		}

		$reminder_date_timestamp = \strtotime( $reminder_date );
		if ( ! $reminder_date_timestamp ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid reminder date.', 'progress-planner' ) ] );
		}

		// Check if we have an existing reminder for this post.
		$posts = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'post_status' => [ 'publish' ],
				'numberposts' => 1,
				'meta_query'  => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					[
						'key'     => 'prpl_target_post_id',
						'value'   => $post_id,
						'compare' => '=',
					],
					[
						'key'     => 'prpl_available_at',
						'compare' => 'EXISTS',
					],
				],
				'tax_query'   => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					[
						'taxonomy' => 'prpl_recommendations_provider',
						'field'    => 'slug',
						'terms'    => 'user',
					],
				],
			]
		);

		// If we have an existing task, skip.
		if ( ! empty( $posts ) ) {
			// Update the existing task.
			\progress_planner()->get_suggested_tasks_db()->update_recommendation(
				$posts[0]->ID,
				[
					'post_title'        => $post_title,
					'prpl_available_at' => $reminder_date_timestamp,
				]
			);
		} else {
			// We're creating a new task.
			\progress_planner()->get_suggested_tasks_db()->add(
				[
					'task_id'        => 'user-task-' . \md5( $post_id . '-' . \microtime( true ) ),
					/* translators: %s: The post title. */
					'post_title'     => \sprintf( __( 'Review %s', 'progress-planner' ), $post_title ),
					'provider_id'    => 'user',
					'category'       => 'user',
					'status'         => 'publish',
					'available_at'   => $reminder_date_timestamp,
					'target_post_id' => $post_id,
					'dismissable'    => true,
					'snoozable'      => false,
				]
			);
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Reminder set.', 'progress-planner' ) ] );
	}
}
// phpcs:enable Generic.Commenting.Todo
