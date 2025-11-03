<?php
/**
 * Class Suggested_Tasks_Providers_Select_Timezone_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Select_Timezone;

/**
 * Suggested_Tasks_Providers_Select_Timezone_Test test case.
 */
class Suggested_Tasks_Providers_Select_Timezone_Test extends \WP_UnitTestCase {

	/**
	 * Select_Timezone instance.
	 *
	 * @var Select_Timezone
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Select_Timezone();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'select-timezone', $this->provider->get_provider_id() );
	}

	/**
	 * Test init registers AJAX action.
	 *
	 * @return void
	 */
	public function test_init_registers_ajax_action() {
		$this->provider->init();
		$this->assertEquals( 10, \has_action( 'wp_ajax_prpl_interactive_task_submit_select-timezone', [ $this->provider, 'handle_interactive_task_specific_submit' ] ) );
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
