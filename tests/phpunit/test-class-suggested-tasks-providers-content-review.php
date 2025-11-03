<?php
/**
 * Class Suggested_Tasks_Providers_Content_Review_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-1
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Content_Review;

/**
 * Suggested_Tasks_Providers_Content_Review_Test test case.
 *
 * @group suggested-tasks-providers-1
 */
class Suggested_Tasks_Providers_Content_Review_Test extends \WP_UnitTestCase {

	/**
	 * Content_Review instance.
	 *
	 * @var Content_Review
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Content_Review();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'review-post', $this->provider->get_provider_id() );
	}

	/**
	 * Test init registers filter.
	 *
	 * @return void
	 */
	public function test_init_registers_filter() {
		$this->provider->init();
		$this->assertEquals( 10, \has_filter( 'progress_planner_update_posts_tasks_args', [ $this->provider, 'filter_update_posts_args' ] ) );
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
	 * Test filter_update_posts_args modifies args.
	 *
	 * @return void
	 */
	public function test_filter_update_posts_args() {
		$args   = [ 'post_type' => 'post' ];
		$result = $this->provider->filter_update_posts_args( $args );
		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'post__not_in', $result );
	}

	/**
	 * Test get_old_posts returns array.
	 *
	 * @return void
	 */
	public function test_get_old_posts() {
		$result = $this->provider->get_old_posts();
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
}
