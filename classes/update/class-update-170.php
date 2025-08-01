<?php
/**
 * Update class for version 1.7.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.7.0.
 *
 * @package Progress_Planner
 */
class Update_170 {

	const VERSION = '1.7.0';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Make tasks interactive.
		$this->make_tasks_interactive();
	}

	/**
	 * Make existing tasks interactive.
	 *
	 * @return void
	 */
	private function make_tasks_interactive() {
		$tasks_to_make_interactive = [
			'core-blogdescription',
			'disable-comments',
			'hello-world',
			'sample-page',
		];

		foreach ( $tasks_to_make_interactive as $task_id ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by(
				[
					'task_id'     => $task_id,
					'post_status' => [ 'publish', 'future' ],
				]
			);

			if ( ! $task ) {
				continue;
			}

			// Update the task.
			\progress_planner()->get_suggested_tasks_db()->update_recommendation(
				$task[0]->ID,
				[
					'prpl_popover_id' => 'prpl-popover-' . $task_id,
				]
			);

		}
	}
}
