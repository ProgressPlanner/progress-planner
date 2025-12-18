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
	 * The Tasks_Manager instance.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Tasks_Manager
	 */
	private $tasks_manager;

	/**
	 * Set up before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->tasks_manager = \progress_planner()->get_suggested_tasks()->get_tasks_manager();
	}

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

	/**
	 * Test get_react_provider_ids returns array of React provider IDs.
	 *
	 * @return void
	 */
	public function test_get_react_provider_ids_returns_array() {
		$react_providers = $this->tasks_manager->get_react_provider_ids();

		$this->assertIsArray( $react_providers );
		$this->assertNotEmpty( $react_providers );
	}

	/**
	 * Test get_react_provider_ids contains expected provider IDs.
	 *
	 * @return void
	 */
	public function test_get_react_provider_ids_contains_expected_providers() {
		$react_providers = $this->tasks_manager->get_react_provider_ids();

		// Test a sample of expected React providers.
		$expected_providers = [
			'core-blogdescription',
			'core-permalink-structure',
			'create-post',
			'review-post',
			'update-core',
			'wp-debug-display',
			'php-version',
			'search-engine-visibility',
			'rename-uncategorized-category',
			'sample-page',
			'hello-world',
		];

		foreach ( $expected_providers as $provider ) {
			$this->assertContains( $provider, $react_providers, "Expected React provider '{$provider}' not found" );
		}
	}

	/**
	 * Test get_react_provider_ids does not contain PHP providers.
	 *
	 * @return void
	 */
	public function test_get_react_provider_ids_excludes_php_providers() {
		$react_providers = $this->tasks_manager->get_react_provider_ids();

		// These providers are PHP-only.
		$php_only_providers = [
			'user',
			'collaborator',
		];

		foreach ( $php_only_providers as $provider ) {
			$this->assertNotContains( $provider, $react_providers, "PHP provider '{$provider}' should not be in React providers list" );
		}
	}

	/**
	 * Test cleanup_pending_tasks skips React provider tasks.
	 *
	 * @return void
	 */
	public function test_cleanup_skips_react_providers() {
		// Clear the cleanup cache to allow cleanup to run.
		\progress_planner()->get_utils__cache()->delete( 'cleanup_pending_tasks' );

		// Add a task from a React provider with old date.
		$react_task = [
			'post_title'  => 'search-engine-visibility-old',
			'task_id'     => 'search-engine-visibility-old',
			'date'        => '202401',
			'category'    => 'configuration',
			'provider_id' => 'search-engine-visibility',
		];
		\progress_planner()->get_suggested_tasks_db()->add( $react_task );

		// Run cleanup.
		$this->tasks_manager->cleanup_pending_tasks();
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );

		// Get tasks.
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'publish' ] );

		// Find the React task - it should still exist.
		$found = false;
		foreach ( $tasks as $task ) {
			if ( 'search-engine-visibility-old' === $task->post_name ) {
				$found = true;
				break;
			}
		}

		$this->assertTrue( $found, 'React provider task should not be cleaned up by PHP' );
	}

	/**
	 * Test get_task_provider returns null for React providers.
	 *
	 * @return void
	 */
	public function test_get_task_provider_returns_null_for_react_providers() {
		// React providers are not registered in PHP, so get_task_provider should return null.
		$react_providers = $this->tasks_manager->get_react_provider_ids();

		foreach ( \array_slice( $react_providers, 0, 5 ) as $provider_id ) {
			$provider = $this->tasks_manager->get_task_provider( $provider_id );
			$this->assertNull( $provider, "React provider '{$provider_id}' should return null from get_task_provider()" );
		}
	}

	/**
	 * Test get_task_provider returns provider for PHP providers.
	 *
	 * @return void
	 */
	public function test_get_task_provider_returns_provider_for_php_providers() {
		// User is a PHP provider.
		$provider = $this->tasks_manager->get_task_provider( 'user' );
		$this->assertNotNull( $provider, 'PHP provider "user" should be available' );
		$this->assertInstanceOf(
			\Progress_Planner\Suggested_Tasks\Tasks_Interface::class,
			$provider,
			'PHP provider should implement Tasks_Interface'
		);
	}

	/**
	 * Test get_task_providers returns only PHP providers.
	 *
	 * @return void
	 */
	public function test_get_task_providers_returns_php_providers() {
		$providers       = $this->tasks_manager->get_task_providers();
		$react_providers = $this->tasks_manager->get_react_provider_ids();

		$this->assertIsArray( $providers );

		// Verify returned providers are PHP instances, not React.
		foreach ( $providers as $provider ) {
			$this->assertInstanceOf(
				\Progress_Planner\Suggested_Tasks\Tasks_Interface::class,
				$provider,
				'All task providers should implement Tasks_Interface'
			);
			$this->assertNotContains(
				$provider->get_provider_id(),
				$react_providers,
				'Returned provider should not be a React provider'
			);
		}
	}

	/**
	 * Test React provider count matches expected.
	 *
	 * @return void
	 */
	public function test_react_provider_count() {
		$react_providers = $this->tasks_manager->get_react_provider_ids();

		// Expected count based on REACT_PROVIDERS constant.
		// This ensures the constant is properly maintained.
		$expected_count = 30;

		$this->assertCount(
			$expected_count,
			$react_providers,
			'React provider count should match expected. Update test if providers were added/removed.'
		);
	}
}
