<?php
/**
 * Class Plugin_Installer_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Plugin_Installer test case.
 */
class Plugin_Installer_Test extends \WP_UnitTestCase {

	/**
	 * The Plugin_Installer instance.
	 *
	 * @var \Progress_Planner\Plugin_Installer
	 */
	private $installer;

	/**
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();
		$this->installer = new \Progress_Planner\Plugin_Installer();
	}

	/**
	 * Test constructor hooks are registered.
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, has_action( 'wp_ajax_progress_planner_install_plugin', [ $this->installer, 'install' ] ) );
		$this->assertEquals( 10, has_action( 'wp_ajax_progress_planner_activate_plugin', [ $this->installer, 'activate' ] ) );
	}

	/**
	 * Test check_capabilities returns true for admin user.
	 */
	public function test_check_capabilities_admin() {
		// Create an admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $admin_id );

		$result = $this->installer->check_capabilities();

		$this->assertTrue( $result );
	}

	/**
	 * Test check_capabilities returns error for non-admin user.
	 */
	public function test_check_capabilities_non_admin() {
		// Create a subscriber user.
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		wp_set_current_user( $subscriber_id );

		$result = $this->installer->check_capabilities();

		$this->assertIsString( $result );
		$this->assertStringContainsString( 'not allowed', $result );
	}

	/**
	 * Test is_plugin_installed returns false for non-existent plugin.
	 */
	public function test_is_plugin_installed_non_existent() {
		$result = $this->installer->is_plugin_installed( 'non-existent-plugin-xyz-123' );

		$this->assertFalse( $result );
	}

	/**
	 * Test is_plugin_installed returns correct result for existing plugin.
	 */
	public function test_is_plugin_installed_existing_plugin() {
		// Get any installed plugin from the test environment.
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins = get_plugins();

		// If there are plugins, test with the first one.
		if ( ! empty( $plugins ) ) {
			$first_plugin = array_keys( $plugins )[0];
			$plugin_slug  = explode( '/', $first_plugin )[0];

			$result = $this->installer->is_plugin_installed( $plugin_slug );
			$this->assertTrue( $result );
		} else {
			// No plugins available, just test that the method returns a boolean.
			$result = $this->installer->is_plugin_installed( 'some-plugin' );
			$this->assertIsBool( $result );
		}
	}

	/**
	 * Test is_plugin_installed with empty slug.
	 */
	public function test_is_plugin_installed_empty_slug() {
		$result = $this->installer->is_plugin_installed( '' );

		$this->assertFalse( $result );
	}

	/**
	 * Test is_plugin_activated returns correct result.
	 */
	public function test_is_plugin_activated_active_plugin() {
		// Get any installed plugin from the test environment.
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins = get_plugins();

		// If there are plugins, test with the first one.
		if ( ! empty( $plugins ) ) {
			$first_plugin = array_keys( $plugins )[0];
			$plugin_slug  = explode( '/', $first_plugin )[0];

			$result = $this->installer->is_plugin_activated( $plugin_slug );
			// Result should be boolean.
			$this->assertIsBool( $result );
		} else {
			// No plugins available, just test that the method returns a boolean.
			$result = $this->installer->is_plugin_activated( 'some-plugin' );
			$this->assertIsBool( $result );
		}
	}

	/**
	 * Test is_plugin_activated returns false for non-existent plugin.
	 */
	public function test_is_plugin_activated_non_existent() {
		$result = $this->installer->is_plugin_activated( 'non-existent-plugin-xyz-123' );

		$this->assertFalse( $result );
	}

	/**
	 * Test is_plugin_activated with empty slug.
	 */
	public function test_is_plugin_activated_empty_slug() {
		$result = $this->installer->is_plugin_activated( '' );

		$this->assertFalse( $result );
	}
}
