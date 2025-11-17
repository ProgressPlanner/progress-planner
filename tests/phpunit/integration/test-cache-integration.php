<?php
/**
 * Cache Integration Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Cache integration test case.
 */
class Cache_Integration_Test extends Integration_Test_Case {

	/**
	 * Test cache operations with WordPress transients.
	 *
	 * @return void
	 */
	public function test_cache_operations_with_transients() {
		$cache = \progress_planner()->get_utils__cache();

		// Set cache value.
		$cache->set( 'test-key', 'test-value', HOUR_IN_SECONDS );

		// Verify transient exists in database.
		$transient_name = 'progress_planner_test-key';
		$transient       = \get_transient( $transient_name );
		$this->assertEquals( 'test-value', $transient );

		// Get cache value.
		$retrieved = $cache->get( 'test-key' );
		$this->assertEquals( 'test-value', $retrieved );

		// Delete cache value.
		$cache->delete( 'test-key' );
		\wp_cache_flush(); // Flush WordPress cache.

		$retrieved = $cache->get( 'test-key' );
		$this->assertFalse( $retrieved );
	}

	/**
	 * Test cache expiration works correctly.
	 *
	 * @return void
	 */
	public function test_cache_expiration() {
		$cache = \progress_planner()->get_utils__cache();

		// Set cache with short expiration.
		$cache->set( 'expiring-key', 'expiring-value', 1 );

		// Should exist immediately.
		$this->assertEquals( 'expiring-value', $cache->get( 'expiring-key' ) );

		// Wait for expiration (in real scenario, but in tests we can verify the transient timeout is set).
		$transient_name = 'progress_planner_expiring-key';
		$timeout        = \get_option( '_transient_timeout_' . $transient_name );
		$this->assertNotFalse( $timeout );
		$this->assertGreaterThan( \time(), $timeout );
	}

	/**
	 * Test cache prefix isolation.
	 *
	 * @return void
	 */
	public function test_cache_prefix_isolation() {
		$cache = \progress_planner()->get_utils__cache();

		// Set cache with our prefix.
		$cache->set( 'our-key', 'our-value' );

		// Set transient without our prefix.
		\set_transient( 'other_transient', 'other-value', HOUR_IN_SECONDS );

		// Delete all our cache.
		$cache->delete_all();
		\wp_cache_flush();

		// Our cache should be gone.
		$this->assertFalse( $cache->get( 'our-key' ) );

		// Other transient should still exist.
		$this->assertEquals( 'other-value', \get_transient( 'other_transient' ) );
	}

	/**
	 * Test cache delete_all removes all prefixed transients.
	 *
	 * @return void
	 */
	public function test_cache_delete_all() {
		$cache = \progress_planner()->get_utils__cache();

		// Set multiple cache values.
		$cache->set( 'key-1', 'value-1' );
		$cache->set( 'key-2', 'value-2' );
		$cache->set( 'key-3', 'value-3' );

		// Verify they exist.
		$this->assertEquals( 'value-1', $cache->get( 'key-1' ) );
		$this->assertEquals( 'value-2', $cache->get( 'key-2' ) );
		$this->assertEquals( 'value-3', $cache->get( 'key-3' ) );

		// Delete all.
		$cache->delete_all();
		\wp_cache_flush();

		// Verify they're all gone.
		$this->assertFalse( $cache->get( 'key-1' ) );
		$this->assertFalse( $cache->get( 'key-2' ) );
		$this->assertFalse( $cache->get( 'key-3' ) );
	}
}

