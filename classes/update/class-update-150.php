<?php
/**
 * Update class for version 1.5.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.5.0.
 *
 * @package Progress_Planner
 */
class Update_150 {

	const VERSION = '1.5.0';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->migrate_tasks();
	}

	/**
	 * Migrate the tasks.
	 *
	 * @return void
	 */
	private function migrate_tasks() {
		// Get all tasks.
		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		// Migrate the tasks.
		foreach ( $tasks as $task ) {
			$this->migrate_task( $task );
		}

		// Delete the tasks option.
		\progress_planner()->get_settings()->delete( 'tasks' );
	}

	/**
	 * Migrate a task.
	 *
	 * @param array $task The task to migrate.
	 *
	 * @return void
	 */
	private function migrate_task( $task ) {
		// Skip tasks which don't have a provider ID or status.
		if ( ! isset( $task['status'] ) || ! isset( $task['provider_id'] ) ) {
			return;
		}

		// Skip suggested tasks which are not completed or snoozed (but all user tasks are migrated).
		if ( 'snoozed' !== $task['status'] && 'completed' !== $task['status'] && 'user' !== $task['provider_id'] ) {
			return;
		}

		$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( $task['provider_id'] );

		// Skip tasks which don't have a task provider.
		if ( ! $task_provider ) {
			return;
		}

		// Now when we have target data - get the task details from the task provider, title, description, url, points, etc.
		if ( 'user' === $task['provider_id'] ) {
			// User tasks have different data structure, so we can copy directly.
			$task_details = [
				'post_title'  => $task['title'],
				'description' => '',
				'points'      => $task['points'],
				'provider_id' => 'user',
				'category'    => 'user',
				'task_id'     => $task['task_id'],
				'post_status' => 'pending' === $task['status'] ? 'publish' : $task['status'],
				'dismissable' => true,
				'snoozable'   => false,
			];
		} else {
			// Migrate the legacy task data, if the key exists.
			// To avoid conflicts and confusion we have added 'target_' prefix to the keys.
			$keys_to_migrate = [
				'post_id',
				'post_title',
				'post_type',
				'term_id',
				'taxonomy',
				'term_name',
			];

			// Data which is used to build task title, description, url.
			$target_data = [];

			foreach ( $keys_to_migrate as $key ) {
				if ( isset( $task[ $key ] ) ) {
					$target_data[ 'target_' . $key ] = $task[ $key ];
				}
			}

			$task_details = $task_provider->get_task_details( $target_data );

			// Usually repeating tasks have a date.
			if ( isset( $task['date'] ) ) {
				$task_details['date'] = $task['date'];
			} else {
				// If not remove it, since get_task_details() method adds a date with \gmdate( 'YW' ) (which will be the date of the migration).
				unset( $task_details['date'] );
			}

			// Snoozed tasks have a time.
			if ( isset( $task['time'] ) ) {
				// Checking if task was snoozed forever (PHP_INT_MAX).
				$task_details['time'] = \is_float( $task['time'] ) ? \strtotime( '+10 years' ) : $task['time'];
			}

			// Add target data to the task details, we need them in the details as well.
			$task_details = \array_merge( $task_details, $target_data );

			// Add status to the task details.
			$task_details['post_status'] = $task['status'];
		}

		// Add the task to the database.
		\progress_planner()->get_suggested_tasks_db()->add( $task_details );
	}
}
