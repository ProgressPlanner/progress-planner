<?php
/**
 * Class Suggested_Tasks_Providers_Disable_Comment_Pagination_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Disable_Comment_Pagination;

/**
 * Suggested_Tasks_Providers_Disable_Comment_Pagination_Test test case.
 */
class Suggested_Tasks_Providers_Disable_Comment_Pagination_Test extends \WP_UnitTestCase {

	/**
	 * Disable_Comment_Pagination instance.
	 *
	 * @var Disable_Comment_Pagination
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Disable_Comment_Pagination();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'disable-comment-pagination', $this->provider->get_provider_id() );
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
