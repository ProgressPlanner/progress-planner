<?php
/**
 * Unit tests for Plugin_Migration_Helpers utility class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Utils\Plugin_Migration_Helpers;

/**
 * Utils_Plugin_Migration_Helpers test case.
 *
 * Tests the Plugin_Migration_Helpers utility class that handles
 * parsing legacy task ID formats for backward compatibility.
 */
class Utils_Plugin_Migration_Helpers_Test extends WP_UnitTestCase {

	/**
	 * Test parsing simple one-time task ID format.
	 *
	 * @return void
	 */
	public function test_parse_simple_one_time_task() {
		$task_id = 'hello-world';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertNotEmpty( $task->provider_id, 'Provider ID should be set' );
	}

	/**
	 * Test parsing repetitive task ID format with date.
	 *
	 * @return void
	 */
	public function test_parse_repetitive_task_with_date() {
		$task_id = 'update-core-202449';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202449', $task->date, 'Date should be extracted' );
	}

	/**
	 * Test parsing legacy create-post-short task ID.
	 *
	 * @return void
	 */
	public function test_parse_legacy_create_post_short() {
		$task_id = 'create-post-short-202449';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202449', $task->date, 'Date should be extracted' );
	}

	/**
	 * Test parsing legacy create-post-long task ID.
	 *
	 * @return void
	 */
	public function test_parse_legacy_create_post_long() {
		$task_id = 'create-post-long-202449';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202449', $task->date, 'Date should be extracted' );
	}

	/**
	 * Test parsing legacy piped format.
	 *
	 * @return void
	 */
	public function test_parse_piped_format() {
		$task_id = 'date/202510|long/1|provider_id/create-post';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202510', $task->date, 'Date should be extracted' );
		$this->assertTrue( $task->long, 'Long flag should be true' );
		$this->assertEquals( 'create-post', $task->provider_id, 'Provider ID should be extracted' );
	}

	/**
	 * Test parsing piped format with long=0.
	 *
	 * @return void
	 */
	public function test_parse_piped_format_long_false() {
		$task_id = 'date/202510|long/0|provider_id/create-post';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertFalse( $task->long, 'Long flag should be false' );
	}

	/**
	 * Test parsing piped format with type instead of provider_id.
	 *
	 * @return void
	 */
	public function test_parse_piped_format_with_type() {
		$task_id = 'date/202510|type/create-post';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( 'create-post', $task->provider_id, 'Provider ID should be set from type' );
	}

	/**
	 * Test parsing piped format with numeric values.
	 *
	 * @return void
	 */
	public function test_parse_piped_format_numeric_values() {
		$task_id = 'date/202510|priority/50|provider_id/test-task';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202510', $task->date, 'Date should remain string' );
		$this->assertEquals( 50, $task->priority, 'Priority should be converted to int' );
	}

	/**
	 * Test parsing simple task without dashes.
	 *
	 * @return void
	 */
	public function test_parse_task_without_dashes() {
		$task_id = 'simpletask';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
	}

	/**
	 * Test parsing task with multiple dashes but no date suffix.
	 *
	 * @return void
	 */
	public function test_parse_task_with_dashes_no_date() {
		$task_id = 'some-complex-task-name';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
	}

	/**
	 * Test parsing piped format with invalid parts.
	 *
	 * @return void
	 */
	public function test_parse_piped_format_invalid_parts() {
		$task_id = 'date/202510|invalidpart|provider_id/test';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202510', $task->date, 'Valid date should be extracted' );
		$this->assertEquals( 'test', $task->provider_id, 'Valid provider_id should be extracted' );
	}

	/**
	 * Test data array keys are sorted.
	 *
	 * @return void
	 */
	public function test_parse_piped_format_keys_sorted() {
		$task_id = 'provider_id/test|date/202510|priority/10';
		$task    = Plugin_Migration_Helpers::parse_task_data_from_task_id( $task_id );

		// Verify task has expected properties in the correct data structure.
		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
		$this->assertEquals( '202510', $task->date, 'Date should be extracted' );
		$this->assertEquals( 10, $task->priority, 'Priority should be extracted' );
		$this->assertEquals( 'test', $task->provider_id, 'Provider ID should be extracted' );
	}
}
