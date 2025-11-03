<?php
/**
 * Class Suggested_Tasks_Data_Collector_Sample_Page_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Sample_Page;

/**
 * Suggested_Tasks_Data_Collector_Sample_Page_Test test case.
 */
class Suggested_Tasks_Data_Collector_Sample_Page_Test extends \WP_UnitTestCase {

	/**
	 * Sample_Page instance.
	 *
	 * @var Sample_Page
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Sample_Page();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'transition_post_status', [ $this->collector, 'update_sample_page_cache' ] ) );
	}

	/**
	 * Test collect returns integer.
	 *
	 * @return void
	 */
	public function test_collect_returns_integer() {
		$result = $this->collector->collect();
		$this->assertIsInt( $result );
	}
}
