<?php
/**
 * Tests for Admin\Widgets\Activity_Scores widget.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Activity_Scores;

/**
 * Activity Scores widget test case.
 */
class Admin_Widget_Activity_Scores_Test extends \WP_UnitTestCase {

	/**
	 * Widget instance.
	 *
	 * @var Activity_Scores
	 */
	private $widget_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget_instance = new Activity_Scores();
	}

	/**
	 * Test get_id returns widget ID.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$this->assertEquals( 'activity-scores', $this->widget_instance->get_id() );
	}

	/**
	 * Test widget extends base Widget class.
	 *
	 * @return void
	 */
	public function test_extends_base_widget() {
		$this->assertInstanceOf( \Progress_Planner\Admin\Widgets\Widget::class, $this->widget_instance );
	}

	/**
	 * Test widget has correct width.
	 *
	 * @return void
	 */
	public function test_widget_width() {
		// Use reflection to check protected property.
		$reflection = new \ReflectionClass( $this->widget_instance );
		$width_property = $reflection->getProperty( 'width' );
		$width_property->setAccessible( true );
		$width = $width_property->getValue( $this->widget_instance );

		$this->assertIsInt( $width );
		$this->assertGreaterThanOrEqual( 1, $width );
		$this->assertLessThanOrEqual( 2, $width );
	}
}

