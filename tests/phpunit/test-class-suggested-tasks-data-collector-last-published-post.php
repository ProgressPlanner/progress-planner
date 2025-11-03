<?php
/**
 * Class Suggested_Tasks_Data_Collector_Last_Published_Post_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post;

/**
 * Suggested_Tasks_Data_Collector_Last_Published_Post_Test test case.
 */
class Suggested_Tasks_Data_Collector_Last_Published_Post_Test extends \WP_UnitTestCase {

	/**
	 * Last_Published_Post instance.
	 *
	 * @var Last_Published_Post
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Last_Published_Post();
		$this->collector->init();
		$this->collector->set_include_post_types();
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

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->assertEquals( 10, \has_action( 'transition_post_status', [ $this->collector, 'update_last_published_post_cache' ] ) );
	}
}
