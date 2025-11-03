<?php
/**
 * Class Suggested_Tasks_Data_Collector_Archive_Format_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Archive_Format;

/**
 * Suggested_Tasks_Data_Collector_Archive_Format_Test test case.
 */
class Suggested_Tasks_Data_Collector_Archive_Format_Test extends \WP_UnitTestCase {

	/**
	 * Archive_Format instance.
	 *
	 * @var Archive_Format
	 */
	protected $collector;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Archive_Format();
	}

	/**
	 * Test init registers hooks.
	 *
	 * @return void
	 */
	public function test_init_registers_hooks() {
		$this->collector->init();
		$this->assertEquals( 10, \has_action( 'transition_post_status', [ $this->collector, 'update_archive_format_cache' ] ) );
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
	 * Test update_archive_format_cache updates on publish.
	 *
	 * @return void
	 */
	public function test_update_cache_on_publish() {
		$post = $this->factory->post->create_and_get();

		$initial = $this->collector->collect();
		$this->collector->update_archive_format_cache( 'publish', 'draft', $post );
		$updated = $this->collector->collect();

		$this->assertIsInt( $updated );
		\wp_delete_post( $post->ID, true );
	}

	/**
	 * Test update_archive_format_cache updates on unpublish.
	 *
	 * @return void
	 */
	public function test_update_cache_on_unpublish() {
		$post = $this->factory->post->create_and_get();

		$this->collector->update_archive_format_cache( 'draft', 'publish', $post );
		$result = $this->collector->collect();

		$this->assertIsInt( $result );
		\wp_delete_post( $post->ID, true );
	}
}
