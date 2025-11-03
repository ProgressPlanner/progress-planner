<?php
/**
 * Class Plugin_Upgrade_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Plugin_Upgrade_Tasks;

/**
 * Plugin_Upgrade_Tasks_Test test case.
 */
class Plugin_Upgrade_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Plugin_Upgrade_Tasks instance.
	 *
	 * @var Plugin_Upgrade_Tasks
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Plugin_Upgrade_Tasks();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Plugin_Upgrade_Tasks::class, $this->instance );
	}
}
