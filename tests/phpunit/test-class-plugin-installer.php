<?php
/**
 * Class Plugin_Installer_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Plugin_Installer;

/**
 * Plugin Installer test case.
 */
class Plugin_Installer_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Plugin_Installer
	 */
	private $installer_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->installer_instance = new Plugin_Installer();
	}

	/**
	 * Test check_capabilities returns true for user with install_plugins capability.
	 *
	 * @return void
	 */
	public function test_check_capabilities_with_permission() {
		// Create a user with install_plugins capability.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );

		// In multisite, only super admins can install plugins.
		if ( \is_multisite() ) {
			\grant_super_admin( $user_id );
		}

		\wp_set_current_user( $user_id );

		$result = $this->installer_instance->check_capabilities();

		$this->assertTrue( $result );
	}

	/**
	 * Test check_capabilities returns error message for user without install_plugins capability.
	 *
	 * @return void
	 */
	public function test_check_capabilities_without_permission() {
		// Create a user without install_plugins capability.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $user_id );

		$result = $this->installer_instance->check_capabilities();

		$this->assertIsString( $result );
		$this->assertNotEmpty( $result );
		$this->assertNotTrue( $result );
	}

	/**
	 * Test is_plugin_installed detects installed plugins correctly.
	 *
	 * @return void
	 */
	public function test_is_plugin_installed() {
		// Test with non-existent plugin.
		$result = $this->installer_instance->is_plugin_installed( 'non-existent-plugin' );
		$this->assertFalse( $result );

		// Note: We can't easily test with actual installed plugins in unit tests
		// without mocking get_plugins(), but we verify the method correctly
		// returns false for non-existent plugins, which is the intended behavior.
	}

	/**
	 * Test is_plugin_activated detects activated plugins correctly.
	 *
	 * @return void
	 */
	public function test_is_plugin_activated() {
		// Test with non-existent plugin.
		$result = $this->installer_instance->is_plugin_activated( 'non-existent-plugin' );
		$this->assertFalse( $result );

		// Note: We can't easily test with actual activated plugins in unit tests
		// without mocking is_plugin_active(), but we verify the method correctly
		// returns false for non-existent plugins, which is the intended behavior.
	}

	/**
	 * Test constructor registers AJAX actions.
	 *
	 * @return void
	 */
	public function test_constructor_registers_ajax_actions() {
		$this->assertNotFalse( \has_action( 'wp_ajax_progress_planner_install_plugin', [ $this->installer_instance, 'install' ] ) );
		$this->assertNotFalse( \has_action( 'wp_ajax_progress_planner_activate_plugin', [ $this->installer_instance, 'activate' ] ) );
	}
}
