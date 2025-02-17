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
class Search_Engine_Visibility_Test extends Task_Provider_Test_Abstract {

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'search-engine-visibility';

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void {
		parent::setUpBeforeClass();

		\update_option( 'blog_public', 0 );
	}

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		\update_option( 'blog_public', 1 );
	}
}
