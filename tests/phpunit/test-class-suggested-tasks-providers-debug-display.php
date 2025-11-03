<?php
/**
 * Class Suggested_Tasks_Providers_Debug_Display_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Debug_Display;

/**
 * Suggested_Tasks_Providers_Debug_Display_Test test case.
 */
class Suggested_Tasks_Providers_Debug_Display_Test extends \WP_UnitTestCase {

	/**
	 * Debug_Display instance.
	 *
	 * @var Debug_Display
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Debug_Display();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'wp-debug-display', $this->provider->get_provider_id() );
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
}
