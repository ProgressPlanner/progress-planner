<?php
/**
 * Class Suggested_Tasks_Data_Collector_Published_Post_Count_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-data-collectors-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Published_Post_Count;

/**
 * Suggested_Tasks_Data_Collector_Published_Post_Count_Test test case.
 *
 * @group suggested-tasks-data-collectors-2
 */
class Suggested_Tasks_Data_Collector_Published_Post_Count_Test extends \WP_UnitTestCase {

	/**
	 * Published_Post_Count instance.
	 *
	 * @var Published_Post_Count
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Published_Post_Count();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'transition_post_status', [ $this->collector, 'maybe_update_published_post_count_cache' ] ) );
		$this->assertEquals( 10, \has_action( 'delete_post', [ $this->collector, 'update_cache' ] ) );
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
