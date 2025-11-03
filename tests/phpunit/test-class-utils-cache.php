<?php
/**
 * Unit tests for Cache utility class.
 *
 * @package Progress_Planner\Tests
 * @group utils
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Utils\Cache;

/**
 * Utils_Cache test case.
 *
 * Tests the Cache utility class that wraps WordPress transients
 * with a prefixed key system for organized cache management.
 *
 * @group utils
 */
class Utils_Cache_Test extends WP_UnitTestCase {

	/**
	 * Cache instance.
	 *
	 * @var Cache
	 */
	private $cache;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->cache = new Cache();
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		$this->cache->delete_all();
		parent::tear_down();
	}

	/**
	 * Test setting and getting a cached value.
	 *
	 * @return void
	 */
	public function test_set_and_get() {
		$key   = 'test_key';
		$value = 'test_value';

		$this->cache->set( $key, $value );
		$result = $this->cache->get( $key );

		$this->assertEquals( $value, $result, 'Cache should return the stored value' );
	}

	/**
	 * Test getting a non-existent cache key returns false.
	 *
	 * @return void
	 */
	public function test_get_nonexistent_key() {
		$result = $this->cache->get( 'nonexistent_key' );
		$this->assertFalse( $result, 'Non-existent cache key should return false' );
	}

	/**
	 * Test deleting a cached value.
	 *
	 * @return void
	 */
	public function test_delete() {
		$key   = 'test_delete_key';
		$value = 'delete_me';

		$this->cache->set( $key, $value );
		$this->assertEquals( $value, $this->cache->get( $key ), 'Value should be cached' );

		$this->cache->delete( $key );
		$this->assertFalse( $this->cache->get( $key ), 'Deleted cache key should return false' );
	}

	/**
	 * Test caching different data types.
	 *
	 * @return void
	 */
	public function test_different_data_types() {
		// Test string.
		$this->cache->set( 'string_key', 'string_value' );
		$this->assertEquals( 'string_value', $this->cache->get( 'string_key' ), 'String should be cached correctly' );

		// Test integer.
		$this->cache->set( 'int_key', 42 );
		$this->assertEquals( 42, $this->cache->get( 'int_key' ), 'Integer should be cached correctly' );

		// Test array.
		$array = [
			'foo' => 'bar',
			'baz' => 123,
		];
		$this->cache->set( 'array_key', $array );
		$this->assertEquals( $array, $this->cache->get( 'array_key' ), 'Array should be cached correctly' );

		// Test object.
		$object       = new \stdClass();
		$object->prop = 'value';
		$this->cache->set( 'object_key', $object );
		$this->assertEquals( $object, $this->cache->get( 'object_key' ), 'Object should be cached correctly' );

		// Test boolean.
		$this->cache->set( 'bool_key', true );
		$this->assertTrue( $this->cache->get( 'bool_key' ), 'Boolean true should be cached correctly' );
	}

	/**
	 * Test cache expiration.
	 *
	 * @return void
	 */
	public function test_cache_expiration() {
		$key   = 'expiring_key';
		$value = 'expiring_value';

		// Set cache with 1 second expiration.
		$this->cache->set( $key, $value, 1 );
		$this->assertEquals( $value, $this->cache->get( $key ), 'Value should be cached initially' );

		// Wait for expiration.
		\sleep( 2 );

		$this->assertFalse( $this->cache->get( $key ), 'Expired cache key should return false' );
	}

	/**
	 * Test deleting all cached values.
	 *
	 * @return void
	 */
	public function test_delete_all() {
		// Set multiple cache entries.
		$this->cache->set( 'key1', 'value1' );
		$this->cache->set( 'key2', 'value2' );
		$this->cache->set( 'key3', 'value3' );

		// Verify they exist.
		$this->assertEquals( 'value1', $this->cache->get( 'key1' ), 'Key1 should be cached' );
		$this->assertEquals( 'value2', $this->cache->get( 'key2' ), 'Key2 should be cached' );
		$this->assertEquals( 'value3', $this->cache->get( 'key3' ), 'Key3 should be cached' );

		// Delete all.
		$this->cache->delete_all();

		// Flush WordPress cache to ensure deleted transients are reflected.
		\wp_cache_flush();

		// Verify they're all gone.
		$this->assertFalse( $this->cache->get( 'key1' ), 'Key1 should be deleted' );
		$this->assertFalse( $this->cache->get( 'key2' ), 'Key2 should be deleted' );
		$this->assertFalse( $this->cache->get( 'key3' ), 'Key3 should be deleted' );
	}

	/**
	 * Test cache prefix isolation.
	 *
	 * @return void
	 */
	public function test_cache_prefix_isolation() {
		$key   = 'test_isolation';
		$value = 'isolated_value';

		// Set using the Cache class.
		$this->cache->set( $key, $value );

		// Try to get directly with WordPress transient (without prefix).
		$direct_result = \get_transient( $key );
		$this->assertFalse( $direct_result, 'Direct transient access without prefix should return false' );

		// Get using the Cache class (with prefix).
		$prefixed_result = $this->cache->get( $key );
		$this->assertEquals( $value, $prefixed_result, 'Cache class should retrieve value with prefix' );

		// Verify the actual transient key used.
		$actual_key    = 'progress_planner_' . $key;
		$direct_result = \get_transient( $actual_key );
		$this->assertEquals( $value, $direct_result, 'Direct transient with full prefix should work' );
	}

	/**
	 * Test overwriting cached values.
	 *
	 * @return void
	 */
	public function test_overwrite_cache() {
		$key = 'overwrite_key';

		$this->cache->set( $key, 'first_value' );
		$this->assertEquals( 'first_value', $this->cache->get( $key ), 'First value should be cached' );

		$this->cache->set( $key, 'second_value' );
		$this->assertEquals( 'second_value', $this->cache->get( $key ), 'Second value should overwrite first' );
	}
}
