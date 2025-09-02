<?php
/**
 * Class Settings_Saved_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Settings saved test case.
 */
class Settings_Saved_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'settings-saved';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		// TODO: Use a different option.
		\update_option( 'progress_planner_pro_license_key', '12345' );
	}
}
