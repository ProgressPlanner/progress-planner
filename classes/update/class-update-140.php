<?php
/**
 * Update class for version 1.4.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.4.0.
 *
 * @package Progress_Planner
 */
class Update_140 {

	const VERSION = '1.4.0';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->rename_tasks_option();
		$this->delete_word_count_option();
	}

	/**
	 * Rename the tasks option.
	 *
	 * @return void
	 */
	private function rename_tasks_option() {
		// Migrate the tasks option.
		$old_tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );
		$new_tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		// Merge the tasks.
		// We use the task_id if it exists, otherwise we use the md5 hash of the task.
		// This is to ensure that we don't lose any tasks, and at the same time we don't have duplicate tasks.
		$tasks = [];
		foreach ( $new_tasks as $new_task ) {
			$tasks[ isset( $new_task['task_id'] ) ? $new_task['task_id'] : md5( maybe_serialize( $new_task ) ) ] = $new_task;
		}
		foreach ( $old_tasks as $old_task ) {
			$tasks[ isset( $old_task['task_id'] ) ? $old_task['task_id'] : md5( maybe_serialize( $old_task ) ) ] = $old_task;
		}

		// Set the tasks option.
		\progress_planner()->get_settings()->set( 'tasks', array_values( $tasks ) );

		// Delete the old tasks option.
		\progress_planner()->get_settings()->delete( 'local_tasks' );
	}

	/**
	 * Delete the word count option.
	 *
	 * @return void
	 */
	private function delete_word_count_option() {
		\progress_planner()->get_settings()->delete( 'word_count' );
	}
}
