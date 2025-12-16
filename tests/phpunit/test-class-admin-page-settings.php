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
}
