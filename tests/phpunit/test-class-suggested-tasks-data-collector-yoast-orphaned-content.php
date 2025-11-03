<?php
/**
 * Class Suggested_Tasks_Data_Collector_Yoast_Orphaned_Content_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 * @group suggested-tasks-data-collectors-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Yoast_Orphaned_Content;

/**
 * Suggested_Tasks_Data_Collector_Yoast_Orphaned_Content_Test test case.
 */
class Suggested_Tasks_Data_Collector_Yoast_Orphaned_Content_Test extends \WP_UnitTestCase {

	/**
	 * Yoast_Orphaned_Content instance.
	 *
	 * @var Yoast_Orphaned_Content
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Yoast_Orphaned_Content();
	}

	/**
	 * Test collect returns array.
	 *
	 * @return void
	 */
	public function test_collect_returns_array() {
		$result = $this->collector->collect();
		$this->assertIsArray( $result );
	}
}
