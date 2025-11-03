<?php
/**
 * Class Admin_Widgets_Badge_Streak_Maintenance_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Badge_Streak_Maintenance;

/**
 * Admin_Widgets_Badge_Streak_Maintenance_Test test case.
 *
 * @group admin
 */
class Admin_Widgets_Badge_Streak_Maintenance_Test extends \WP_UnitTestCase {

	/**
	 * Badge_Streak_Maintenance instance.
	 *
	 * @var Badge_Streak_Maintenance
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Badge_Streak_Maintenance();
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
