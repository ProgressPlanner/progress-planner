<?php
/**
 * Class Suggested_Tasks_Providers_Set_Valuable_Post_Types_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Set_Valuable_Post_Types;

/**
 * Suggested_Tasks_Providers_Set_Valuable_Post_Types_Test test case.
 */
class Suggested_Tasks_Providers_Set_Valuable_Post_Types_Test extends \WP_UnitTestCase {

	/**
	 * Set_Valuable_Post_Types instance.
	 *
	 * @var Set_Valuable_Post_Types
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Set_Valuable_Post_Types();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'set-valuable-post-types', $this->provider->get_provider_id() );
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
