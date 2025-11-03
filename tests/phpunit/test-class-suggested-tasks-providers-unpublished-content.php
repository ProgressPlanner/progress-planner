<?php
/**
 * Class Suggested_Tasks_Providers_Unpublished_Content_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-4
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Unpublished_Content;

/**
 * Suggested_Tasks_Providers_Unpublished_Content_Test test case.
 *
 * @group suggested-tasks-providers-4
 */
class Suggested_Tasks_Providers_Unpublished_Content_Test extends \WP_UnitTestCase {

	/**
	 * Unpublished_Content instance.
	 *
	 * @var Unpublished_Content
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Unpublished_Content();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'unpublished-content', $this->provider->get_provider_id() );
	}

	/**
	 * Test init registers filter.
	 *
	 * @return void
	 */
	public function test_init_registers_filter() {
		$this->provider->init();
		$this->assertEquals( 10, \has_filter( 'progress_planner_unpublished_content_exclude_post_ids', [ $this->provider, 'exclude_completed_posts' ] ) );
	}

	/**
	 * Test is_task_snoozed returns false.
	 *
	 * @return void
	 */
	public function test_is_task_snoozed() {
		$this->assertFalse( $this->provider->is_task_snoozed() );
	}

	/**
	 * Test exclude_completed_posts returns array.
	 *
	 * @return void
	 */
	public function test_exclude_completed_posts() {
		$result = $this->provider->exclude_completed_posts( [] );
		$this->assertIsArray( $result );
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
	 * Test get_tasks_to_inject returns array.
	 *
	 * @return void
	 */
	public function test_get_tasks_to_inject() {
		$result = $this->provider->get_tasks_to_inject();
		$this->assertIsArray( $result );
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
