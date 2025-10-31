<?php
/**
 * Unit tests for Plugin_Upgrade_Tasks class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Plugin_Upgrade_Tasks;

/**
 * Plugin_Upgrade_Tasks test case.
 *
 * Tests the Plugin_Upgrade_Tasks class that handles plugin activation,
 * upgrade tasks, and onboarding task management.
 */
class Plugin_Upgrade_Tasks_Test extends WP_UnitTestCase {

	/**
	 * Plugin_Upgrade_Tasks instance.
	 *
	 * @var Plugin_Upgrade_Tasks
	 */
	private $upgrade_tasks;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->upgrade_tasks = new Plugin_Upgrade_Tasks();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );

		// Clean up options.
		\delete_option( 'progress_planner_plugin_was_activated' );
		\delete_option( 'progress_planner_plugin_was_updated' );
		\delete_option( 'progress_planner_previous_version_task_providers' );
		\delete_option( 'progress_planner_upgrade_popover_task_provider_ids' );
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		\delete_option( 'progress_planner_plugin_was_activated' );
		\delete_option( 'progress_planner_plugin_was_updated' );
		\delete_option( 'progress_planner_previous_version_task_providers' );
		\delete_option( 'progress_planner_upgrade_popover_task_provider_ids' );

		parent::tearDown();
	}

	/**
	 * Test constructor registers hooks.
	 */
	public function test_constructor_registers_hooks() {
		$upgrade_tasks = new Plugin_Upgrade_Tasks();

		$this->assertEquals(
			10,
			\has_action( 'activated_plugin', [ $upgrade_tasks, 'plugin_activated' ] ),
			'activated_plugin hook should be registered'
		);

		$this->assertEquals(
			10,
			\has_action( 'progress_planner_plugin_updated', [ $upgrade_tasks, 'plugin_updated' ] ),
			'progress_planner_plugin_updated hook should be registered'
		);

		$this->assertEquals(
			100,
			\has_action( 'init', [ $upgrade_tasks, 'handle_activation_or_upgrade' ] ),
			'init hook should be registered with priority 100'
		);

		$this->assertEquals(
			10,
			\has_action( 'progress_planner_admin_page_after_widgets', [ $upgrade_tasks, 'add_upgrade_tasks_popover' ] ),
			'progress_planner_admin_page_after_widgets hook should be registered'
		);
	}

	/**
	 * Test plugin_activated() sets option for Progress Planner.
	 */
	public function test_plugin_activated_progress_planner() {
		$this->upgrade_tasks->plugin_activated( 'progress-planner/progress-planner.php' );

		$this->assertTrue(
			(bool) \get_option( 'progress_planner_plugin_was_activated' ),
			'Should set activation option for Progress Planner'
		);
	}

	/**
	 * Test plugin_activated() ignores other plugins.
	 */
	public function test_plugin_activated_other_plugin() {
		$this->upgrade_tasks->plugin_activated( 'some-other-plugin/plugin.php' );

		$this->assertFalse(
			\get_option( 'progress_planner_plugin_was_activated' ),
			'Should not set activation option for other plugins'
		);
	}

	/**
	 * Test plugin_updated() sets option.
	 */
	public function test_plugin_updated() {
		$this->upgrade_tasks->plugin_updated();

		$this->assertTrue(
			(bool) \get_option( 'progress_planner_plugin_was_updated' ),
			'Should set update option'
		);
	}

	/**
	 * Test handle_activation_or_upgrade() processes activation.
	 */
	public function test_handle_activation_or_upgrade_activation() {
		\update_option( 'progress_planner_plugin_was_activated', true );

		$this->upgrade_tasks->handle_activation_or_upgrade();

		$this->assertFalse(
			\get_option( 'progress_planner_plugin_was_activated' ),
			'Should delete activation option after processing'
		);
	}

	/**
	 * Test handle_activation_or_upgrade() processes update.
	 */
	public function test_handle_activation_or_upgrade_update() {
		\update_option( 'progress_planner_plugin_was_updated', true );

		$this->upgrade_tasks->handle_activation_or_upgrade();

		$this->assertFalse(
			\get_option( 'progress_planner_plugin_was_updated' ),
			'Should delete update option after processing'
		);
	}

	/**
	 * Test handle_activation_or_upgrade() does nothing when no flags set.
	 */
	public function test_handle_activation_or_upgrade_no_flags() {
		$this->upgrade_tasks->handle_activation_or_upgrade();

		// Should complete without errors.
		$this->assertTrue( true, 'Should handle no flags gracefully' );
	}

	/**
	 * Test maybe_add_onboarding_tasks() updates task providers.
	 */
	public function test_maybe_add_onboarding_tasks() {
		// Set up filter to return test providers.
		\add_filter(
			'prpl_onboarding_task_providers',
			function () {
				return [ 'test-provider-1', 'test-provider-2' ];
			}
		);

		$this->upgrade_tasks->maybe_add_onboarding_tasks();

		$previous_providers = \get_option( 'progress_planner_previous_version_task_providers', [] );

		$this->assertContains( 'test-provider-1', $previous_providers );
		$this->assertContains( 'test-provider-2', $previous_providers );
	}

	/**
	 * Test maybe_add_onboarding_tasks() identifies new providers.
	 */
	public function test_maybe_add_onboarding_tasks_identifies_new() {
		// Set existing providers.
		\update_option( 'progress_planner_previous_version_task_providers', [ 'old-provider' ] );

		// Add filter for new providers.
		\add_filter(
			'prpl_onboarding_task_providers',
			function () {
				return [ 'old-provider', 'new-provider' ];
			}
		);

		$this->upgrade_tasks->maybe_add_onboarding_tasks();

		$newly_added = \get_option( 'progress_planner_upgrade_popover_task_provider_ids', [] );

		$this->assertContains( 'new-provider', $newly_added, 'Should identify new provider' );
		$this->assertNotContains( 'old-provider', $newly_added, 'Should not include old provider' );
	}

	/**
	 * Test maybe_add_onboarding_tasks() handles upgrade from v1.0.4.
	 */
	public function test_maybe_add_onboarding_tasks_upgrade_from_old_version() {
		// Simulate upgrade from v1.0.4 (no previous_version_task_providers option).
		// Mock privacy policy as accepted (not fresh install).
		\add_filter( 'progress_planner_is_privacy_policy_accepted', '__return_true' );

		$this->upgrade_tasks->maybe_add_onboarding_tasks();

		$previous_providers = \get_option( 'progress_planner_previous_version_task_providers', [] );

		// Should include v1.0.4 defaults.
		$this->assertContains( 'core-blogdescription', $previous_providers );
		$this->assertContains( 'core-siteicon', $previous_providers );
	}

	/**
	 * Test get_upgrade_popover_task_provider_ids() returns array.
	 */
	public function test_get_upgrade_popover_task_provider_ids() {
		$test_ids = [ 'provider-1', 'provider-2' ];
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', $test_ids );

		$result = $this->upgrade_tasks->get_upgrade_popover_task_provider_ids();

		$this->assertEquals( $test_ids, $result );
	}

	/**
	 * Test get_upgrade_popover_task_provider_ids() returns empty array by default.
	 */
	public function test_get_upgrade_popover_task_provider_ids_default() {
		$result = $this->upgrade_tasks->get_upgrade_popover_task_provider_ids();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test delete_upgrade_popover_task_providers().
	 */
	public function test_delete_upgrade_popover_task_providers() {
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', [ 'test' ] );

		$this->upgrade_tasks->delete_upgrade_popover_task_providers();

		$this->assertFalse(
			\get_option( 'progress_planner_upgrade_popover_task_provider_ids' ),
			'Should delete option'
		);
	}

	/**
	 * Test should_show_upgrade_popover() returns false when not on dashboard.
	 */
	public function test_should_show_upgrade_popover_not_on_dashboard() {
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', [ 'test' ] );

		// Mock not being on dashboard.
		\add_filter( 'progress_planner_is_on_progress_planner_dashboard_page', '__return_false' );

		$result = $this->upgrade_tasks->should_show_upgrade_popover();

		$this->assertFalse( $result, 'Should not show popover when not on dashboard' );
	}

	/**
	 * Test should_show_upgrade_popover() returns false when no providers.
	 */
	public function test_should_show_upgrade_popover_no_providers() {
		// Mock being on dashboard.
		\add_filter( 'progress_planner_is_on_progress_planner_dashboard_page', '__return_true' );

		$result = $this->upgrade_tasks->should_show_upgrade_popover();

		$this->assertFalse( $result, 'Should not show popover when no providers' );
	}

	/**
	 * Test should_show_upgrade_popover() returns true when conditions met.
	 */
	public function test_should_show_upgrade_popover_true() {
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', [ 'test' ] );

		// Mock being on dashboard.
		\add_filter( 'progress_planner_is_on_progress_planner_dashboard_page', '__return_true' );

		$result = $this->upgrade_tasks->should_show_upgrade_popover();

		$this->assertTrue( $result, 'Should show popover when on dashboard with providers' );
	}

	/**
	 * Test get_newly_added_task_providers() returns empty when should not show.
	 */
	public function test_get_newly_added_task_providers_no_show() {
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', [ 'test' ] );

		// Mock not being on dashboard.
		\add_filter( 'progress_planner_is_on_progress_planner_dashboard_page', '__return_false' );

		$result = $this->upgrade_tasks->get_newly_added_task_providers();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Should return empty array when not showing popover' );
	}

	/**
	 * Test get_newly_added_task_providers() caches results.
	 */
	public function test_get_newly_added_task_providers_caching() {
		\update_option( 'progress_planner_upgrade_popover_task_provider_ids', [] );

		// Mock being on dashboard.
		\add_filter( 'progress_planner_is_on_progress_planner_dashboard_page', '__return_true' );

		// First call.
		$result1 = $this->upgrade_tasks->get_newly_added_task_providers();

		// Second call should use cached result.
		$result2 = $this->upgrade_tasks->get_newly_added_task_providers();

		$this->assertEquals( $result1, $result2, 'Should return same cached result' );
	}

	/**
	 * Test add_upgrade_tasks_popover() only runs when should show.
	 */
	public function test_add_upgrade_tasks_popover() {
		// Mock not being on dashboard.
		\add_filter( 'progress_planner_is_on_progress_planner_dashboard_page', '__return_false' );

		// Should complete without errors even when not showing.
		$this->upgrade_tasks->add_upgrade_tasks_popover();

		$this->assertTrue( true, 'Should handle not showing popover gracefully' );
	}

	/**
	 * Test maybe_add_onboarding_tasks() prevents duplicate providers.
	 */
	public function test_maybe_add_onboarding_tasks_no_duplicates() {
		// Set existing provider.
		\update_option( 'progress_planner_previous_version_task_providers', [ 'provider-1' ] );

		// Add filter returning same provider twice.
		\add_filter(
			'prpl_onboarding_task_providers',
			function () {
				return [ 'provider-1', 'provider-1' ];
			}
		);

		$this->upgrade_tasks->maybe_add_onboarding_tasks();

		$previous_providers = \get_option( 'progress_planner_previous_version_task_providers', [] );

		// Should only have one instance.
		$this->assertCount( 1, $previous_providers, 'Should prevent duplicate providers' );
	}

	/**
	 * Test handle_activation_or_upgrade() prioritizes activation over update.
	 */
	public function test_handle_activation_or_upgrade_prioritizes_activation() {
		// Set both flags.
		\update_option( 'progress_planner_plugin_was_activated', true );
		\update_option( 'progress_planner_plugin_was_updated', true );

		$this->upgrade_tasks->handle_activation_or_upgrade();

		// Activation should be processed and deleted.
		$this->assertFalse( \get_option( 'progress_planner_plugin_was_activated' ) );

		// Update flag should still exist (not processed).
		$this->assertTrue( (bool) \get_option( 'progress_planner_plugin_was_updated' ) );
	}
}
