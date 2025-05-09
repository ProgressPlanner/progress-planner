<?php
/**
 * Handle suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Tasks_Manager;
use Progress_Planner\Suggested_Tasks\Task_Factory;
/**
 * Suggested_Tasks class.
 */
class Suggested_Tasks {

	/**
	 * An object containing tasks.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Tasks_Manager|null
	 */
	private $tasks_manager;

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->tasks_manager = new Tasks_Manager();

		\add_action( 'wp_ajax_progress_planner_suggested_task_action', [ $this, 'suggested_task_action' ] );

		if ( \is_admin() ) {
			\add_action( 'init', [ $this, 'init' ], 100 ); // Wait for the post types to be initialized.
		}

		// Add the automatic updates complete action.
		\add_action( 'automatic_updates_complete', [ $this, 'on_automatic_updates_complete' ] );
	}

	/**
	 * Run the tasks.
	 *
	 * @return void
	 */
	public function init() {
		// Check for completed tasks.
		$completed_tasks = $this->tasks_manager->evaluate_tasks(); // @phpstan-ignore-line method.nonObject

		foreach ( $completed_tasks as $task ) {

			// Get the task data.
			$task_data = $task->get_data();

			// Update the task data.
			$this->update_pending_task( $task_data['task_id'], $task_data );

			// Change the task status to pending celebration.
			$task_post = \progress_planner()->get_cpt_recommendations()->get_post( $task_data['task_id'] );
			if ( ! $task_post ) {
				continue;
			}
			\progress_planner()->get_cpt_recommendations()->update_recommendation( $task_post['ID'], [ 'post_status' => 'pending_celebration' ] );

			// Insert an activity.
			\progress_planner()->get_cpt_recommendations()->insert_activity( $task_data['task_id'] );
		}
	}

	/**
	 * If done via automatic updates, the "core update" task should be marked as "completed" (and skip "pending celebration" status).
	 *
	 * @return void
	 */
	public function on_automatic_updates_complete() {

		$pending_tasks = \progress_planner()->get_cpt_recommendations()->get(
			[
				'numberposts' => 1,
				'post_status' => 'publish',
				'provider_id' => 'update-core',
				'date_query'  => [ [ 'after' => 'this Monday' ] ],
			]
		);

		if ( empty( $pending_tasks ) ) {
			return;
		}

		\progress_planner()->get_cpt_recommendations()->update_recommendation( $pending_tasks[0]['ID'], [ 'post_status' => 'trash' ] );

		// Insert an activity.
		\progress_planner()->get_cpt_recommendations()->insert_activity( $pending_tasks[0]['ID'] );
	}

	/**
	 * Get the tasks manager object.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	public function get_tasks_manager() {
		return $this->tasks_manager; // @phpstan-ignore-line return.type
	}

	/**
	 * Return filtered items.
	 *
	 * @return array
	 */
	public function get_tasks() {
		\do_action( 'progress_planner_suggested_tasks_items' );

		return \progress_planner()->get_cpt_recommendations()->get( [ 'post_status' => 'any' ] );
	}

	/**
	 * Get pending tasks with details.
	 *
	 * @return array
	 */
	public function get_pending_tasks_with_details() {
		$tasks              = $this->get_tasks();
		$tasks_with_details = [];

		foreach ( $tasks as $task ) {
			$task_details = Task_Factory::create_task_from( 'id', $task['task_id'] )->get_task_details();

			if ( $task_details ) {
				$tasks_with_details[] = $task_details;
			}
		}

		return $tasks_with_details;
	}

	/**
	 * Get tasks by.
	 *
	 * @param string $param The parameter.
	 * @param string $value The value.
	 *
	 * @return array
	 */
	public function get_tasks_by( $param, $value ) {
		return \progress_planner()->get_cpt_recommendations()->get_by_params( [ $param => $value ] );
	}

	/**
	 * Delete a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function delete_task( $task_id ) {
		$task_post = \progress_planner()->get_cpt_recommendations()->get_post( $task_id );
		if ( ! $task_post ) {
			return false;
		}
		return \progress_planner()->get_cpt_recommendations()->delete_recommendation( $task_post['ID'] );
	}

	/**
	 * Mark a task as a given status.
	 *
	 * @param string $status The status.
	 * @param string $task_id The task ID.
	 * @param array  $data The data.
	 *
	 * @return bool
	 */
	public function mark_task_as( $status, $task_id, $data = [] ) {
		$tasks         = \progress_planner()->get_settings()->get( 'tasks', [] );
		$tasks_changed = false;
		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] !== $task_id ) {
				continue;
			}

			if ( 'completed' === $task['status'] && 'pending_celebration' === $status ) {
				break;
			}

			$tasks[ $key ]['status'] = $status;
			$tasks_changed           = true;

			if ( 'snoozed' === $status ) {
				$tasks[ $key ]['time'] = \time() + $data['time'];
			}

			break;
		}

		if ( ! $tasks_changed ) {
			return false;
		}

		$result = \progress_planner()->get_settings()->set( 'tasks', $tasks );

		// Fire an action when the task status is changed.
		if ( true === $result ) {
			do_action( 'progress_planner_task_status_changed', $task_id, $status );
		}

		return $result;
	}

	/**
	 * Mark a task as snoozed.
	 *
	 * @param int    $task_id  The task post-ID.
	 * @param string $duration The duration.
	 *
	 * @return bool
	 */
	public function snooze_task( $task_id, $duration ) {
		$task_post = \progress_planner()->get_cpt_recommendations()->get_post( $task_id );
		if ( ! $task_post ) {
			return false;
		}

		switch ( $duration ) {
			case '1-month':
				$time = \MONTH_IN_SECONDS;
				break;

			case '3-months':
				$time = 3 * \MONTH_IN_SECONDS;
				break;

			case '6-months':
				$time = 6 * \MONTH_IN_SECONDS;
				break;

			case '1-year':
				$time = \YEAR_IN_SECONDS;
				break;

			case 'forever':
				$time = \PHP_INT_MAX;
				break;

			default:
				$time = \WEEK_IN_SECONDS;
				break;
		}

		return \progress_planner()->get_cpt_recommendations()->update_recommendation(
			$task_post['ID'],
			[
				'post_status' => 'future',
				'post_date'   => \DateTime::createFromFormat( 'U', strval( \time() + $time ) )->format( 'Y-m-d H:i:s' ),
			]
		);
	}

	/**
	 * Check if a task meets a condition.
	 *
	 * @param array $condition The condition.
	 *                         [
	 *                           string  'type'         The condition type.
	 *                           string  'task_id'      The task id (optional, used for completed and snoozed conditions).
	 *                           array   'post_lengths' The post lengths (optional, used for snoozed-post-length condition).
	 *                         ].
	 *
	 * @return bool
	 */
	public function check_task_condition( $condition ) {
		$parsed_condition = \wp_parse_args(
			$condition,
			[
				'status'       => '',
				'task_id'      => '',
				'post_lengths' => [],
			]
		);

		if ( 'snoozed-post-length' === $parsed_condition['status'] ) {
			if ( isset( $parsed_condition['post_lengths'] ) ) {
				if ( ! \is_array( $parsed_condition['post_lengths'] ) ) {
					$parsed_condition['post_lengths'] = [ $parsed_condition['post_lengths'] ];
				}

				$snoozed_tasks        = $this->get_tasks_by( 'status', 'snoozed' );
				$snoozed_post_lengths = [];

				// Get the post lengths of the snoozed tasks.
				foreach ( $snoozed_tasks as $task ) {
					$data = $this->tasks_manager->get_data_from_task_id( $task['task_id'] ); // @phpstan-ignore-line method.nonObject
					if ( isset( $data['category'] ) && 'create-post' === $data['category'] ) {
						$key = true === $data['long'] ? 'long' : 'short';
						if ( ! isset( $snoozed_post_lengths[ $key ] ) ) {
							$snoozed_post_lengths[ $key ] = true;
						}
					}
				}

				// Check if the snoozed post lengths match the condition.
				foreach ( $parsed_condition['post_lengths'] as $post_length ) {
					if ( ! isset( $snoozed_post_lengths[ $post_length ] ) ) {
						return false;
					}
				}

				return true;
			}
		}

		foreach ( $this->get_tasks_by( 'status', $parsed_condition['status'] ) as $task ) {
			if ( $task['task_id'] === $parsed_condition['task_id'] ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Update a task.
	 *
	 * @param string $task_id The task ID.
	 * @param array  $data The data.
	 *
	 * @return bool
	 */
	public function update_pending_task( $task_id, $data ) {
		$task_post = \progress_planner()->get_cpt_recommendations()->get_post( $task_id );
		if ( ! $task_post ) {
			return false;
		}
		return \progress_planner()->get_cpt_recommendations()->update_recommendation( $task_post['ID'], $data );
	}

	/**
	 * Handle the suggested task action.
	 *
	 * @return void
	 */
	public function suggested_task_action() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['task_id'] ) || ! isset( $_POST['action_type'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing data.', 'progress-planner' ) ] );
		}

		$action  = \sanitize_text_field( \wp_unslash( $_POST['action_type'] ) );
		$task_id = (string) \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) );
		$task    = \progress_planner()->get_cpt_recommendations()->get_post( $task_id );

		if ( ! $task ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Task not found.', 'progress-planner' ) ] );
		}

		switch ( $action ) {
			case 'complete':
				// Mark the task as completed.
				\progress_planner()->get_cpt_recommendations()->update_recommendation( $task['ID'], [ 'post_status' => 'trash' ] );

				// Insert an activity.
				\progress_planner()->get_cpt_recommendations()->insert_activity( $task['ID'] );
				$updated = true;
				break;

			case 'pending':
				\progress_planner()->get_cpt_recommendations()->update_recommendation( $task['ID'], [ 'post_status' => 'publish' ] );
				$updated = true;
				\progress_planner()->get_cpt_recommendations()->delete_activity( $task['ID'] );
				break;

			case 'snooze':
				$duration = isset( $_POST['duration'] ) ? \sanitize_text_field( \wp_unslash( $_POST['duration'] ) ) : '';
				$updated  = $this->snooze_task( $task['ID'], $duration );
				break;

			case 'delete':
				$updated = $this->delete_task( $task['ID'] );
				\progress_planner()->get_cpt_recommendations()->delete_activity( $task['ID'] );
				break;

			default:
				\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid action.', 'progress-planner' ) ] );
		}

		/**
		 * Allow other classes to react to the completion of a suggested task.
		 *
		 * @param string $task_id The task ID.
		 * @param bool   $updated Whether the action was successful.
		 */
		\do_action( "progress_planner_ajax_task_{$action}", $task_id, $updated );

		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to save.', 'progress-planner' ) ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
	}
}
