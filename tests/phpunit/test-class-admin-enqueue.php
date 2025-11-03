<?php
/**
 * Class Admin_Enqueue_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Enqueue;

/**
 * Admin_Enqueue_Test test case.
 *
 * @group admin
 */
class Admin_Enqueue_Test extends \WP_UnitTestCase {

	/**
	 * Enqueue instance.
	 *
	 * @var Enqueue
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Enqueue();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Enqueue::class, $this->instance );
	}
}
