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
	 * The name of the settings option.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'progress_planner_todo';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\add_action( 'wp_ajax_progress_planner_save_todo_list', [ $this, 'save' ] );
		\add_action( 'wp_ajax_progress_planner_save_user_suggested_task', [ $this, 'save_user_suggested_task' ] );
	}

	/**
	 * Get the todo list items.
	 *
	 * @return array
	 */
	public function get_items() {
		$value = \get_option( self::OPTION_NAME, [] );
		foreach ( $value as $key => $item ) {
			if ( ! isset( $item['content'] ) || empty( $item['content'] ) ) {
				unset( $value[ $key ] );
			}
			$value[ $key ]['content'] = \wp_kses_post( $item['content'] );
		}

		return array_values( $value );
	}

	/**
	 * Save the todo list.
	 *
	 * @return void
	 */
	public function save() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['todo_list'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing data.', 'progress-planner' ) ] );
		}

		if ( $_POST['todo_list'] === 'empty' ) {
			\delete_option( self::OPTION_NAME );
			\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
		}

		$items          = [];
		$previous_items = self::get_items();

		if ( ! empty( $_POST['todo_list'] ) ) {
			foreach ( array_values( \wp_unslash( $_POST['todo_list'] ) ) as $item ) { // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
				$items[] = [
					'content' => \wp_strip_all_tags( \sanitize_text_field( $item['content'] ) ),
					'done'    => true === $item['done'] || 'true' === $item['done'],
				];
			}
		}

		if ( ! \update_option( self::OPTION_NAME, $items ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to save.', 'progress-planner' ) ] );
		}

		// Save the activity.
		$activity       = new Activities_Todo();
		$activity->type = 'update';
		if ( count( $items ) > count( $previous_items ) ) {
			$activity->type = 'add';
		} elseif ( count( $items ) < count( $previous_items ) ) {
			$activity->type = 'delete';
		}
		$activity->save();

		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
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
