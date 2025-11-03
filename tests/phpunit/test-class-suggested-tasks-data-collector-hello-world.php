<?php
/**
 * Class Suggested_Tasks_Data_Collector_Hello_World_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Hello_World;

/**
 * Suggested_Tasks_Data_Collector_Hello_World_Test test case.
 */
class Suggested_Tasks_Data_Collector_Hello_World_Test extends \WP_UnitTestCase {

	/**
	 * Hello_World instance.
	 *
	 * @var Hello_World
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Hello_World();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'transition_post_status', [ $this->collector, 'update_hello_world_post_cache' ] ) );
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

	/**
	 * Test update_hello_world_post_cache on status change.
	 *
	 * @return void
	 */
	public function test_update_cache_on_status_change() {
		$post = $this->factory->post->create_and_get( [ 'post_status' => 'draft' ] );

		$this->collector->update_hello_world_post_cache( 'publish', 'draft', $post );
		$result = $this->collector->collect();

		$this->assertIsInt( $result );
		\wp_delete_post( $post->ID, true );
	}

	/**
	 * Test update ignores same status.
	 *
	 * @return void
	 */
	public function test_update_ignores_same_status() {
		$post = $this->factory->post->create_and_get();

		$initial = $this->collector->collect();
		$this->collector->update_hello_world_post_cache( 'publish', 'publish', $post );
		$after = $this->collector->collect();

		$this->assertEquals( $initial, $after );
		\wp_delete_post( $post->ID, true );
	}
}
