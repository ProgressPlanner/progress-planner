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
			'remote-task-1234',
			'post_id/14|provider_id/review-post',
			'date/' . \gmdate( 'YW' ) . '|long/0|provider_id/create-post',
			'update-core-' . \gmdate( 'YW' ),
			'settings-saved-' . \gmdate( 'YW' ),
		];

		foreach ( $tasks_to_keep as $task_id ) {
			$this->suggested_tasks->get_local()->add_pending_task( $task_id );
		}

		// Tasks that should be removed.
		$tasks_to_remove = [
			'update-core-202451',
			'settings-saved-202451',
		];

		foreach ( $tasks_to_remove as $task_id ) {
			$this->suggested_tasks->get_local()->add_pending_task( $task_id );
		}

		$this->suggested_tasks->get_local()->cleanup_pending_tasks();

		$this->assertEquals( count( $tasks_to_keep ), \count( \progress_planner()->get_settings()->get( 'local_tasks', [] ) ) );
	}
}
