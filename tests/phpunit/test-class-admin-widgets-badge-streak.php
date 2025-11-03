<?php
/**
 * Class Admin_Widgets_Badge_Streak_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Badge_Streak;

/**
 * Mock Badge_Streak for testing abstract class.
 */
class Mock_Badge_Streak extends Badge_Streak {
	// No additional methods needed - Badge_Streak is abstract but has no abstract methods.
}

/**
 * Admin_Widgets_Badge_Streak_Test test case.
 */
class Admin_Widgets_Badge_Streak_Test extends \WP_UnitTestCase {

	/**
	 * Badge_Streak instance.
	 *
	 * @var Mock_Badge_Streak
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Mock_Badge_Streak();
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
