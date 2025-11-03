<?php
/**
 * Class Suggested_Tasks_Data_Collector_Post_Tag_Count_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Tag_Count;

/**
 * Suggested_Tasks_Data_Collector_Post_Tag_Count_Test test case.
 */
class Suggested_Tasks_Data_Collector_Post_Tag_Count_Test extends \WP_UnitTestCase {

	/**
	 * Post_Tag_Count instance.
	 *
	 * @var Post_Tag_Count
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Post_Tag_Count();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'created_post_tag', [ $this->collector, 'update_cache' ] ) );
		$this->assertEquals( 10, \has_action( 'delete_post_tag', [ $this->collector, 'update_cache' ] ) );
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
