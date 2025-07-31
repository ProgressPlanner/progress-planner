<?php
/**
 * Update class abstract.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class abstract.
 *
 * @package Progress_Planner
 */
abstract class Update {

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	abstract public function run();

	/**
	 * Delete a suggested-task so it can be re-created.
	 *
	 * @param string[] $task_ids The task IDs.
	 * @return void
	 */
	protected function delete_suggested_tasks( $task_ids ) {
		foreach ( $task_ids as $task_id ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[ 'task_id' => $task_id ]
			);

			if ( ! $task ) {
				continue;
			}

			// Delete the task.
			\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task[0]->ID );
		}
	}
}
