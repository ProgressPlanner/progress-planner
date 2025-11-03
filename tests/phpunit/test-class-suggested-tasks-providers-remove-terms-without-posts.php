<?php
/**
 * Class Suggested_Tasks_Providers_Remove_Terms_Without_Posts_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Remove_Terms_Without_Posts;

/**
 * Suggested_Tasks_Providers_Remove_Terms_Without_Posts_Test test case.
 */
class Suggested_Tasks_Providers_Remove_Terms_Without_Posts_Test extends \WP_UnitTestCase {

	/**
	 * Remove_Terms_Without_Posts instance.
	 *
	 * @var Remove_Terms_Without_Posts
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Remove_Terms_Without_Posts();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'remove-terms-without-posts', $this->provider->get_provider_id() );
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
