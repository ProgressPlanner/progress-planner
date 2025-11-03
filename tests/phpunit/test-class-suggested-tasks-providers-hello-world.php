<?php
/**
 * Class Suggested_Tasks_Providers_Hello_World_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Hello_World;

/**
 * Suggested_Tasks_Providers_Hello_World_Test test case.
 *
 * @group suggested-tasks-providers-2
 */
class Suggested_Tasks_Providers_Hello_World_Test extends \WP_UnitTestCase {

	/**
	 * Hello_World instance.
	 *
	 * @var Hello_World
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Hello_World();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'hello-world', $this->provider->get_provider_id() );
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
	 * Test add_task_actions returns array.
	 *
	 * @return void
	 */
	public function test_add_task_actions() {
		$result = $this->provider->add_task_actions( [], [] );
		$this->assertIsArray( $result );
	}
}
