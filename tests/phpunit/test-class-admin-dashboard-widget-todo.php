<?php
/**
 * Test for the Dashboard Widget Task List functionality
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Dashboard_Widget_Todo;

/**
 * Test case for the Dashboard Widget Task List class.
 *
 * @group admin
 */
class Admin_Dashboard_Widget_Todo_Test extends \WP_UnitTestCase {

	// phpcs:disable Generic.Commenting.Todo.CommentFound
	/**
	 * Instance of the Dashboard Widget Task List for testing.
	 *
	 * @var Dashboard_Widget_Todo
	 */
	protected $instance;
	// phpcs:enable Generic.Commenting.Todo.CommentFound

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->instance = new Dashboard_Widget_Todo();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Dashboard_Widget_Todo::class, $this->instance );
	}
}
