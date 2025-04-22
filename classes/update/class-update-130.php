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
		$this->add_set_valuable_post_types_option();
	}

	/**
	 * Add the set valuable post types option.
	 *
	 * @return void
	 */
	private function add_set_valuable_post_types_option() {
		\update_option( 'progress_planner_set_valuable_post_types', true );
	}
}
