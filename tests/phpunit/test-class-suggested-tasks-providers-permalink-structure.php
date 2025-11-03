<?php
/**
 * Class Suggested_Tasks_Providers_Permalink_Structure_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Permalink_Structure;

/**
 * Suggested_Tasks_Providers_Permalink_Structure_Test test case.
 *
 * @group suggested-tasks-providers-2
 */
class Suggested_Tasks_Providers_Permalink_Structure_Test extends \WP_UnitTestCase {

	/**
	 * Permalink_Structure instance.
	 *
	 * @var Permalink_Structure
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Permalink_Structure();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'core-permalink-structure', $this->provider->get_provider_id() );
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
