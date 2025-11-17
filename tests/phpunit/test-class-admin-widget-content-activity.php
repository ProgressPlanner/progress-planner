<?php
/**
 * Tests for Admin\Widgets\Content_Activity widget.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Content_Activity;

/**
 * Content Activity widget test case.
 */
class Admin_Widget_Content_Activity_Test extends \WP_UnitTestCase {

	/**
	 * Widget instance.
	 *
	 * @var Content_Activity
	 */
	private $widget_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget_instance = new Content_Activity();
	}

	/**
	 * Test get_id returns widget ID.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$this->assertEquals( 'content-activity', $this->widget_instance->get_id() );
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

