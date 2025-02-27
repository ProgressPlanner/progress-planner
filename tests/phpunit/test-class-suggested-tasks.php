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
	 * Test the mark_task_as_pending_celebration method.
	 *
	 * @return void
	 */
	public function test_mark_task_as_pending_celebration() {
	}

	/**
	 * Test the mark_task_as_celebrated method.
	 *
	 * @return void
	 */
	public function test_mark_task_as_celebrated() {
	}

	/**
	 * Test the maybe_celebrate_tasks method.
	 *
	 * @return void
	 */
	public function test_maybe_celebrate_tasks() {
	}

	/**
	 * Test the maybe_unsnooze_tasks method.
	 *
	 * @return void
	 */
	public function test_maybe_unsnooze_tasks() {
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
			'post_id/14|type/review-post',
			'date/202452|long/0|type/create-post',
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
