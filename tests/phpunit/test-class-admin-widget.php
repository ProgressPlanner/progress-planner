<?php
/**
 * Tests for Admin\Widgets\Widget base class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Widget;

/**
 * Mock widget class for testing.
 */
class Mock_Widget extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'test-widget';

	/**
	 * The widget width.
	 *
	 * @var int
	 */
	protected $width = 1;

	/**
	 * Whether the widget should be forced to the last column.
	 *
	 * @var bool
	 */
	protected $force_last_column = false;
}

/**
 * Widget test case.
 */
class Admin_Widget_Test extends \WP_UnitTestCase {

	/**
	 * Widget instance.
	 *
	 * @var Mock_Widget
	 */
	private $widget_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget_instance = new Mock_Widget();
	}

	/**
	 * Test get_id returns widget ID.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$this->assertEquals( 'test-widget', $this->widget_instance->get_id() );
	}

	/**
	 * Test get_range returns sanitized GET parameter or default.
	 *
	 * @return void
	 */
	public function test_get_range() {
		// Test default value.
		$this->assertEquals( '-6 months', $this->widget_instance->get_range() );

		// Test with GET parameter.
		$_GET['range'] = '-1 year';
		$this->assertEquals( '-1 year', $this->widget_instance->get_range() );

		// Clean up.
		unset( $_GET['range'] );
	}

	/**
	 * Test get_frequency returns sanitized GET parameter or default.
	 *
	 * @return void
	 */
	public function test_get_frequency() {
		// Test default value.
		$this->assertEquals( 'monthly', $this->widget_instance->get_frequency() );

		// Test with GET parameter.
		$_GET['frequency'] = 'weekly';
		$this->assertEquals( 'weekly', $this->widget_instance->get_frequency() );

		// Clean up.
		unset( $_GET['frequency'] );
	}

	/**
	 * Test get_range sanitizes malicious input.
	 *
	 * @return void
	 */
	public function test_get_range_sanitizes_input() {
		$_GET['range'] = '<script>alert("xss")</script>';
		$result        = $this->widget_instance->get_range();
		$this->assertStringNotContainsString( '<script>', $result );
		$this->assertStringNotContainsString( 'alert', $result );
		unset( $_GET['range'] );
	}

	/**
	 * Test get_frequency sanitizes malicious input.
	 *
	 * @return void
	 */
	public function test_get_frequency_sanitizes_input() {
		$_GET['frequency'] = '<script>alert("xss")</script>';
		$result            = $this->widget_instance->get_frequency();
		$this->assertStringNotContainsString( '<script>', $result );
		$this->assertStringNotContainsString( 'alert', $result );
		unset( $_GET['frequency'] );
	}
}
