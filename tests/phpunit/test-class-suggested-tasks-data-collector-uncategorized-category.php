<?php
/**
 * Class Suggested_Tasks_Data_Collector_Uncategorized_Category_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-data-collectors-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Uncategorized_Category;

/**
 * Suggested_Tasks_Data_Collector_Uncategorized_Category_Test test case.
 *
 * @group suggested-tasks-data-collectors-2
 */
class Suggested_Tasks_Data_Collector_Uncategorized_Category_Test extends \WP_UnitTestCase {

	/**
	 * Uncategorized_Category instance.
	 *
	 * @var Uncategorized_Category
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Uncategorized_Category();
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
