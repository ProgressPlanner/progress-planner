<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Handle TODO list items.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Activities\Todo as Activities_Todo;

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
	}

	/**
	 * Get the todo list items.
	 *
	 * @return array
	 */
	public function get_items() {
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', 'user' );
		$items = [];
		foreach ( $tasks as $task ) {
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
}
// phpcs:enable Generic.Commenting.Todo
