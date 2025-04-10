<?php
/**
 * Class Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks;
use Progress_Planner\Suggested_Tasks\Remote_Tasks;

/**
 * Suggested_Tasks test case.
 */
class Suggested_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Suggested_Tasks object.
	 *
	 * @var Suggested_Tasks
	 */
	protected $suggested_tasks;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		$this->suggested_tasks = \progress_planner()->get_suggested_tasks();
	}

	/**
	 * Test the get_api method.
	 *
	 * @return void
	 */
	public function test_get_remote_tasks() {
		$remote_tasks = $this->suggested_tasks->get_remote();
		$this->assertInstanceOf( Remote_Tasks::class, $remote_tasks );
	}

	/**
	 * Test the task_cleanup method.
	 *
	 * @return void
	 */
	public function test_task_cleanup() {
		// Tasks that should not be removed.
		$tasks_to_keep = [
			[
				'task_id' => 'remote-task-1234',
				'date'    => \gmdate( 'YW' ),
			],
			[
				'task_id' => 'review-post-14-' . \gmdate( 'YW' ),
				'date'    => \gmdate( 'YW' ),
			],
			[
				'task_id' => 'create-post-' . \gmdate( 'YW' ),
				'date'    => \gmdate( 'YW' ),
			],
			[
				'task_id' => 'update-core-' . \gmdate( 'YW' ),
				'date'    => \gmdate( 'YW' ),
			],
			[
				'task_id' => 'settings-saved-' . \gmdate( 'YW' ),
				'date'    => \gmdate( 'YW' ),
			],
		];

		foreach ( $tasks_to_keep as $task ) {
			$this->suggested_tasks->get_local()->add_pending_task( $task );
		}

		// Tasks that should be removed.
		$tasks_to_remove = [
			[
				'task_id' => 'update-core-202451',
				'date'    => '202451',
			],
			[
				'task_id' => 'settings-saved-202451',
				'date'    => '202451',
			],
		];

		foreach ( $tasks_to_remove as $task ) {
			$this->suggested_tasks->get_local()->add_pending_task( $task );
		}

		$this->suggested_tasks->get_local()->cleanup_pending_tasks();

		$this->assertEquals( count( $tasks_to_keep ), \count( \progress_planner()->get_settings()->get( 'local_tasks', [] ) ) );
	}
}
