<?php
/**
 * Class Utils_Cache_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Utils\Cache;

/**
 * Cache utility test case.
 */
class Utils_Cache_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Cache
	 */
	private $cache_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->cache_instance = new Cache();
	}

	/**
	 * Test get returns false for non-existent key.
	 *
	 * @return void
	 */
	public function test_get_non_existent() {
		$value = $this->cache_instance->get( 'non-existent-key' );

		$this->assertFalse( $value );
	}

	/**
	 * Test set and get operations.
	 *
	 * @return void
	 */
	public function test_set_get() {
		$key   = 'test-key';
		$value = 'test-value';

		$this->cache_instance->set( $key, $value );

		$retrieved = $this->cache_instance->get( $key );

		$this->assertEquals( $value, $retrieved );
	}

	/**
	 * Test set with custom expiration.
	 *
	 * @return void
	 */
	public function test_set_custom_expiration() {
		$key   = 'test-key-expiration';
		$value = 'test-value';

		$this->cache_instance->set( $key, $value, HOUR_IN_SECONDS );

		$retrieved = $this->cache_instance->get( $key );

		$this->assertEquals( $value, $retrieved );
	}

	/**
	 * Test delete removes cached value.
	 *
	 * @return void
	 */
	public function test_delete() {
		$key   = 'test-key-delete';
		$value = 'test-value';

		$this->cache_instance->set( $key, $value );
		$this->cache_instance->delete( $key );

		$retrieved = $this->cache_instance->get( $key );

		$this->assertFalse( $retrieved );
	}

	/**
	 * Test delete_all removes all cached values.
	 *
	 * @return void
	 */
	public function test_delete_all() {
		// Set multiple cache values.
		$this->cache_instance->set( 'key-1', 'value-1' );
		$this->cache_instance->set( 'key-2', 'value-2' );
		$this->cache_instance->set( 'key-3', 'value-3' );

		// Verify they exist.
		$this->assertEquals( 'value-1', $this->cache_instance->get( 'key-1' ) );
		$this->assertEquals( 'value-2', $this->cache_instance->get( 'key-2' ) );
		$this->assertEquals( 'value-3', $this->cache_instance->get( 'key-3' ) );

		// Delete all.
		$this->cache_instance->delete_all();

		// Flush WordPress cache to ensure transients are cleared.
		\wp_cache_flush();

		// Verify they're all gone.
		$this->assertFalse( $this->cache_instance->get( 'key-1' ) );
		$this->assertFalse( $this->cache_instance->get( 'key-2' ) );
		$this->assertFalse( $this->cache_instance->get( 'key-3' ) );
	}

	/**
	 * Test cache prefix is applied.
	 *
	 * @return void
	 */
	public function test_cache_prefix() {
		$key   = 'test-prefix';
		$value = 'test-value';

		$this->cache_instance->set( $key, $value );

		// Verify transient exists with prefix.
		$transient_name = Cache::CACHE_PREFIX . $key;
		$transient      = \get_transient( $transient_name );

		$this->assertEquals( $value, $transient );
	}

	/**
	 * Test get with array value.
	 *
	 * @return void
	 */
	public function test_get_array_value() {
		$key   = 'test-array';
		$value = [ 'foo' => 'bar', 'baz' => 123 ];

		$this->cache_instance->set( $key, $value );

		$retrieved = $this->cache_instance->get( $key );

		$this->assertEquals( $value, $retrieved );
		$this->assertIsArray( $retrieved );
	}

	/**
	 * Test get with object value.
	 *
	 * @return void
	 */
	public function test_get_object_value() {
		$key   = 'test-object';
		$value = (object) [ 'foo' => 'bar' ];

		$this->cache_instance->set( $key, $value );

		$retrieved = $this->cache_instance->get( $key );

		$this->assertEquals( $value, $retrieved );
		$this->assertIsObject( $retrieved );
	}

	/**
	 * Test delete_all does not affect other transients.
	 *
	 * @return void
	 */
	public function test_delete_all_isolates_prefix() {
		// Set a cache value with our prefix.
		$this->cache_instance->set( 'our-key', 'our-value' );

		// Set a transient without our prefix.
		\set_transient( 'other_transient', 'other-value', HOUR_IN_SECONDS );

		// Delete all our cache.
		$this->cache_instance->delete_all();

		// Flush WordPress cache to ensure transients are cleared.
		\wp_cache_flush();

		// Our cache should be gone.
		$this->assertFalse( $this->cache_instance->get( 'our-key' ) );

		// Other transient should still exist.
		$this->assertEquals( 'other-value', \get_transient( 'other_transient' ) );
	}

	/**
	 * Clean up after tests.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up any cache values we created.
		$this->cache_instance->delete_all();

		parent::tearDown();
	}
}

