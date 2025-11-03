<?php
/**
 * Class Admin_Widgets_Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Suggested_Tasks;

/**
 * Admin_Widgets_Suggested_Tasks_Test test case.
 *
 * @group admin
 */
class Admin_Widgets_Suggested_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Suggested_Tasks instance.
	 *
	 * @var Suggested_Tasks
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Suggested_Tasks();
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
