<?php
/**
 * Update class for version 1.7.2.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.7.2.
 *
 * @package Progress_Planner
 */
class Update_172 {

	const VERSION = '1.7.2';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Delete the 'progress_planner_pro_license_key' entry from wp_options table.
		$this->delete_pro_license_key();
	}

	/**
	 * Delete the 'progress_planner_pro_license_key' entry from wp_options table.
	 *
	 * @return void
	 */
	private function delete_pro_license_key() {
		\delete_option( 'progress_planner_pro_license_key' );
	}
}
