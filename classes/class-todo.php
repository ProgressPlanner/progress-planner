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
}
// phpcs:enable Generic.Commenting.Todo
