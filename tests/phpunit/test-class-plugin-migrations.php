<?php
/**
 * Class Plugin_Migrations_Test
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Plugin_Migrations;

/**
 * Plugin_Migrations_Test test case.
 *
 * @group misc
 */
class Plugin_Migrations_Test extends \WP_UnitTestCase {

	/**
	 * Plugin_Migrations instance.
	 *
	 * @var Plugin_Migrations
	 */
	protected $instance;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Plugin_Migrations();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Plugin_Migrations::class, $this->instance );
	}
}
