<?php
/**
 * Class Core_Blogdescription_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Core blogdescription test case.
 */
class Core_Blogdescription_Test extends Task_Provider_Test_Abstract {

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
