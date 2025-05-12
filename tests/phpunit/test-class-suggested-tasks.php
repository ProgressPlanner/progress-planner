<?php
/**
 * Class Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\CPT_Recommendations;

/**
 * CPT_Recommendations test case.
 */
class CPT_Recommendations_Test extends \WP_UnitTestCase {

	/**
	 * Test the task_cleanup method.
	 *
	 * @return void
	 */
	public function test_task_cleanup() {
		// Tasks that should not be removed.
		$tasks_to_keep = [
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
			\progress_planner()->get_suggested_tasks()->add( $task );
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
			\progress_planner()->get_suggested_tasks()->add( $task );
		}

		\progress_planner()->get_suggested_tasks()->get_tasks_manager()->cleanup_pending_tasks();

		$this->assertEquals( count( $tasks_to_keep ), \count( \progress_planner()->get_settings()->get( 'tasks', [] ) ) );
	}
}
