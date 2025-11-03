<?php
/**
 * Class Suggested_Tasks_Providers_Sample_Page_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Sample_Page;

/**
 * Suggested_Tasks_Providers_Sample_Page_Test test case.
 */
class Suggested_Tasks_Providers_Sample_Page_Test extends \WP_UnitTestCase {

	/**
	 * Sample_Page instance.
	 *
	 * @var Sample_Page
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Sample_Page();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'sample-page', $this->provider->get_provider_id() );
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
