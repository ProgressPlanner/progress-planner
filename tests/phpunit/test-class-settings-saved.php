<?php
/**
 * Class Settings_Saved_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

require_once 'class-task-provider-test-abstract.php';

/**
 * Settings saved test case.
 */
class Settings_Saved_Test extends Task_Provider_Test_Abstract {

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
		\update_option( 'progress_planner_pro_license_key', '12345' );
	}
}
