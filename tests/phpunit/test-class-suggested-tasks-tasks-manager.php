<?php
/**
 * Unit tests for Tasks_Manager class.
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks\Tasks_Manager;
use Progress_Planner\Suggested_Tasks\Tasks_Interface;

/**
 * Suggested_Tasks_Tasks_Manager test case.
 *
 * Tests the Tasks_Manager class that manages task providers,
 * task evaluation, and task injection.
 */
class Suggested_Tasks_Tasks_Manager_Test extends WP_UnitTestCase {

	/**
	 * Tasks_Manager instance.
	 *
	 * @var Tasks_Manager
	 */
	private $manager;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->manager = new Tasks_Manager();
	}

	/**
	 * Test get_task_providers returns array.
	 */
	public function test_get_task_providers_returns_array() {
		$providers = $this->manager->get_task_providers();

		$this->assertIsArray( $providers, 'Should return array of providers' );
		$this->assertNotEmpty( $providers, 'Should have at least one provider' );
	}

	/**
	 * Test get_task_providers returns Tasks_Interface instances.
	 */
	public function test_get_task_providers_returns_interface_instances() {
		$providers = $this->manager->get_task_providers();

		foreach ( $providers as $provider ) {
			$this->assertInstanceOf(
				Tasks_Interface::class,
				$provider,
				'Each provider should implement Tasks_Interface'
			);
		}
	}

	/**
	 * Test get_task_provider with valid provider ID.
	 */
	public function test_get_task_provider_valid() {
		// Get all providers to find a valid one.
		$providers = $this->manager->get_task_providers();
		if ( empty( $providers ) ) {
			$this->markTestSkipped( 'No providers available' );
		}

		$first_provider = \reset( $providers );
		$provider_id    = $first_provider->get_provider_id();

		$provider = $this->manager->get_task_provider( $provider_id );

		$this->assertInstanceOf( Tasks_Interface::class, $provider, 'Should return provider instance' );
		$this->assertEquals( $provider_id, $provider->get_provider_id(), 'Provider ID should match' );
	}

	/**
	 * Test get_task_provider with invalid provider ID.
	 */
	public function test_get_task_provider_invalid() {
		$provider = $this->manager->get_task_provider( 'nonexistent-provider' );

		$this->assertNull( $provider, 'Should return null for invalid provider ID' );
	}

	/**
	 * Test magic __call method with get_ prefix.
	 */
	public function test_magic_call_with_get_prefix() {
		// Get the first provider's ID.
		$providers = $this->manager->get_task_providers();
		if ( empty( $providers ) ) {
			$this->markTestSkipped( 'No providers available' );
		}

		$first_provider = \reset( $providers );
		$provider_id    = $first_provider->get_provider_id();

		// Transform provider ID to method name format.
		// e.g., 'content-create' becomes 'get_content_create'.
		$method_name = 'get_' . \str_replace( '-', '_', $provider_id );

		$provider = $this->manager->$method_name();

		$this->assertInstanceOf( Tasks_Interface::class, $provider, 'Magic method should return provider' );
	}

	/**
	 * Test magic __call method with non-get prefix returns null.
	 */
	public function test_magic_call_without_get_prefix() {
		$result = $this->manager->some_method();

		$this->assertNull( $result, 'Non-get methods should return null' );
	}

	/**
	 * Test get_task_providers_available_for_user returns filtered array.
	 */
	public function test_get_task_providers_available_for_user() {
		$available_providers = $this->manager->get_task_providers_available_for_user();

		$this->assertIsArray( $available_providers, 'Should return array' );

		// Verify all returned providers have capability check passed.
		foreach ( $available_providers as $provider ) {
			$this->assertTrue( $provider->capability_required(), 'Provider should have required capability' );
		}
	}

	/**
	 * Test evaluate_tasks returns array.
	 */
	public function test_evaluate_tasks_returns_array() {
		$tasks = $this->manager->evaluate_tasks();

		$this->assertIsArray( $tasks, 'Should return array of evaluated tasks' );
	}

	/**
	 * Test add_onboarding_task_providers filter.
	 */
	public function test_add_onboarding_task_providers() {
		$task_providers = [];
		$result         = $this->manager->add_onboarding_task_providers( $task_providers );

		$this->assertIsArray( $result, 'Should return array' );
	}

	/**
	 * Test constructor instantiates task providers.
	 */
	public function test_constructor_instantiates_providers() {
		$manager   = new Tasks_Manager();
		$providers = $manager->get_task_providers();

		$this->assertNotEmpty( $providers, 'Constructor should instantiate providers' );
		$this->assertContainsOnlyInstancesOf( Tasks_Interface::class, $providers, 'All providers should implement interface' );
	}

	/**
	 * Test hooks are registered.
	 */
	public function test_hooks_registered() {
		// Check if plugins_loaded action is registered.
		$this->assertEquals(
			10,
			\has_action( 'plugins_loaded', [ $this->manager, 'add_plugin_integration' ] ),
			'plugins_loaded hook should be registered'
		);

		// Check if init action is registered.
		$this->assertEquals(
			99,
			\has_action( 'init', [ $this->manager, 'init' ] ),
			'init hook should be registered with priority 99'
		);

		// Check if admin_init action is registered.
		$this->assertEquals(
			10,
			\has_action( 'admin_init', [ $this->manager, 'cleanup_pending_tasks' ] ),
			'admin_init hook should be registered'
		);

		// Check if transition_post_status action is registered.
		$this->assertEquals(
			10,
			\has_action( 'transition_post_status', [ $this->manager, 'handle_task_unsnooze' ] ),
			'transition_post_status hook should be registered'
		);
	}
}
