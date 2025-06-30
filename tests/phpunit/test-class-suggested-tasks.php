<?php
/**
 * Class Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

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
				'post_title'  => 'review-post-14-' . \gmdate( 'YW' ),
				'task_id'     => 'review-post-14-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'category'    => 'content-update',
				'provider_id' => 'review-post',
			],
			[
				'post_title'  => 'create-post-' . \gmdate( 'YW' ),
				'task_id'     => 'create-post-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'category'    => 'content-new',
				'provider_id' => 'create-post',
			],
			[
				'post_title'  => 'update-core-' . \gmdate( 'YW' ),
				'task_id'     => 'update-core-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'category'    => 'maintenance',
				'provider_id' => 'update-core',
			],
			[
				'post_title'  => 'settings-saved-' . \gmdate( 'YW' ),
				'task_id'     => 'settings-saved-' . \gmdate( 'YW' ),
				'date'        => \gmdate( 'YW' ),
				'provider_id' => 'settings-saved',
				'category'    => 'configuration',
			],

			// Not repetitive task, but with past date.
			[
				'post_title'  => 'settings-saved-202451',
				'task_id'     => 'settings-saved-202451',
				'date'        => '202451',
				'provider_id' => 'settings-saved',
				'category'    => 'configuration',
			],

			// User task, with past date.
			[
				'post_title'  => 'user-task-1',
				'task_id'     => 'user-task-1',
				'provider_id' => 'user',
				'category'    => 'user',
				'date'        => '202451',
			],
		];

		foreach ( $tasks_to_keep as $task ) {
			\progress_planner()->get_suggested_tasks_db()->add( $task );
		}

		// Tasks that should be removed.
		$tasks_to_remove = [

			// Repetitive task with past date.
			[
				'post_title'  => 'update-core-202451',
				'task_id'     => 'update-core-202451',
				'date'        => '202451',
				'category'    => 'maintenance',
				'provider_id' => 'update-core',
			],

			// Task with invalid provider.
			[
				'post_title'  => 'invalid-task-1',
				'task_id'     => 'invalid-task-1',
				'date'        => '202451',
				'category'    => 'invalid-category',
				'provider_id' => 'invalid-provider',
			],
		];

		foreach ( $tasks_to_remove as $task ) {
			\progress_planner()->get_suggested_tasks_db()->add( $task );
		}

		\progress_planner()->get_suggested_tasks()->get_tasks_manager()->cleanup_pending_tasks();
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP ); // Clear the cache.
		$this->assertEquals( \count( $tasks_to_keep ), \count( \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] ) ) );
	}
}
