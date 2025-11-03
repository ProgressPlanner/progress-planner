<?php
/**
 * Class Suggested_Tasks_Providers_Core_Siteicon_Test
 *
 * @package Progress_Planner
 * @group suggested-tasks-providers-1
 */

namespace Progress_Planner\Tests;

/**
 * Core siteicon test case.
 *
 * @group suggested-tasks-providers-1
 */
class Suggested_Tasks_Providers_Core_Siteicon_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'core-siteicon';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		\update_option( 'site_icon', '99' );
	}
}
