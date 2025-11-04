<?php
/**
 * Unit tests for onboarding tasks.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests\Unit;

use WP_UnitTestCase;

/**
 * Class Onboarding_Tasks_Test.
 */
class Onboarding_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Test that all expected onboarding tasks are registered.
	 */
	public function test_onboarding_tasks_are_registered() {
		$expected_tasks = [
			'core-blogdescription',
			'wp-debug-display',
			'disable-comments',
			'sample-page',
			'hello-world',
			'core-siteicon',
			'core-permalink-structure',
			'php-version',
			'search-engine-visibility',
			'rename-uncategorized-category',
			'fewer-tags',
		];

		$onboard_task_provider_ids = \apply_filters( 'prpl_onboarding_task_providers', [] );

		// Check that all expected tasks are registered.
		foreach ( $expected_tasks as $task_id ) {
			$this->assertContains( $task_id, $onboard_task_provider_ids, "Task provider {$task_id} is not registered" );
		}
	}
}
