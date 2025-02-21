<?php
/**
 * Class Core_Siteicon_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Core siteicon test case.
 */
class Core_Siteicon_Test extends \WP_UnitTestCase {

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
