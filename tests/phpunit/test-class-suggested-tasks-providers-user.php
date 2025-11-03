<?php
/**
 * Class Suggested_Tasks_Providers_User_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\User;

/**
 * Suggested_Tasks_Providers_User_Test test case.
 */
class Suggested_Tasks_Providers_User_Test extends \WP_UnitTestCase {

	/**
	 * User instance.
	 *
	 * @var User
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new User();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'user', $this->provider->get_provider_id() );
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
	 * Test add_task_actions adds edit action.
	 *
	 * @return void
	 */
	public function test_add_task_actions() {
		$actions = $this->provider->add_task_actions( [], [] );
		$this->assertIsArray( $actions );
		$this->assertNotEmpty( $actions );
		$this->assertArrayHasKey( 'priority', $actions[0] );
		$this->assertArrayHasKey( 'html', $actions[0] );
		$this->assertStringContainsString( 'Edit', $actions[0]['html'] );
	}

	/**
	 * Test constructor registers filter.
	 *
	 * @return void
	 */
	public function test_constructor_registers_filter() {
		$this->assertEquals(
			10,
			\has_filter( 'progress_planner_suggested_tasks_in_rest_format', [ $this->provider, 'modify_task_details_for_user_tasks_rest_format' ] )
		);
	}

	/**
	 * Test modify_task_details_for_user_tasks_rest_format without user provider.
	 *
	 * @return void
	 */
	public function test_modify_task_details_without_user_provider() {
		$tasks  = [ [ 'id' => 1 ] ];
		$args   = [ 'include_provider' => [ 'other' ] ];
		$result = $this->provider->modify_task_details_for_user_tasks_rest_format( $tasks, $args );
		$this->assertEquals( $tasks, $result );
	}
}
