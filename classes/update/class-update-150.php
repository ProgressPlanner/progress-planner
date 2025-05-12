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
		// Get the task details.
		\progress_planner()->get_suggested_tasks()->add(
			\Progress_Planner\Suggested_Tasks\Task_Factory::create_task_from_id( $task['task_id'] )->get_task_details()
		);
	}
}
