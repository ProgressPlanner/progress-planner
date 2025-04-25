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
		\add_action( 'wp_ajax_progress_planner_save_user_suggested_task', [ $this, 'save_user_suggested_task' ] );
		\add_action( 'wp_ajax_progress_planner_save_suggested_user_tasks_order', [ $this, 'save_suggested_user_tasks_order' ] );

		\add_action( 'init', [ $this, 'maybe_change_first_item_points_on_monday' ] );
	}

	/**
	 * Get the pending todo list items.
	 *
	 * @return array
	 */
	public function get_items() {
		return array_merge( $this->get_pending_items(), $this->get_completed_items() );
	}

	/**
	 * Get the completed todo list items.
	 *
	 * @return array
	 */
	public function get_completed_items() {
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', 'user' );

		$items = [];
		foreach ( $tasks as $task ) {
			if ( 'completed' === $task['status'] ) {
				$items[] = [
					...$task,
					'dismissable' => true,
					'snoozable'   => false,
				];
			}
		}

		return $items;
	}

	/**
	 * Get the pending todo list items.
	 *
	 * @return array
	 */
	public function get_pending_items() {
		$tasks = \progress_planner()->get_recommendations()->get_by_provider( 'user' );
		$items = [];

		foreach ( $tasks as $task ) {
			// Skip non-pending tasks.
			if ( 'publish' !== $task->post_status ) {
				continue;
			}

			$items[] = array_merge(
				$task,
				[
					'dismissable' => true,
					'snoozable'   => false,
				]
			);
		}

		return $items;
	}

	/**
	 * Save a user suggested task.
	 *
	 * @return void
	 */
	public function save_user_suggested_task() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		$task_id     = isset( $_POST['task']['task_id'] ) ? (int) \sanitize_text_field( \wp_unslash( $_POST['task']['task_id'] ) ) : 0;
		$title       = isset( $_POST['task']['title'] ) ? \sanitize_text_field( \wp_unslash( $_POST['task']['title'] ) ) : '';
		$task        = \get_post( $task_id );
		$task_exists = $task_id && $task;

		$args = [
			'ID'           => $task_exists ? (int) $task_id : 0,
			'post_title'   => (string) $title,
			'post_content' => '',
			'post_status'  => $task_exists ? $task->post_status : 'publish',
			'post_type'    => 'prpl_recommendations',
		];

		$post_id = ( $task_exists )
			? \wp_update_post( $args )
			: \wp_insert_post( $args );

		if ( ! $post_id ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to save the task.', 'progress-planner' ) ] );
		}

		$task_points = $task_exists
			? \get_post_meta( $post_id, 'prpl_points', true )
			: $this->calc_points_for_new_task();

		// We're creating a new task.
		if ( ! $task_exists ) {
			// Get the highest order.
			$tasks = \progress_planner()->get_recommendations()->get_by_provider( 'user' );
			$order = 0;
			foreach ( $tasks as $task ) {
				$order = max( $order, $task['order'] );
			}
			\wp_update_post(
				[
					'ID'         => $post_id,
					'menu_order' => $order + 1,
				]
			);
			\update_post_meta( $post_id, 'prpl_points', $task_points );
			\wp_set_post_terms( $post_id, 'user', 'prpl_recommendations_provider' );
			\wp_set_post_terms( $post_id, 'user', 'prpl_recommendations_category' );
		}

		\wp_send_json_success(
			[
				'message' => \esc_html__( 'Saved.', 'progress-planner' ),
				'points'  => $task_points, // We're using it when adding the new task to the todo list.
				'ID'      => $post_id,
			]
		);
	}

	/**
	 * Save the order of suggested user tasks.
	 *
	 * @return void
	 */
	public function save_suggested_user_tasks_order() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		$tasks = isset( $_POST['tasks'] ) ? \sanitize_text_field( \wp_unslash( $_POST['tasks'] ) ) : '';
		if ( ! $tasks ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing tasks.', 'progress-planner' ) ] );
		}

		$tasks = \array_map( 'intval', \explode( ',', $tasks ) );

		// Get tasks from the `prpl_suggested_task` post type, that have a `prpl_recommendations_provider` of `user`.
		$user_tasks = \progress_planner()->get_recommendations()->get_by_provider( 'user' );

		foreach ( $user_tasks as $task ) {
			if ( in_array( (int) $task['ID'], $tasks, true ) ) {
				\wp_update_post(
					[
						'ID'         => $task['ID'],
						'menu_order' => (int) array_search( $task['ID'], $tasks, true ),
					]
				);
			}
		}
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
			if ( 'pending' === $item['status'] && isset( $item['points'] ) && $item['points'] !== 0 ) {
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
		$pending_items = $this->get_pending_items();

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

		// Get the task IDs from the todos.
		$task_ids = array_column( $pending_items, 'task_id' );

		// Get the local tasks.
		$user_tasks = \progress_planner()->get_recommendations()->get_by_provider( 'user' );

		// Reset the points of all the tasks, except for the first one in the todo list.
		foreach ( $user_tasks as $key => $task ) {
			if ( 'publish' !== $task['post_status'] ) {
				continue;
			}
			\update_post_meta( $task['ID'], 'prpl_points', 0 === $key ? 1 : 0 );
		}

		\progress_planner()->get_utils__cache()->set( $transient_name, $next_monday->getTimestamp(), WEEK_IN_SECONDS );
	}
}
// phpcs:enable Generic.Commenting.Todo
