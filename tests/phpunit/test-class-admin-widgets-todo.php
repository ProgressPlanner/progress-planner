<?php
/**
 * Test for the Admin Widgets Task List functionality
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Todo;

/**
 * Test case for the Admin Widgets Task List class.
 *
 * @group admin
 */
class Admin_Widgets_Todo_Test extends \WP_UnitTestCase {

	// phpcs:disable Generic.Commenting.Todo.CommentFound
	/**
	 * Instance of the Task List widget for testing.
	 *
	 * @var Todo
	 */
	protected $widget;
	// phpcs:enable Generic.Commenting.Todo.CommentFound

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Todo();
	}

	/**
	 * Test get_id returns string.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$result = $this->widget->get_id();
		$this->assertIsString( $result );
		$this->assertNotEmpty( $result );
	}

	/**
	 * Test render method is callable.
	 *
	 * @return void
	 */
	public function test_render_callable() {
		$this->assertTrue( \is_callable( [ $this->widget, 'render' ] ) );
	}
}
