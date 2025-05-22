<?php
/**
 * Class Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks_DB;

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
		];

		foreach ( $tasks_to_keep as $task ) {
			Suggested_Tasks_DB::add( $task );
		}

		// Tasks that should be removed.
		$tasks_to_remove = [
			[
				'post_title'  => 'update-core-202451',
				'task_id'     => 'update-core-202451',
				'date'        => '202451',
				'category'    => 'maintenance',
				'provider_id' => 'update-core',
			],
			[
				'post_title'  => 'settings-saved-202451',
				'task_id'     => 'settings-saved-202451',
				'date'        => '202451',
				'provider_id' => 'settings-saved',
				'category'    => 'configuration',
			],
		];

		foreach ( $tasks_to_remove as $task ) {
			Suggested_Tasks_DB::add( $task );
		}

		\progress_planner()->get_suggested_tasks()->get_tasks_manager()->cleanup_pending_tasks();
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP ); // Clear the cache.
		$this->assertEquals( count( $tasks_to_keep ), \count( Suggested_Tasks_DB::get_tasks_by( [ 'post_status' => 'publish' ] ) ) );
	}
}
