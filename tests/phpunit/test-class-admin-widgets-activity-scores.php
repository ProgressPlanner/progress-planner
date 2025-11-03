<?php
/**
 * Class Admin_Widgets_Activity_Scores_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Activity_Scores;

/**
 * Admin_Widgets_Activity_Scores_Test test case.
 *
 * @group admin
 */
class Admin_Widgets_Activity_Scores_Test extends \WP_UnitTestCase {

	/**
	 * Activity_Scores instance.
	 *
	 * @var Activity_Scores
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Activity_Scores();
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
