<?php
/**
 * Class Admin_Page_Settings_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Page_Settings;

/**
 * Admin_Page_Settings_Test test case.
 */
class Admin_Page_Settings_Test extends \WP_UnitTestCase {

	/**
	 * Page_Settings instance.
	 *
	 * @var Page_Settings
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Page_Settings();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Page_Settings::class, $this->instance );
	}
}
