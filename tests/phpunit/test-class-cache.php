<?php
/**
 * Tests for the Cache utility class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Utils\Cache;
use WP_UnitTestCase;

/**
 * Test the Cache utility class.
 */
class Test_Cache extends WP_UnitTestCase {

	/**
	 * The Cache instance.
	 *
	 * @var Cache
	 */
	private $cache;

	/**
	 * Set up before each test.
	 */
	public function set_up() {
		parent::set_up();
		$this->cache = new Cache();
		$this->cache->delete_all();
	}

	/**
	 * Tear down after each test.
	 */
	public function tear_down() {
		$this->cache->delete_all();
		parent::tear_down();
	}

	/**
	 * Test setting and getting a cached value.
	 */
	public function test_set_and_get() {
		$key   = 'test_key';
		$value = 'test_value';

		$this->cache->set( $key, $value );
		$result = $this->cache->get( $key );

		$this->assertEquals( $value, $result );
	}

	/**
	 * Test setting and getting an array value.
	 */
	public function test_set_and_get_array() {
		$key   = 'test_array';
		$value = [
			'foo' => 'bar',
			'baz' => 'qux',
		];

		$this->cache->set( $key, $value );
		$result = $this->cache->get( $key );

		$this->assertEquals( $value, $result );
	}

	/**
	 * Test setting and getting an object value.
	 */
	public function test_set_and_get_object() {
		$key   = 'test_object';
		$value = (object) [
			'foo' => 'bar',
			'baz' => 'qux',
		];

		$this->cache->set( $key, $value );
		$result = $this->cache->get( $key );

		$this->assertEquals( $value, $result );
	}

	/**
	 * Test getting a non-existent key returns false.
	 */
	public function test_get_nonexistent_key() {
		$result = $this->cache->get( 'nonexistent_key' );
		$this->assertFalse( $result );
	}

	/**
	 * Test deleting a cached value.
	 */
	public function test_delete() {
		$key   = 'delete_test';
		$value = 'test_value';

		$this->cache->set( $key, $value );
		$this->assertEquals( $value, $this->cache->get( $key ) );

		$this->cache->delete( $key );
		$this->assertFalse( $this->cache->get( $key ) );
	}

	/**
	 * Test deleting all cached values.
	 */
	public function test_delete_all() {
		// Set multiple cache entries.
		$this->cache->set( 'key1', 'value1' );
		$this->cache->set( 'key2', 'value2' );
		$this->cache->set( 'key3', 'value3' );

		// Verify they exist.
		$this->assertEquals( 'value1', $this->cache->get( 'key1' ) );
		$this->assertEquals( 'value2', $this->cache->get( 'key2' ) );
		$this->assertEquals( 'value3', $this->cache->get( 'key3' ) );

		// Delete all.
		$this->cache->delete_all();

		// Clear WordPress object cache to force DB lookup.
		wp_cache_flush();

		// Verify they're gone.
		$this->assertFalse( $this->cache->get( 'key1' ) );
		$this->assertFalse( $this->cache->get( 'key2' ) );
		$this->assertFalse( $this->cache->get( 'key3' ) );
	}

	/**
	 * Test cache expiration.
	 */
	public function test_cache_expiration() {
		$key   = 'expiration_test';
		$value = 'test_value';

		// Set cache with 1 second expiration.
		$this->cache->set( $key, $value, 1 );

		// Immediately after, it should exist.
		$this->assertEquals( $value, $this->cache->get( $key ) );

		// Wait 2 seconds.
		sleep( 2 );

		// Now it should be expired.
		$this->assertFalse( $this->cache->get( $key ) );
	}

	/**
	 * Test cache prefix is applied correctly.
	 */
	public function test_cache_prefix() {
		$key   = 'prefix_test';
		$value = 'test_value';

		$this->cache->set( $key, $value );

		// The actual transient name should have the prefix.
		$prefixed_key = Cache::CACHE_PREFIX . $key;
		$result       = get_transient( $prefixed_key );

		$this->assertEquals( $value, $result );
	}

	/**
	 * Test delete_all only deletes Progress Planner transients.
	 */
	public function test_delete_all_scoped() {
		// Set a Progress Planner cache entry.
		$this->cache->set( 'pp_key', 'pp_value' );

		// Set a non-Progress Planner transient.
		set_transient( 'other_plugin_key', 'other_value' );

		// Verify both exist.
		$this->assertEquals( 'pp_value', $this->cache->get( 'pp_key' ) );
		$this->assertEquals( 'other_value', get_transient( 'other_plugin_key' ) );

		// Delete all Progress Planner caches.
		$this->cache->delete_all();

		// Clear WordPress object cache to force DB lookup.
		wp_cache_flush();

		// Progress Planner cache should be gone.
		$this->assertFalse( $this->cache->get( 'pp_key' ) );

		// Other transient should still exist.
		$this->assertEquals( 'other_value', get_transient( 'other_plugin_key' ) );

		// Clean up.
		delete_transient( 'other_plugin_key' );
	}

	/**
	 * Test setting cache with custom expiration.
	 */
	public function test_custom_expiration() {
		$key        = 'custom_exp';
		$value      = 'test_value';
		$expiration = DAY_IN_SECONDS;

		$this->cache->set( $key, $value, $expiration );

		// Verify it exists.
		$this->assertEquals( $value, $this->cache->get( $key ) );

		// Verify the timeout is set correctly.
		$timeout = get_option( '_transient_timeout_' . Cache::CACHE_PREFIX . $key );
		$this->assertGreaterThan( time(), $timeout );
		$this->assertLessThanOrEqual( time() + $expiration + 10, $timeout ); // Allow 10 second buffer.
	}

	/**
	 * Test overwriting an existing cache value.
	 */
	public function test_overwrite_cache() {
		$key = 'overwrite_test';

		$this->cache->set( $key, 'value1' );
		$this->assertEquals( 'value1', $this->cache->get( $key ) );

		$this->cache->set( $key, 'value2' );
		$this->assertEquals( 'value2', $this->cache->get( $key ) );
	}

	/**
	 * Test caching boolean values.
	 */
	public function test_cache_boolean_values() {
		$this->cache->set( 'bool_true', true );

		$this->assertTrue( $this->cache->get( 'bool_true' ) );

		// Note: Storing `false` in transients is problematic because get_transient
		// returns false for both "not found" and "stored false value".
		// This is a known WordPress limitation, not a bug in the Cache class.
	}

	/**
	 * Test caching numeric values.
	 */
	public function test_cache_numeric_values() {
		$this->cache->set( 'int_val', 42 );
		$this->cache->set( 'float_val', 3.14 );
		$this->cache->set( 'zero', 0 );

		$this->assertEquals( 42, $this->cache->get( 'int_val' ) );
		$this->assertEquals( 3.14, $this->cache->get( 'float_val' ) );
		$this->assertEquals( 0, $this->cache->get( 'zero' ) );
	}
}
