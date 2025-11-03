<?php
/**
 * Class Admin_Widgets_Content_Activity_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Content_Activity;

/**
 * Admin_Widgets_Content_Activity_Test test case.
 */
class Admin_Widgets_Content_Activity_Test extends \WP_UnitTestCase {

	/**
	 * Content_Activity instance.
	 *
	 * @var Content_Activity
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Content_Activity();
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
