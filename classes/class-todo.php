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
	}

	/**
	 * Get the todo list items.
	 *
	 * @return array
	 */
	public function get_items() {
		$tasks     = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', 'user' );
		$items     = [];
		$max_order = 0;

		// Get the maximum order value from the $tasks array.
		foreach ( $tasks as $task ) {
			if ( isset( $task['order'] ) && $task['order'] > $max_order ) {
				$max_order = $task['order'];
			}
		}

		foreach ( $tasks as $task ) {
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

		$local_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$title       = isset( $_POST['task']['title'] ) ? \sanitize_text_field( \wp_unslash( $_POST['task']['title'] ) ) : '';

		$task_index = false;
		foreach ( $local_tasks as $key => $task ) {
			if ( $task['task_id'] === $task_id ) {
				$task_index = $key;
				break;
			}
		}

		if ( false === $task_index ) {
			$local_tasks[] = [
				'task_id'     => $task_id,
				'provider_id' => 'user',
				'category'    => 'user',
				'status'      => 'pending',
				'title'       => $title,
			];
		} else {
			$local_tasks[ $task_index ]['title'] = $title;
		}

		\progress_planner()->get_settings()->set( 'local_tasks', $local_tasks );
		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
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

		$tasks = \explode( ',', $tasks );

		$local_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		error_log( print_r( $local_tasks, true ) );

		foreach ( $local_tasks as $key => $task ) {
			if ( in_array( $task['task_id'], $tasks, true ) ) {
				$local_tasks[ $key ]['order'] = array_search( $task['task_id'], $tasks, true );
			}
		}

		\progress_planner()->get_settings()->set( 'local_tasks', $local_tasks );
	}
}
// phpcs:enable Generic.Commenting.Todo
