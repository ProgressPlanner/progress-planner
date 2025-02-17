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
class Disable_Comments_Test extends Task_Provider_Test_Abstract {

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'disable-comments';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		\update_option( 'disable_comments', 'closed' );
	}
}
