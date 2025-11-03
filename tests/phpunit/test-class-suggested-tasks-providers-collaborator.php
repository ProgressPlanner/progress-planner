<?php
/**
 * Class Suggested_Tasks_Providers_Collaborator_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Collaborator;

/**
 * Suggested_Tasks_Providers_Collaborator_Test test case.
 */
class Suggested_Tasks_Providers_Collaborator_Test extends \WP_UnitTestCase {

	/**
	 * Collaborator instance.
	 *
	 * @var Collaborator
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Collaborator();
	}

	/**
	 * Test should_add_task returns true.
	 *
	 * @return void
	 */
	public function test_should_add_task() {
		$this->assertTrue( $this->provider->should_add_task() );
	}

	/**
	 * Test get_tasks_to_inject returns empty array.
	 *
	 * @return void
	 */
	public function test_get_tasks_to_inject() {
		$result = $this->provider->get_tasks_to_inject();
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_task_details returns array with defaults.
	 *
	 * @return void
	 */
	public function test_get_task_details_with_no_matching_task() {
		$result = $this->provider->get_task_details( [ 'task_id' => 'nonexistent' ] );
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'collaborator', $this->provider->get_provider_id() );
	}
}
