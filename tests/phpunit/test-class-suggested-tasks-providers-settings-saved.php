<?php
/**
 * Class Suggested_Tasks_Providers_Settings_Saved_Test
 *
 * @package Progress_Planner
 * @group suggested-tasks-providers-4
 */

namespace Progress_Planner\Tests;

/**
 * Settings saved test case.
 *
 * @group suggested-tasks-providers-4
 */
class Suggested_Tasks_Providers_Settings_Saved_Test extends \WP_UnitTestCase {

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
		\progress_planner()->get_settings()->set( 'include_post_types', [ 'post', 'page' ] );
	}
}
