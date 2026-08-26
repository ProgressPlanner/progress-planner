<?php
/**
 * Class Select_Timezone_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Select timezone test case.
 */
class Select_Timezone_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'select-timezone';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		$activity          = new \Progress_Planner\Activities\Suggested_Task();
		$activity->data_id = 'select-timezone';
		$activity->save();
	}
}
