<?php
/**
 * Class Admin_Dashboard_Widget_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Dashboard_Widget;

/**
 * Mock Dashboard_Widget for testing.
 */
class Mock_Dashboard_Widget extends Dashboard_Widget {
	/**
	 * Widget ID.
	 *
	 * @var string
	 */
	protected $id = 'test-widget';

	/**
	 * Get the widget title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return 'Test Widget';
	}

	/**
	 * Render the widget content.
	 *
	 * @return void
	 *
	 * phpcs:disable Generic.CodeAnalysis.UselessOverridingMethod.Found -- Required for testing abstract class
	 */
	public function render_widget() {
		echo 'Test widget content';
	}
	// phpcs:enable Generic.CodeAnalysis.UselessOverridingMethod.Found
}

/**
 * Admin_Dashboard_Widget_Test test case.
 */
class Admin_Dashboard_Widget_Test extends \WP_UnitTestCase {

	/**
	 * Dashboard_Widget instance.
	 *
	 * @var Mock_Dashboard_Widget
	 */
	protected $widget;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->widget = new Mock_Dashboard_Widget();
	}

	/**
	 * Test constructor registers hook.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hook() {
		$this->assertEquals( 10, \has_action( 'wp_dashboard_setup', [ $this->widget, 'add_dashboard_widget' ] ) );
	}

	/**
	 * Test get_title returns string.
	 *
	 * @return void
	 */
	public function test_get_title() {
		$reflection = new \ReflectionClass( $this->widget );
		$method     = $reflection->getMethod( 'get_title' );
		$method->setAccessible( true );
		$result = $method->invoke( $this->widget );
		$this->assertEquals( 'Test Widget', $result );
	}

	/**
	 * Test render_widget outputs content.
	 *
	 * @return void
	 */
	public function test_render_widget() {
		\ob_start();
		$this->widget->render_widget();
		$output = \ob_get_clean();
		$this->assertStringContainsString( 'Test widget content', $output );
	}
}
