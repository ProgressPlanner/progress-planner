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

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->rename_tasks_option();
	}

	/**
	 * Rename the tasks option.
	 *
	 * @return void
	 */
	private function rename_tasks_option() {
		// Migrate the tasks option.
		\progress_planner()->get_settings()->set(
			'tasks',
			\progress_planner()->get_settings()->get( 'local_tasks', [] )
		);

		// Delete the old tasks option.
		\progress_planner()->get_settings()->delete( 'local_tasks' );
	}
}
