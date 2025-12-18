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
	 * Note: Most task providers have been migrated to React. React providers
	 * handle their own cleanup, so PHP cleanup skips them entirely.
	 * This test now uses PHP-only providers for tasks that should be removed.
	 *
	 * @return void
	 */
	public function test_task_cleanup() {
		// Tasks that should not be removed.
		// React provider tasks are skipped by PHP cleanup (they handle their own).
		$tasks_to_keep = [
			// React provider tasks (current week) - kept because React providers are skipped.
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
			// React provider with past date - still kept because React providers are skipped.
			[
				'post_title'  => 'update-core-202451',
				'task_id'     => 'update-core-202451',
				'date'        => '202451',
				'category'    => 'maintenance',
				'provider_id' => 'update-core',
			],
			// User task with past date - kept because user tasks are skipped.
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
		// Only tasks with invalid/unknown providers (not React) are removed.
		$tasks_to_remove = [
			// Task with invalid provider (not React, not PHP) - will be deleted.
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
