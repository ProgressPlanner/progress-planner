<?php
/**
 * Class Admin_Page_Test
 *
 * @package Progress_Planner\Tests
 * @group admin
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Page;

/**
 * Admin_Page_Test test case.
 *
 * @group admin
 */
class Admin_Page_Test extends \WP_UnitTestCase {

	/**
	 * Page instance.
	 *
	 * @var Page
	 */
	protected $page;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->page = new Page();
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, \has_action( 'admin_menu', [ $this->page, 'add_page' ] ) );
		$this->assertEquals( 10, \has_action( 'admin_enqueue_scripts', [ $this->page, 'enqueue_assets' ] ) );
		$this->assertEquals( PHP_INT_MAX, \has_action( 'in_admin_header', [ $this->page, 'remove_admin_notices' ] ) );
		$this->assertEquals( 10, \has_action( 'admin_footer', [ $this->page, 'admin_footer' ] ) );
	}

	/**
	 * Test get_widgets returns array.
	 *
	 * @return void
	 */
	public function test_get_widgets() {
		$widgets = $this->page->get_widgets();
		$this->assertIsArray( $widgets );
		$this->assertNotEmpty( $widgets );
	}

	/**
	 * Test get_widget returns widget object.
	 *
	 * @return void
	 */
	public function test_get_widget() {
		$widgets = $this->page->get_widgets();
		if ( ! empty( $widgets ) ) {
			$first_widget = $widgets[0];
			$widget_id    = $first_widget->get_id();
			$result       = $this->page->get_widget( $widget_id );
			$this->assertNotNull( $result );
			$this->assertEquals( $widget_id, $result->get_id() );
		} else {
			$this->markTestSkipped( 'No widgets available' );
		}
	}

	/**
	 * Test get_widget returns null for invalid ID.
	 *
	 * @return void
	 */
	public function test_get_widget_invalid_id() {
		$result = $this->page->get_widget( 'nonexistent-widget' );
		$this->assertNull( $result );
	}
}
