<?php
/**
 * WP CLI commands for tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\WP_CLI;

use WP_CLI, WP_CLI_Command;

if ( ! \class_exists( 'WP_CLI_Command' ) ) {
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
		$fields = isset( $assoc_args['fields'] ) ? \explode( ',', $assoc_args['fields'] ) : [ 'task_id', 'provider_id', 'category', 'date', 'post_status' ];

		$formatted_tasks = [];
		foreach ( $tasks as $task ) {
			$formatted = [];
			foreach ( $fields as $field ) {
				switch ( $field ) {
					case 'task_id':
					case 'date':
					case 'post_status':
						$formatted[ $field ] = $task->$field ?? '';
						break;
					case 'provider_id':
						$formatted[ $field ] = \is_object( $task->provider ?? null ) && isset( $task->provider->name ) ? $task->provider->name : '';
						break;
					case 'category':
						$formatted[ $field ] = \is_object( $task->category ?? null ) && isset( $task->category->name ) ? $task->category->name : '';
						break;
					default:
						$formatted[ $field ] = $task->$field ?? '';
				}
			}

			$formatted_tasks[] = $formatted;
		}

		WP_CLI\Utils\format_items( $format, $formatted_tasks, $fields ); // @phpstan-ignore-line
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
		\WP_CLI\Utils\format_items( $format, [ $task ], \array_keys( $task ) ); // @phpstan-ignore-line
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
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( $args );
		if ( empty( $tasks ) ) {
			return [];
		}

		return $tasks;
	}

	/**
	 * Get a single task from the database.
	 *
	 * @param string $task_id Task ID.
	 * @return \Progress_Planner\Suggested_Tasks\Task|null
	 */
	private function get_task( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );
		if ( empty( $tasks ) ) {
			\WP_CLI::log( 'Task not found.' ); // @phpstan-ignore-line
			return null;
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

		\progress_planner()->get_suggested_tasks_db()->update_recommendation( $task->ID, $data );
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
		$task = $this->get_task( $task_id );
		if ( ! $task ) {
			\WP_CLI::log( 'Task not found.' ); // @phpstan-ignore-line
			return false;
		}

		\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
		return true;
	}

	/**
	 * Create a task.
	 *
	 * ## OPTIONS
	 *
	 * [--task_id=<task_id>]
	 * : The ID of the task. If not provided, one will be generated.
	 *
	 * [--title=<title>]
	 * : The title of the task. Default: "Test task {timestamp}"
	 *
	 * [--description=<description>]
	 * : The description of the task. Default: "Test description {timestamp}"
	 *
	 * [--points=<points>]
	 * : The points value for the task. Default: 1
	 *
	 * [--provider_id=<provider_id>]
	 * : The provider ID. Default: "collaborator"
	 *
	 * [--category=<category>]
	 * : The task category. Default: "collaborator"
	 *
	 * [--status=<status>]
	 * : The task status. Default: "pending"
	 *
	 * [--is_completed_callback=<is_completed_callback>]
	 * : The callback to check if the task is completed.
	 *
	 * ## EXAMPLES
	 *
	 *     # Create a task with default values
	 *     $ wp prpl task create
	 *
	 *     # Create a task with custom values
	 *     $ wp prpl task create --title="My Task" --description="Task description" --points=5
	 *
	 * @param array $args Command arguments.
	 * @param array $assoc_args Command associative arguments.
	 *
	 * @return void
	 */
	public function create( $args, $assoc_args ) {
		$task_id               = isset( $assoc_args['task_id'] ) ? $assoc_args['task_id'] : '';
		$title                 = isset( $assoc_args['title'] ) ? $assoc_args['title'] : '';
		$description           = isset( $assoc_args['description'] ) ? $assoc_args['description'] : 'Test description ';
		$points                = isset( $assoc_args['points'] ) ? (int) $assoc_args['points'] : 1;
		$provider_id           = isset( $assoc_args['provider_id'] ) ? $assoc_args['provider_id'] : 'collaborator';
		$category              = isset( $assoc_args['category'] ) ? $assoc_args['category'] : 'collaborator';
		$status                = isset( $assoc_args['status'] ) ? $assoc_args['status'] : 'pending';
		$is_completed_callback = isset( $assoc_args['is_completed_callback'] ) ? $assoc_args['is_completed_callback'] : null;
		$dismissable           = isset( $assoc_args['dismissable'] ) ? $assoc_args['dismissable'] : true;
		$snoozable             = isset( $assoc_args['snoozable'] ) ? $assoc_args['snoozable'] : true;

		if ( empty( $task_id ) || empty( $title ) ) {
			\WP_CLI::error( 'task_id and title are required.' ); // @phpstan-ignore-line
			return;
		}

		// We're creating a new task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'               => $task_id,
				'post_title'            => $title,
				'description'           => $description,
				'points'                => $points,
				'provider_id'           => $provider_id,
				'category'              => $category,
				'status'                => $status,
				'dismissable'           => $dismissable,
				'snoozable'             => $snoozable,
				'is_completed_callback' => $is_completed_callback,
			]
		);

		\WP_CLI::success( "Task {$task_id} created." ); // @phpstan-ignore-line
	}
}
