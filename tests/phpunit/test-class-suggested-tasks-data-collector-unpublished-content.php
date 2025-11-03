<?php
/**
 * Class Suggested_Tasks_Data_Collector_Unpublished_Content_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Unpublished_Content;

/**
 * Suggested_Tasks_Data_Collector_Unpublished_Content_Test test case.
 */
class Suggested_Tasks_Data_Collector_Unpublished_Content_Test extends \WP_UnitTestCase {

	/**
	 * Unpublished_Content instance.
	 *
	 * @var Unpublished_Content
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Unpublished_Content();
	}

	/**
	 * Test collect returns array or null.
	 *
	 * @return void
	 */
	public function test_collect_returns_array_or_null() {
		$result = $this->collector->collect();
		$this->assertTrue( \is_array( $result ) || \is_null( $result ) );
	}
}
