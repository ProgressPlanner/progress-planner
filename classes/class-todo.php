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

		\add_action( 'progress_planner_task_status_changed', [ $this, 'remove_order_from_completed_user_task' ], 10, 2 );

		$this->maybe_change_first_item_points_on_monday();
	}

	/**
	 * Remove the order from a completed user task.
	 *
	 * @param string $task_id The task ID.
	 * @param string $status The status.
	 *
	 * @return void
	 */
	public function remove_order_from_completed_user_task( $task_id, $status ) {

		// Bail if the task is not completed.
		if ( 'completed' !== $status ) {
			return;
		}

		$task = Task_Factory::create_task_from( 'id', $task_id );

		// Bail if the task is not a user task.
		if ( 'user' !== $task->get_provider_id() ) {
			return;
		}

		$task_changed = false;
		$tasks        = \progress_planner()->get_settings()->get( 'tasks', [] );
		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] === $task_id ) {
				unset( $tasks[ $key ]['order'] );
				$task_changed = true;
				break;
			}
		}

		if ( $task_changed ) {
			\progress_planner()->get_settings()->set( 'tasks', $tasks );
		}
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
		$tasks     = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', 'user' );
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

		$task_id = isset( $_POST['task']['task_id'] ) ? \sanitize_text_field( \wp_unslash( $_POST['task']['task_id'] ) ) : '';
		if ( ! $task_id ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing task ID.', 'progress-planner' ) ] );
		}

		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] );
		$title = isset( $_POST['task']['title'] ) ? \sanitize_text_field( \wp_unslash( $_POST['task']['title'] ) ) : '';

		// Check if the task already exists (this is the update case).
		$task_index = false;
		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] === $task_id ) {
				$task_index = $key;
				break;
			}
		}

		// Default value.
		$task_points = 0;

		// We're creating a new task.
		if ( false === $task_index ) {
			$task_points = $this->calc_points_for_new_task();
			$tasks[]     = [
				'task_id'     => $task_id,
				'provider_id' => 'user',
				'category'    => 'user',
				'status'      => 'pending',
				'title'       => $title,
				'points'      => $task_points,
			];
		} else {
			$tasks[ $task_index ]['title'] = $title;
		}

		\progress_planner()->get_settings()->set( 'tasks', $tasks );
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

		$tasks       = \explode( ',', $tasks );
		$saved_tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		foreach ( $saved_tasks as $key => $task ) {
			if ( in_array( $task['task_id'], $tasks, true ) ) {
				$saved_tasks[ $key ]['order'] = array_search( $task['task_id'], $tasks, true );
			}
		}

		\progress_planner()->get_settings()->set( 'tasks', $saved_tasks );
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
		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		// Reset the points of all the tasks, except for the first one in the todo list.
		foreach ( $tasks as $key => $task ) {
			if ( 'user' === $task['provider_id'] && 'pending' === $task['status'] ) {
				$tasks[ $key ]['points'] = $tasks[ $key ]['task_id'] === $task_ids[0] ? 1 : 0;
			}
		}

		// Save the local tasks.
		\progress_planner()->get_settings()->set( 'tasks', $tasks );

		\progress_planner()->get_utils__cache()->set( $transient_name, $next_monday->getTimestamp(), WEEK_IN_SECONDS );
	}
}
// phpcs:enable Generic.Commenting.Todo
