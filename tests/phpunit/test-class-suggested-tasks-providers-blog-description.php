<?php
/**
 * Class Suggested_Tasks_Providers_Blog_Description_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Blog_Description;

/**
 * Suggested_Tasks_Providers_Blog_Description_Test test case.
 */
class Suggested_Tasks_Providers_Blog_Description_Test extends \WP_UnitTestCase {

	/**
	 * Blog_Description instance.
	 *
	 * @var Blog_Description
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Blog_Description();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'core-blogdescription', $this->provider->get_provider_id() );
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
