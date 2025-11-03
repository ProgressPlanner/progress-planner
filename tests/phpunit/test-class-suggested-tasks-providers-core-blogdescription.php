<?php
/**
 * Class Suggested_Tasks_Providers_Core_Blogdescription_Test
 *
 * @package Progress_Planner
 * @group suggested-tasks-providers-1
 */

namespace Progress_Planner\Tests;

/**
 * Core blogdescription test case.
 *
 * @group suggested-tasks-providers-1
 */
class Suggested_Tasks_Providers_Core_Blogdescription_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'core-blogdescription';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		// Update blog description.
		\update_option( 'blogdescription', 'Test blog description' );
	}
}
