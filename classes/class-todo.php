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
		add_action( 'init', [ $this, 'maybe_change_first_item_points_on_monday' ] );

		// Handle user tasks creation.
		\add_action( 'rest_after_insert_prpl_recommendations', [ $this, 'handle_creating_user_task' ], 10, 3 );
	}

	/**
	 * Get the pending todo list items.
	 *
	 * @return array
	 */
	public function get_items() {
		return \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => 'user' ] );
	}

	/**
	 * Get the points for a new task.
	 *
	 * @return int
	 */
	public function calc_points_for_new_task() {
		$items = $this->get_items();

		// If this is the first user task ever, return 1.
		if ( ! count( $items ) ) {
			return 1;
		}

		// Get the task IDs from the todos.
		$task_ids = array_column( $items, 'task_id' );

		// Get the completed activities for this week that are in the todos.
		$activities = array_filter(
			\progress_planner()->get_activities__query()->query_activities(
				[
					'start_date' => new \DateTime( 'monday this week' ),
					'end_date'   => new \DateTime( 'sunday this week' ),
					'category'   => 'suggested_task',
					'type'       => 'completed',
				]
			),
			function ( $activity ) use ( $task_ids ) {
				return in_array( $activity->data_id, $task_ids, true );
			}
		);

		// If there are completed todos this week, we already have set the golden task and it was completed.
		if ( count( $activities ) ) {
			return 0;
		}

		// Check if there are already pending user tasks with a points value other than 0.
		foreach ( $items as $item ) {
			if ( 'publish' === $item['post_status'] && isset( $item['points'] ) && $item['points'] !== 0 ) {
				return 0;
			}
		}

		return 1;
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
		if ( ! count( $pending_items ) ) {
			return;
		}

		$transient_name = 'todo_points_change_on_monday';
		$next_update    = \progress_planner()->get_utils__cache()->get( $transient_name );

		if ( false !== $next_update && $next_update > time() ) {
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
	 * We need separate hook, since at the time 'maybe_change_first_item_points_on_monday' is called there are no tasks yet.
	 * TODO: Revisit when we see how we handle completed user tasks.
	 *
	 * @param \WP_Post         $post      Inserted or updated post object.
	 * @param \WP_REST_Request $request   Request object.
	 * @param bool             $creating  True when creating a post, false when updating.
	 *
	 * @return void
	 */
	public function handle_creating_user_task( $post, $request, $creating ) {

		if ( ! $creating || ! has_term( 'user', 'prpl_recommendations_provider', $post->ID ) ) {
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
		if ( 1 === count( $pending_items ) && $pending_items[0]->ID === $post->ID ) {
			$this->maybe_change_first_item_points_on_monday();
			return;
		}
	}
}
// phpcs:enable Generic.Commenting.Todo
