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
	 * Mark the first task in the todo list as "GOLDEN" for bonus points.
	 *
	 * The GOLDEN task concept:
	 * - The first task in the user's todo list receives special "GOLDEN" status
	 * - Completing a GOLDEN task awards bonus points to encourage task completion
	 * - The GOLDEN status is stored in the post_excerpt field with the value "GOLDEN"
	 * - Only one task can be GOLDEN at a time (all others have empty post_excerpt)
	 *
	 * Weekly reset mechanism:
	 * - Runs automatically on Monday of each week
	 * - Re-evaluates which task should be GOLDEN based on current todo list order
	 * - If tasks are reordered during the week, the GOLDEN status updates on next Monday
	 * - Uses a transient cache to prevent running more than once per week
	 * - Cache key: 'todo_points_change_on_monday', expires next Monday
	 *
	 * This encourages users to:
	 * - Prioritize their most important task each week
	 * - Maintain an active todo list
	 * - Complete tasks in a strategic order
	 *
	 * @return void
	 */
	public function maybe_change_first_item_points_on_monday() {
		// Get all user-created tasks, ordered by menu_order ASC (task priority).
		$pending_items = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
			[
				'provider_id' => 'user',
				'post_status' => 'publish',
			]
		);

		// Bail if there are no tasks to process.
		if ( ! \count( $pending_items ) ) {
			return;
		}

		// Check if we've already updated this week (prevents multiple runs).
		$transient_name = 'todo_points_change_on_monday';
		$next_update    = \progress_planner()->get_utils__cache()->get( $transient_name );

		if ( false !== $next_update && $next_update > \time() ) {
			return;
		}

		// Calculate next Monday's timestamp for the cache expiration.
		$next_monday = new \DateTime( 'monday next week' );

		// Update GOLDEN status: First task gets 'GOLDEN', all others get empty string.
		// This ensures only the highest-priority task awards bonus points.
		foreach ( $pending_items as $task ) {
			\progress_planner()->get_suggested_tasks_db()->update_recommendation(
				$task->ID,
				[ 'post_excerpt' => $task->ID === $pending_items[0]->ID ? 'GOLDEN' : '' ]
			);
		}

		// Cache the next update time to prevent re-running until next Monday.
		\progress_planner()->get_utils__cache()->set( $transient_name, $next_monday->getTimestamp(), WEEK_IN_SECONDS );
	}

	/**
	 * Handle the creation of user tasks and assign GOLDEN status if appropriate.
	 *
	 * This runs after a task is created via the REST API. We need this separate hook
	 * because `maybe_change_first_item_points_on_monday()` runs on 'init', which happens
	 * before any tasks exist on first plugin activation.
	 *
	 * GOLDEN task assignment:
	 * - If this is the very first user task created, it immediately becomes GOLDEN
	 * - This provides instant bonus points for users starting their first task
	 * - Subsequent tasks follow the normal Monday reset cycle
	 *
	 * @param \WP_Post         $post      Inserted or updated post object.
	 * @param \WP_REST_Request $request   Request object.
	 * @param bool             $creating  True when creating a new task, false when updating existing.
	 *
	 * @return void
	 */
	public function handle_creating_user_task( $post, $request, $creating ) {
		if ( ! $creating || ! \has_term( 'user', 'prpl_recommendations_provider', $post->ID ) ) {
			return;
		}

		// Add task_id to the post.
		\wp_update_post(
			[
				'ID'        => $post->ID,
				'post_name' => 'user-' . $post->ID,
			]
		);

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
