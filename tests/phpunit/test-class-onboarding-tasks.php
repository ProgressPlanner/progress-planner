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
	 * Test that onboarding tasks filter works.
	 *
	 * Note: Most onboarding task providers have been migrated to React.
	 * This test now verifies the filter mechanism works correctly.
	 */
	public function test_onboarding_tasks_filter_works() {
		$onboard_task_provider_ids = \apply_filters( 'prpl_onboarding_task_providers', [] );

		// The filter should return an array.
		$this->assertIsArray( $onboard_task_provider_ids );

		// PHP-based providers (Yoast, AIOSEO) may add onboarding tasks if plugins are active.
		// We can't test for specific React-migrated tasks here since they're handled client-side.
	}

	/**
	 * Test that custom providers can register via filter.
	 */
	public function test_custom_onboarding_tasks_can_register() {
		// Add a custom provider via filter.
		\add_filter(
			'prpl_onboarding_task_providers',
			function ( $providers ) {
				$providers[] = 'test-custom-provider';
				return $providers;
			}
		);

		$onboard_task_provider_ids = \apply_filters( 'prpl_onboarding_task_providers', [] );

		// The custom provider should be in the list.
		$this->assertContains( 'test-custom-provider', $onboard_task_provider_ids );
	}
}
