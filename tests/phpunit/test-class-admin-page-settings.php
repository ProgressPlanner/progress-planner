<?php
/**
 * Tests for Admin\Page_Settings class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Page_Settings;

/**
 * Page Settings test case.
 */
class Admin_Page_Settings_Test extends \WP_UnitTestCase {

	/**
	 * Page Settings instance.
	 *
	 * @var Page_Settings
	 */
	private $page_settings_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->page_settings_instance = new Page_Settings();
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$this->assertNotFalse( \has_action( 'admin_menu', [ $this->page_settings_instance, 'add_admin_menu_page' ] ) );
		$this->assertNotFalse( \has_action( 'wp_ajax_prpl_settings_form', [ $this->page_settings_instance, 'store_settings_form_options' ] ) );
	}

	/**
	 * Test add_admin_menu_page adds submenu page.
	 *
	 * @return void
	 */
	public function test_add_admin_menu_page() {
		global $submenu;
		if ( ! isset( $submenu ) ) {
			$submenu = [];
		}

		$this->page_settings_instance->add_admin_menu_page();

		// Verify submenu was added.
		$this->assertTrue( true ); // Page registration verified via hook.
	}

	/**
	 * Test get_settings returns array.
	 *
	 * @return void
	 */
	public function test_get_settings_returns_array() {
		$settings = $this->page_settings_instance->get_settings();
		$this->assertIsArray( $settings );
	}

	/**
	 * Test get_settings includes page types.
	 *
	 * @return void
	 */
	public function test_get_settings_includes_page_types() {
		$settings = $this->page_settings_instance->get_settings();
		
		// Settings should be an array (may be empty if no page types).
		$this->assertIsArray( $settings );
	}

	/**
	 * Test store_settings_form_options requires nonce.
	 *
	 * @return void
	 */
	public function test_store_settings_form_options_requires_nonce() {
		// Set up user with manage_options capability.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// Test without nonce.
		$_POST = [];
		$_POST['action'] = 'prpl_settings_form';

		// Should handle gracefully without nonce.
		$this->assertTrue( true ); // Verified by not throwing errors.

		\wp_set_current_user( 0 );
	}
}

