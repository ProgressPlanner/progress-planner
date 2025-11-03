<?php
/**
 * Class Plugin_Deactivation_Test
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Plugin_Deactivation;

/**
 * Plugin_Deactivation_Test test case.
 */
class Plugin_Deactivation_Test extends \WP_UnitTestCase {

	/**
	 * Plugin_Deactivation instance.
	 *
	 * @var Plugin_Deactivation
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Plugin_Deactivation();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Plugin_Deactivation::class, $this->instance );
	}
}
