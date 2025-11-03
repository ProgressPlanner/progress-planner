<?php
/**
 * Class Plugin_Installer_Test
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Plugin_Installer;

/**
 * Plugin_Installer_Test test case.
 */
class Plugin_Installer_Test extends \WP_UnitTestCase {

	/**
	 * Plugin_Installer instance.
	 *
	 * @var Plugin_Installer
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Plugin_Installer();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Plugin_Installer::class, $this->instance );
	}
}
