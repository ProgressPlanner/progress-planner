<?php
/**
 * WP CLI commands for tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\WP_CLI;

use WP_CLI, WP_CLI_Command;

use Progress_Planner\Base;
use Progress_Planner\Admin\Widgets\Activity_Scores;

if ( ! class_exists( 'WP_CLI_Command' ) ) {
	return;
}

/**
 * Task command.
 */
class Task_Command extends \WP_CLI_Command {

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		\WP_CLI::add_command( 'prpl task', '\Progress_Planner\WP_CLI\Task_Command' ); // @phpstan-ignore-line
	}

	/**
	 * List tasks.
	 *
	 * ## OPTIONS
	 *
	 * [--format=<format>]
	 * : Accepted values: table, csv, json, count, yaml. Default: table
	 *
	 * [--fields=<fields>]
	 * : Limit the output to specific fields. Defaults to all fields.
	 *
	 * [--<field>=<value>]
	 * : Filter by one or more fields.
	 *
	 * ## EXAMPLES
	 *
	 *     # List all tasks
	 *     $ wp prpl task list
	 *
	 *     # List tasks in JSON format
	 *     $ wp prpl task list --format=json
	 *
	 * @param array $args Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 *
	 * @return void
	 */
	public function list( $args, $assoc_args ) {
		$tasks = $this->get_tasks( $assoc_args );

		if ( empty( $tasks ) ) {
			WP_CLI::log( 'No tasks found.' ); // @phpstan-ignore-line
			return;
		}

		$format = isset( $assoc_args['format'] ) ? $assoc_args['format'] : 'table';
		$fields = isset( $assoc_args['fields'] ) ? explode( ',', $assoc_args['fields'] ) : [ 'task_id', 'provider_id', 'category', 'date', 'status' ];

		WP_CLI\Utils\format_items( $format, $tasks, $fields ); // @phpstan-ignore-line
	}

	/**
	 * Get a task.
	 *
	 * ## OPTIONS
	 *
	 * <task_id>
	 * : The ID of the task to get.
	 *
	 * [--format=<format>]
	 * : Accepted values: table, json, yaml. Default: table
	 *
	 * ## EXAMPLES
	 *
	 *     # Get a task
	 *     $ wp prpl task get 123
	 *
	 * @param array $args Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 *
	 * @return void
	 */
	public function get( $args, $assoc_args ) {
		$task_id = $args[0];
		$task    = $this->get_task( $task_id );

		if ( ! $task ) {
			\WP_CLI::error( "Task {$task_id} not found." ); // @phpstan-ignore-line
			return;
		}

		$format = isset( $assoc_args['format'] ) ? $assoc_args['format'] : 'table';
		\WP_CLI\Utils\format_items( $format, [ $task ], array_keys( $task ) ); // @phpstan-ignore-line
	}

	/**
	 * Update a task.
	 *
	 * ## OPTIONS
	 *
	 * <task_id>
	 * : The ID of the task to update.
	 *
	 * [--<field>=<value>]
	 * : One or more fields to update.
	 *
	 * ## EXAMPLES
	 *
	 *     # Update task status
	 *     $ wp prpl task update 123 --status=completed
	 *
	 * @param array $args Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 *
	 * @return void
	 */
	public function update( $args, $assoc_args ) {
		$task_id = $args[0];
		$task    = $this->get_task( $task_id );

		if ( ! $task ) {
			\WP_CLI::error( "Task {$task_id} not found." ); // @phpstan-ignore-line
			return;
		}

		$updated = $this->update_task( $task_id, $assoc_args );

		if ( $updated ) {
			\WP_CLI::success( "Task {$task_id} updated." ); // @phpstan-ignore-line
		} else {
			\WP_CLI::error( "Failed to update task {$task_id}." ); // @phpstan-ignore-line
		}
	}

	/**
	 * Delete a task.
	 *
	 * ## OPTIONS
	 *
	 * <task_id>
	 * : The ID of the task to delete.
	 *
	 * [--force]
	 * : Skip the trash bin and permanently delete the task.
	 *
	 * ## EXAMPLES
	 *
	 *     # Delete a task
	 *     $ wp prpl task delete 123
	 *
	 * @param array $args Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 *
	 * @return void
	 */
	public function delete( $args, $assoc_args ) {
		$task_id = $args[0];
		$task    = $this->get_task( $task_id );

		if ( ! $task ) {
			\WP_CLI::error( "Task {$task_id} not found." ); // @phpstan-ignore-line
			return;
		}

		$force   = isset( $assoc_args['force'] ) && $assoc_args['force'];
		$deleted = $this->delete_task( $task_id, $force );

		if ( $deleted ) {
			\WP_CLI::success( "Task {$task_id} deleted." ); // @phpstan-ignore-line
		} else {
			\WP_CLI::error( "Failed to delete task {$task_id}." ); // @phpstan-ignore-line
		}
	}

	/**
	 * Get tasks from the database.
	 *
	 * @param array $args Query arguments.
	 * @return array
	 */
	private function get_tasks( $args ) {
		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] ); // Get tasks from the database, without filtering.

		if ( empty( $tasks ) ) {
			return [];
		}

		// Set fields which are not set for all tasks.
		foreach ( $tasks as $key => $task ) {
			if ( ! isset( $task['date'] ) ) {
				$tasks[ $key ]['date'] = '';
			}
		}

		return $tasks;
	}

	/**
	 * Get a single task from the database.
	 *
	 * @param string $task_id Task ID.
	 * @return array|null
	 */
	private function get_task( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $task_id );
		if ( empty( $tasks ) ) {
			\WP_CLI::log( 'Task not found.' ); // @phpstan-ignore-line
			return [];
		}

		return $tasks[0];
	}

	/**
	 * Update a task in the database.
	 *
	 * @param string $task_id Task ID.
	 * @param array  $data    Task data to update.
	 * @return bool
	 */
	private function update_task( $task_id, $data ) {
		$task = $this->get_task( $task_id );
		if ( ! $task ) {
			\WP_CLI::log( 'Task not found.' ); // @phpstan-ignore-line
			return false;
		}

		\progress_planner()->get_suggested_tasks()->update_pending_task( $task_id, $data );
		return true;
	}

	/**
	 * Delete a task from the database.
	 *
	 * @param string $task_id Task ID.
	 * @param bool   $force   Whether to force delete.
	 * @return bool
	 */
	private function delete_task( $task_id, $force ) {
		\progress_planner()->get_suggested_tasks()->delete_task( $task_id );
		return true;
	}
}
