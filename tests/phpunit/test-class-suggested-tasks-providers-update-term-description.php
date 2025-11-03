<?php
/**
 * Class Suggested_Tasks_Providers_Update_Term_Description_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Update_Term_Description;

/**
 * Suggested_Tasks_Providers_Update_Term_Description_Test test case.
 */
class Suggested_Tasks_Providers_Update_Term_Description_Test extends \WP_UnitTestCase {

	/**
	 * Update_Term_Description instance.
	 *
	 * @var Update_Term_Description
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Update_Term_Description();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'update-term-description', $this->provider->get_provider_id() );
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
