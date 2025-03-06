<?php
/**
 * Handle suggested tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Local_Tasks_Manager;
use Progress_Planner\Suggested_Tasks\Remote_Tasks;
use Progress_Planner\Activities\Suggested_Task;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Core_Update;

/**
 * Suggested_Tasks class.
 */
class Suggested_Tasks {

	/**
	 * An object containing local tasks.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Local_Tasks_Manager|null
	 */
	private $local;

	/**
	 * The API object.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Remote_Tasks|null
	 */
	private $remote;

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		$this->local  = new Local_Tasks_Manager();
		$this->remote = new Remote_Tasks();

		\add_action( 'wp_ajax_progress_planner_suggested_task_action', [ $this, 'suggested_task_action' ] );

		if ( \is_admin() ) {
			\add_action( 'init', [ $this, 'init' ], 1 );
		}

		// Add the automatic updates complete action.
		\add_action( 'automatic_updates_complete', [ $this, 'on_automatic_updates_complete' ] );
	}

	/**
	 * Run the local tasks.
	 *
	 * @return void
	 */
	public function init() {
		// Unsnooze tasks.
		$this->maybe_unsnooze_tasks();

		// Check for completed tasks.
		$completed_tasks = $this->local->evaluate_tasks(); // @phpstan-ignore-line method.nonObject

		foreach ( $completed_tasks as $task_id ) {
			// Change the task status to pending celebration.
			$this->mark_task_as_pending_celebration( $task_id );

			// Insert an activity.
			$this->insert_activity( $task_id );
		}
	}

	/**
	 * Insert an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return void
	 */
	public function insert_activity( $task_id ) {
		// Insert an activity.
		$activity          = new Suggested_Task();
		$activity->type    = 'completed';
		$activity->data_id = (string) $task_id;
		$activity->date    = new \DateTime();
		$activity->user_id = \get_current_user_id();
		$activity->save();

		// Allow other classes to react to the completion of a suggested task.
		do_action( 'progress_planner_suggested_task_completed', $task_id );
	}

	/**
	 * If done via automatic updates, the "core update" task should be marked as "completed" (and skip "pending celebration" status).
	 *
	 * @return void
	 */
	public function on_automatic_updates_complete() {

		$pending_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] ); // @phpstan-ignore-line method.nonObject

		if ( empty( $pending_tasks ) ) {
			return;
		}

		foreach ( $pending_tasks as $task_data ) {
			$task_id = $task_data['task_id'];

			if ( $task_data['provider_id'] === ( new Core_Update() )->get_provider_id() &&
				\gmdate( 'YW' ) === $task_data['date']
			) {
				// Change the task status to completed.
				$this->mark_task_as_completed( $task_id );

				// Insert an activity.
				$this->insert_activity( $task_id );
				break;
			}
		}
	}

	/**
	 * Get the API object.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Remote_Tasks
	 */
	public function get_remote() {
		return $this->remote; // @phpstan-ignore-line return.type
	}

	/**
	 * Get the local tasks object.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Local_Tasks_Manager
	 */
	public function get_local() {
		return $this->local; // @phpstan-ignore-line return.type
	}

	/**
	 * Return filtered items.
	 *
	 * @return array
	 */
	public function get_tasks() {
		$tasks = [];
		/**
		 * Filter the suggested tasks.
		 *
		 * @param array $tasks The suggested tasks.
		 * @return array
		 */
		$tasks    = \apply_filters( 'progress_planner_suggested_tasks_items', $tasks );
		$db_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		foreach ( $tasks as $key => $task ) {
			if ( isset( $task['status'] ) && ! empty( $task['status'] ) ) {
				continue;
			}

			foreach ( $db_tasks as $db_task_key => $db_task ) {
				if ( $db_task['task_id'] === $task['task_id'] ) {
					$tasks[ $key ]['status'] = $db_task['status'];
					unset( $db_tasks[ $db_task_key ] );
					break;
				}
			}
		}

		return $tasks;
	}

	/**
	 * Get tasks by status.
	 *
	 * @param string $status The status.
	 *
	 * @return array
	 */
	public function get_tasks_by_status( $status ) {
		$tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		return array_filter(
			$tasks,
			function ( $task ) use ( $status ) {
				return isset( $task['status'] ) && $task['status'] === $status;
			}
		);
	}

	/**
	 * Get remote tasks.
	 *
	 * @return array
	 */
	public function get_remote_tasks() {
		return $this->remote->get_tasks_to_inject(); // @phpstan-ignore-line method.nonObject
	}

	/**
	 * Mark a task as completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function mark_task_as_completed( $task_id ) {
		return $this->mark_task_as( 'completed', $task_id );
	}

	/**
	 * Mark a task as pending celebration.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function mark_task_as_pending_celebration( $task_id ) {
		// Don't mark the task as pending celebration if it's already completed.
		if ( $this->was_task_completed( $task_id ) ) {
			return false;
		}

		return $this->mark_task_as( 'pending_celebration', $task_id );
	}

	/**
	 * Mark a task as snoozed.
	 *
	 * @param string $task_id The task ID.
	 * @param int    $time The time.
	 *
	 * @return bool
	 */
	public function mark_task_as_snoozed( $task_id, $time ) {
		return $this->mark_task_as( 'snoozed', $task_id, [ 'time' => $time ] );
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
		$tasks         = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$tasks_changed = false;
		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] !== $task_id ) {
				continue;
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
		return \progress_planner()->get_settings()->set( 'local_tasks', $tasks );
	}

	/**
	 * Remove a task from a given status (sets it as `pending`).
	 *
	 * @param string $status The status.
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function remove_task_from( $status, $task_id ) {
		$tasks         = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$tasks_changed = false;

		foreach ( $tasks as $key => $task ) {
			if ( $task['task_id'] !== $task_id ) {
				continue;
			}

			if ( ! isset( $task['status'] ) || $task['status'] !== $status ) {
				return false;
			}

			$tasks[ $key ]['status'] = 'pending';
			$tasks_changed           = true;
		}

		if ( ! $tasks_changed ) {
			return false;
		}

		return \progress_planner()->get_settings()->set( 'local_tasks', $tasks );
	}

	/**
	 * Transition a task from one status to another.
	 *
	 * @param string $task_id The task ID.
	 * @param string $old_status The old status.
	 * @param string $new_status The new status.
	 * @param array  $data The data.
	 *
	 * @return bool
	 */
	public function transition_task_status( $task_id, $old_status, $new_status, $data = [] ) {

		$return_old_status = false;
		$return_new_status = false;

		if ( $old_status ) {
			$return_old_status = $this->remove_task_from( $old_status, $task_id );
		}

		if ( $new_status ) {
			$return_new_status = $this->mark_task_as( $new_status, $task_id, $data );
		}

		return $return_old_status && $return_new_status;
	}

	/**
	 * Mark a task as snoozed.
	 *
	 * @param string $task_id The task ID.
	 * @param string $duration The duration.
	 *
	 * @return bool
	 */
	public function snooze_task( $task_id, $duration ) {

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

		return $this->mark_task_as_snoozed( $task_id, $time );
	}

	/**
	 * Maybe unsnooze tasks.
	 *
	 * @return void
	 */
	private function maybe_unsnooze_tasks() {
		$tasks         = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$tasks_changed = false;
		foreach ( $tasks as $key => $task ) {
			if ( $task['status'] !== 'snoozed' ) {
				continue;
			}

			if ( isset( $task['time'] ) && $task['time'] < \time() ) {
				if ( isset( $task['provider_id'] ) && 'user' === $task['provider_id'] ) {
					$tasks[ $key ]['status'] = 'pending';
					unset( $tasks[ $key ]['time'] );
				} else {
					unset( $tasks[ $key ] );
				}
				$tasks_changed = true;
			}
		}

		if ( $tasks_changed ) {
			\progress_planner()->get_settings()->set( 'local_tasks', $tasks );
		}
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

				$snoozed_tasks        = $this->get_tasks_by_status( 'snoozed' );
				$snoozed_post_lengths = [];

				// Get the post lengths of the snoozed tasks.
				foreach ( $snoozed_tasks as $task ) {
					$data = $this->local->get_data_from_task_id( $task['task_id'] ); // @phpstan-ignore-line method.nonObject
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

		foreach ( $this->get_tasks_by_status( $parsed_condition['status'] ) as $task ) {
			if ( $task['task_id'] === $parsed_condition['task_id'] ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if a task was completed. Task is considered completed if it was completed or pending celebration.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function was_task_completed( $task_id ) {
		foreach ( \progress_planner()->get_settings()->get( 'local_tasks', [] ) as $task ) {
			if ( ! isset( $task['task_id'] ) || $task['task_id'] !== $task_id ) {
				continue;
			}

			return isset( $task['status'] ) && in_array( $task['status'], [ 'completed', 'pending_celebration' ], true );
		}

		return false;
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

		switch ( $action ) {
			case 'complete':
				// We need to add the task to the pending tasks first, before marking it as completed.
				if ( false !== strpos( $task_id, 'remote-task' ) ) {
					\progress_planner()->get_suggested_tasks()->get_local()->add_pending_task( $task_id );
				}

				// Mark the task as completed.
				$this->mark_task_as( 'completed', $task_id );

				// Insert an activity.
				$this->insert_activity( $task_id );
				$updated = true;
				break;

			case 'snooze':
				$duration = isset( $_POST['duration'] ) ? \sanitize_text_field( \wp_unslash( $_POST['duration'] ) ) : '';
				$updated  = $this->snooze_task( $task_id, $duration );
				break;

			default:
				\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid action.', 'progress-planner' ) ] );
		}

		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to save.', 'progress-planner' ) ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Saved.', 'progress-planner' ) ] );
	}
}
