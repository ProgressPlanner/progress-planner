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
class Disable_Comments_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

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
		\update_option( 'default_comment_status', 'closed' );
	}
}
