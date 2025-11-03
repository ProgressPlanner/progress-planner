<?php
/**
 * Class Suggested_Tasks_Providers_Select_Locale_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Select_Locale;

/**
 * Suggested_Tasks_Providers_Select_Locale_Test test case.
 */
class Suggested_Tasks_Providers_Select_Locale_Test extends \WP_UnitTestCase {

	/**
	 * Select_Locale instance.
	 *
	 * @var Select_Locale
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Select_Locale();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'select-locale', $this->provider->get_provider_id() );
	}

	/**
	 * Test init registers AJAX action.
	 *
	 * @return void
	 */
	public function test_init_registers_ajax_action() {
		$this->provider->init();
		$this->assertEquals( 10, \has_action( 'wp_ajax_prpl_interactive_task_submit_select-locale', [ $this->provider, 'handle_interactive_task_specific_submit' ] ) );
	}

	/**
	 * Test should_add_task returns boolean.
	 *
	 * @return void
	 */
	public function test_should_add_task() {
		$result = $this->provider->should_add_task();
		$this->assertIsBool( $result );
	}

	/**
	 * Test is_task_completed returns boolean.
	 *
	 * @return void
	 */
	public function test_is_task_completed() {
		$result = $this->provider->is_task_completed();
		$this->assertIsBool( $result );
	}

	/**
	 * Test get_link_setting returns array.
	 *
	 * @return void
	 */
	public function test_get_link_setting() {
		$result = $this->provider->get_link_setting();
		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'hook', $result );
		$this->assertArrayHasKey( 'iconEl', $result );
	}
}
