<?php
/**
 * Class Suggested_Tasks_Providers_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Tasks;

/**
 * Mock Tasks class for testing.
 */
class Mock_Tasks_Provider extends Tasks {

	protected const PROVIDER_ID = 'test-provider';

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 *
	 * phpcs:disable Generic.CodeAnalysis.UselessOverridingMethod.Found -- Required for testing abstract class
	 */
	public function should_add_task() {
		return true;
	}
	// phpcs:enable Generic.CodeAnalysis.UselessOverridingMethod.Found
}

/**
 * Suggested_Tasks_Providers_Tasks_Test test case.
 */
class Suggested_Tasks_Providers_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Tasks instance.
	 *
	 * @var Mock_Tasks_Provider
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Mock_Tasks_Provider();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'test-provider', $this->provider->get_provider_id() );
	}

	/**
	 * Test should_add_task returns boolean.
	 *
	 * @return void
	 */
	public function test_should_add_task() {
		$result = $this->provider->should_add_task();
		$this->assertTrue( $result );
	}

	/**
	 * Test get_tasks_to_inject returns array.
	 *
	 * @return void
	 */
	public function test_get_tasks_to_inject() {
		$result = $this->provider->get_tasks_to_inject();
		$this->assertIsArray( $result );
	}
}
