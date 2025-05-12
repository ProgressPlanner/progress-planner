<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Handle TODO list items.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Task_Factory;

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

		$this->maybe_change_first_item_points_on_monday();
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
		$tasks = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'provider_id' => 'user' ] );

		$items = [];
		foreach ( $tasks as $task ) {
			if ( 'completed' === $task['status'] ) {
				$items[] = array_merge(
					$task,
					[
						'dismissable' => true,
						'snoozable'   => false,
					]
				);
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
		$tasks     = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'provider_id' => 'user' ] );
		$items     = [];
		$max_order = 0;

		// Get the maximum order value from the $tasks array.
		foreach ( $tasks as $task ) {
			if ( 'pending' === $task['status'] && isset( $task['order'] ) && $task['order'] > $max_order ) {
				$max_order = $task['order'];
			}
		}

		foreach ( $tasks as $task ) {
			// Skip non-pending tasks.
			if ( 'pending' !== $task['status'] ) {
				continue;
			}

			if ( ! isset( $task['order'] ) ) {
				$task['order'] = $max_order + 1;
				++$max_order;
			}
			$items[] = array_merge(
				$task,
				[
					'dismissable' => true,
					'snoozable'   => false,
				]
			);
		}

		// Order the items by the order value.
		usort(
			$items,
			function ( $a, $b ) {
				return $a['order'] - $b['order'];
			}
		);

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

		$task_id = isset( $_POST['task']['task_id'] ) ? (int) \sanitize_text_field( \wp_unslash( $_POST['task']['task_id'] ) ) : 0;

		$title = isset( $_POST['task']['title'] ) ? \sanitize_text_field( \wp_unslash( $_POST['task']['title'] ) ) : '';

		// If the task ID is set, we're updating an existing task.
		if ( $task_id ) {
			$task = \progress_planner()->get_cpt_recommendations()->get_post( $task_id );
			if ( ! $task ) {
				\wp_send_json_error( [ 'message' => \esc_html__( 'Task not found.', 'progress-planner' ) ] );
			}

			\progress_planner()->get_cpt_recommendations()->update_recommendation( $task['ID'], [ 'post_title' => $title ] );
			return;
		}

		$task_id = \wp_insert_post(
			[
				'post_title'  => $title,
				'post_status' => 'publish',
				'post_type'   => 'prpl_recommendations',
				'post_author' => \get_current_user_id(),
			]
		);

		if ( ! (bool) $task_id ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to create task.', 'progress-planner' ) ] );
		}

		$task_points = $this->calc_points_for_new_task();

		\wp_set_post_terms( $task_id, 'user', 'prpl_recommendations_provider' );
		\wp_set_post_terms( $task_id, 'user', 'prpl_recommendations_category' );
		\update_post_meta( $task_id, 'prpl_points', $task_points );

		\wp_send_json_success(
			[
				'message' => \esc_html__( 'Saved.', 'progress-planner' ),
				'points'  => $task_points, // We're using it when adding the new task to the todo list.
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
		$user_tasks = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'provider' => 'user' ] );
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
		$task_ids = array_column( $pending_items, 'ID' );

		// Reset the points of all the tasks, except for the first one in the todo list.
		foreach ( \progress_planner()->get_cpt_recommendations()->get_by_params(
			[
				'provider' => 'user',
				'status'   => 'publish',
			]
		) as $task ) {
			\progress_planner()->get_cpt_recommendations()->update_recommendation(
				$task['ID'],
				[ 'points' => $task['ID'] === $task_ids[0] ? 1 : 0 ]
			);
		}

		\progress_planner()->get_utils__cache()->set( $transient_name, $next_monday->getTimestamp(), WEEK_IN_SECONDS );
	}
}
// phpcs:enable Generic.Commenting.Todo
