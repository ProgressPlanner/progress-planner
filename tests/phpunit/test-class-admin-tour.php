<?php
/**
 * Class Admin_Tour_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Tour;

/**
 * Admin_Tour_Test test case.
 */
class Admin_Tour_Test extends \WP_UnitTestCase {

	/**
	 * Tour instance.
	 *
	 * @var Tour
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Tour();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Tour::class, $this->instance );
	}
}
