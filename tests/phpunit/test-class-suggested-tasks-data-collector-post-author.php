<?php
/**
 * Class Suggested_Tasks_Data_Collector_Post_Author_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 * @group suggested-tasks-data-collectors-1
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Post_Author;

/**
 * Suggested_Tasks_Data_Collector_Post_Author_Test test case.
 */
class Suggested_Tasks_Data_Collector_Post_Author_Test extends \WP_UnitTestCase {

	/**
	 * Post_Author instance.
	 *
	 * @var Post_Author
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Post_Author();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'post_updated', [ $this->collector, 'update_post_author_on_change' ] ) );
		$this->assertEquals( 10, \has_action( 'transition_post_status', [ $this->collector, 'update_post_author_cache' ] ) );
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
