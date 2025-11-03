<?php
/**
 * Class Suggested_Tasks_Providers_Php_Version_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Php_Version;

/**
 * Suggested_Tasks_Providers_Php_Version_Test test case.
 */
class Suggested_Tasks_Providers_Php_Version_Test extends \WP_UnitTestCase {

	/**
	 * Php_Version instance.
	 *
	 * @var Php_Version
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Php_Version();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'php-version', $this->provider->get_provider_id() );
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
