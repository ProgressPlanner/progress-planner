<?php
/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */
class Update_130 {

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->add_upgraded_from_v1_2_option();
	}

	/**
	 * Add the upgraded from v1.2 option.
	 *
	 * @return void
	 */
	private function add_upgraded_from_v1_2_option() {
		\update_option( 'progress_planner_upgraded_from_v1_2', true );
	}
}
