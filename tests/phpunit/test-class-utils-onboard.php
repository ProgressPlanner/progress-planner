<?php
/**
 * Unit tests for Onboard utility class.
 *
 * @package Progress_Planner\Tests
 * @group utils
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Utils\Onboard;

/**
 * Utils_Onboard test case.
 *
 * Tests the Onboard utility class that handles plugin
 * onboarding and activation workflows.
 *
 * @group utils
 */
class Utils_Onboard_Test extends WP_UnitTestCase {

	/**
	 * Onboard instance.
	 *
	 * @var Onboard
	 */
	private $onboard;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->onboard = new Onboard();
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		\delete_option( 'progress_planner_license_key' );
		\delete_option( 'progress_planner_onboarded' );
		parent::tear_down();
	}

	/**
	 * Test REMOTE_API_URL constant exists.
	 *
	 * @return void
	 */
	public function test_remote_api_url_constant() {
		$this->assertTrue( \defined( 'Progress_Planner\Utils\Onboard::REMOTE_API_URL' ), 'REMOTE_API_URL constant should exist' );
		$this->assertIsString( Onboard::REMOTE_API_URL, 'REMOTE_API_URL should be a string' );
		$this->assertStringStartsWith( '/wp-json/', Onboard::REMOTE_API_URL, 'REMOTE_API_URL should start with /wp-json/' );
	}

	/**
	 * Test instance can be created.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Onboard::class, $this->onboard, 'Should create Onboard instance' );
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		// Save onboard data AJAX action should be registered.
		$this->assertTrue( \has_action( 'wp_ajax_progress_planner_save_onboard_data' ), 'Should register save onboard data AJAX action' );

		// Shutdown hook should be registered.
		$this->assertTrue( \has_action( 'shutdown' ), 'Should register shutdown hook' );
	}

	/**
	 * Test activation hook is registered when no license key exists.
	 *
	 * @return void
	 */
	public function test_activation_hook_registered_without_license() {
		\delete_option( 'progress_planner_license_key' );

		// Create a new instance to trigger constructor logic.
		new Onboard();

		$this->assertTrue( \has_action( 'activated_plugin' ), 'Should register activated_plugin hook when no license exists' );
	}

	/**
	 * Test on_activate_plugin ignores other plugins.
	 *
	 * @return void
	 */
	public function test_on_activate_plugin_ignores_other_plugins() {
		$onboard = new Onboard();

		// This should return early without doing anything.
		$onboard->on_activate_plugin( 'some-other-plugin/plugin.php' );

		// No assertions needed - just verify no errors occur.
		$this->assertTrue( true, 'Should handle other plugins gracefully' );
	}

	/**
	 * Test on_activate_plugin handles WP_CLI environment.
	 *
	 * @return void
	 */
	public function test_on_activate_plugin_handles_wp_cli() {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- WP_CLI is a WordPress core constant.
		if ( ! \defined( 'WP_CLI' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
			\define( 'WP_CLI', true );
		}

		$onboard = new Onboard();

		// In WP_CLI mode, should not redirect (just return).
		$onboard->on_activate_plugin( 'progress-planner/progress-planner.php' );

		// No assertions needed - just verify no errors occur.
		$this->assertTrue( true, 'Should handle WP_CLI environment gracefully' );
	}

	/**
	 * Test save_onboard_response requires manage_options capability.
	 *
	 * @return void
	 */
	public function test_save_onboard_response_requires_capability() {
		// Set up user without manage_options capability.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $user_id );

		// Capture output to prevent test errors.
		\ob_start();
		$this->onboard->save_onboard_response();
		$output = \ob_get_clean();

		// Decode JSON response.
		$response = \json_decode( $output, true );

		$this->assertFalse( $response['success'] ?? true, 'Should fail without manage_options capability' );
	}

	/**
	 * Test save_onboard_response requires valid nonce.
	 *
	 * @return void
	 */
	public function test_save_onboard_response_requires_nonce() {
		// Set up admin user.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// Capture output to prevent test errors.
		\ob_start();
		$this->onboard->save_onboard_response();
		$output = \ob_get_clean();

		// Decode JSON response.
		$response = \json_decode( $output, true );

		$this->assertFalse( $response['success'] ?? true, 'Should fail without valid nonce' );
	}

	/**
	 * Test save_onboard_response requires key parameter.
	 *
	 * @return void
	 */
	public function test_save_onboard_response_requires_key() {
		// Set up admin user.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// Set valid nonce.
		$_POST['nonce'] = \wp_create_nonce( 'progress_planner' );

		// Capture output to prevent test errors.
		\ob_start();
		$this->onboard->save_onboard_response();
		$output = \ob_get_clean();

		// Decode JSON response.
		$response = \json_decode( $output, true );

		$this->assertFalse( $response['success'] ?? true, 'Should fail without key parameter' );

		// Clean up.
		unset( $_POST['nonce'] );
	}
}
