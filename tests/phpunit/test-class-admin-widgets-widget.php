<?php
/**
 * Class Admin_Widgets_Widget_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Widget;

/**
 * Admin_Widgets_Widget_Test test case.
 */
class Admin_Widgets_Widget_Test extends \WP_UnitTestCase {

	/**
	 * Widget instance.
	 *
	 * @var Widget
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Widget();
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
