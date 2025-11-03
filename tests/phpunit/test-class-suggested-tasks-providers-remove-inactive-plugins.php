<?php
/**
 * Class Suggested_Tasks_Providers_Remove_Inactive_Plugins_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Remove_Inactive_Plugins;

/**
 * Suggested_Tasks_Providers_Remove_Inactive_Plugins_Test test case.
 */
class Suggested_Tasks_Providers_Remove_Inactive_Plugins_Test extends \WP_UnitTestCase {

	/**
	 * Remove_Inactive_Plugins instance.
	 *
	 * @var Remove_Inactive_Plugins
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Remove_Inactive_Plugins();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'remove-inactive-plugins', $this->provider->get_provider_id() );
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
