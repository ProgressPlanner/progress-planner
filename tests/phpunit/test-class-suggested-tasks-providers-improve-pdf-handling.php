<?php
/**
 * Class Suggested_Tasks_Providers_Improve_Pdf_Handling_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Improve_Pdf_Handling;

/**
 * Suggested_Tasks_Providers_Improve_Pdf_Handling_Test test case.
 */
class Suggested_Tasks_Providers_Improve_Pdf_Handling_Test extends \WP_UnitTestCase {

	/**
	 * Improve_Pdf_Handling instance.
	 *
	 * @var Improve_Pdf_Handling
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Improve_Pdf_Handling();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'improve-pdf-handling', $this->provider->get_provider_id() );
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
