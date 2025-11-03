<?php
/**
 * Class Suggested_Tasks_Providers_Site_Icon_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-4
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Site_Icon;

/**
 * Suggested_Tasks_Providers_Site_Icon_Test test case.
 *
 * @group suggested-tasks-providers-4
 */
class Suggested_Tasks_Providers_Site_Icon_Test extends \WP_UnitTestCase {

	/**
	 * Site_Icon instance.
	 *
	 * @var Site_Icon
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Site_Icon();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'core-siteicon', $this->provider->get_provider_id() );
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
