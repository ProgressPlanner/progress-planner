<?php
/**
 * Class Suggested_Tasks_Providers_Integrations_AIOSEO_AIOSEO_Provider_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Integrations\AIOSEO\AIOSEO_Provider;

/**
 * Mock AIOSEO_Provider for testing.
 */
class Mock_AIOSEO_Provider extends AIOSEO_Provider {
	protected const PROVIDER_ID = 'test-aioseo';

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return false;
	}
}

/**
 * Suggested_Tasks_Providers_Integrations_AIOSEO_AIOSEO_Provider_Test test case.
 */
class Suggested_Tasks_Providers_Integrations_AIOSEO_AIOSEO_Provider_Test extends \WP_UnitTestCase {

	/**
	 * AIOSEO_Provider instance.
	 *
	 * @var Mock_AIOSEO_Provider
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Mock_AIOSEO_Provider();
	}

	/**
	 * Test get_provider_id returns string.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$result = $this->provider->get_provider_id();
		$this->assertEquals( 'test-aioseo', $result );
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
