<?php
/**
 * Class Rest_Base_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Base;

/**
 * Rest_Base_Test test case.
 */
class Rest_Base_Test extends \WP_UnitTestCase {

	/**
	 * Mock implementation of the abstract Base class for testing.
	 *
	 * @var MockRestBase
	 */
	protected $rest_base;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// Create a mock implementation of the abstract class.
		$this->rest_base = new class() extends Base {
			/**
			 * Register REST endpoint implementation.
			 *
			 * @return void
			 */
			public function register_rest_endpoint() {
				// Mock implementation - does nothing.
			}
		};
	}

	/**
	 * Cleanup after test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		parent::tearDown();

		// Clear any rate limiting transients.
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- Direct cleanup needed for test isolation, transients don't use cache
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_prpl_api_rate_limit_%'" );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery -- Direct cleanup needed for test isolation, transients don't use cache
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_prpl_api_rate_limit_%'" );

		\delete_option( 'progress_planner_license_key' );
		\delete_option( 'progress_planner_test_token' );
	}

	/**
	 * Test get_client_ip with direct connection.
	 *
	 * @return void
	 */
	public function test_get_client_ip_direct() {
		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		// Use reflection to access protected method.
		$reflection = new \ReflectionClass( $this->rest_base );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_base );

		$this->assertEquals( '192.168.1.1', $ip );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test get_client_ip with Cloudflare header.
	 *
	 * @return void
	 */
	public function test_get_client_ip_cloudflare() {
		$_SERVER['HTTP_CF_CONNECTING_IP'] = '203.0.113.1';
		$_SERVER['REMOTE_ADDR']           = '192.168.1.1';

		$reflection = new \ReflectionClass( $this->rest_base );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_base );

		$this->assertEquals( '203.0.113.1', $ip );

		unset( $_SERVER['HTTP_CF_CONNECTING_IP'], $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test get_client_ip with X-Forwarded-For header containing multiple IPs.
	 *
	 * @return void
	 */
	public function test_get_client_ip_x_forwarded_for_multiple() {
		$_SERVER['HTTP_X_FORWARDED_FOR'] = '203.0.113.1, 198.51.100.1, 192.168.1.1';

		$reflection = new \ReflectionClass( $this->rest_base );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_base );

		// Should return the first IP in the list.
		$this->assertEquals( '203.0.113.1', $ip );

		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
	}

	/**
	 * Test get_client_ip with invalid IP falls back to default.
	 *
	 * @return void
	 */
	public function test_get_client_ip_invalid() {
		$_SERVER['REMOTE_ADDR'] = 'invalid-ip';

		$reflection = new \ReflectionClass( $this->rest_base );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_base );

		$this->assertEquals( '0.0.0.0', $ip );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test get_client_ip with no server variables returns default.
	 *
	 * @return void
	 */
	public function test_get_client_ip_no_server_vars() {
		// Make sure no IP headers are set.
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'], $_SERVER['HTTP_X_REAL_IP'], $_SERVER['HTTP_X_FORWARDED_FOR'], $_SERVER['REMOTE_ADDR'] );

		$reflection = new \ReflectionClass( $this->rest_base );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_base );

		$this->assertEquals( '0.0.0.0', $ip );
	}

	/**
	 * Test validate_token with valid license key.
	 *
	 * @return void
	 */
	public function test_validate_token_with_valid_license() {
		$license_key = 'valid-license-key-123';
		\update_option( 'progress_planner_license_key', $license_key );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$result = $this->rest_base->validate_token( $license_key );

		$this->assertTrue( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token with invalid license key.
	 *
	 * @return void
	 */
	public function test_validate_token_with_invalid_license() {
		\update_option( 'progress_planner_license_key', 'correct-key' );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$result = $this->rest_base->validate_token( 'wrong-key' );

		$this->assertFalse( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token with valid test token.
	 *
	 * @return void
	 */
	public function test_validate_token_with_test_token() {
		$test_token = 'test-token-456';
		\update_option( 'progress_planner_test_token', $test_token );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$result = $this->rest_base->validate_token( $test_token );

		$this->assertTrue( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token with test token takes precedence over license key.
	 *
	 * @return void
	 */
	public function test_validate_token_test_token_precedence() {
		$test_token  = 'test-token-789';
		$license_key = 'license-key-789';

		\update_option( 'progress_planner_test_token', $test_token );
		\update_option( 'progress_planner_license_key', $license_key );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		// Test token should work.
		$result = $this->rest_base->validate_token( $test_token );
		$this->assertTrue( $result );

		// License key should also work.
		$result = $this->rest_base->validate_token( $license_key );
		$this->assertTrue( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token with no license key.
	 *
	 * @return void
	 */
	public function test_validate_token_no_license() {
		\update_option( 'progress_planner_license_key', 'no-license' );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$result = $this->rest_base->validate_token( 'any-token' );

		$this->assertFalse( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token strips token/ prefix.
	 *
	 * @return void
	 */
	public function test_validate_token_strips_prefix() {
		$license_key = 'my-license-key';
		\update_option( 'progress_planner_license_key', $license_key );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		$result = $this->rest_base->validate_token( 'token/' . $license_key );

		$this->assertTrue( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token rate limiting after multiple failed attempts.
	 *
	 * @return void
	 */
	public function test_validate_token_rate_limiting() {
		\update_option( 'progress_planner_license_key', 'correct-key' );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		// Make 10 failed attempts.
		for ( $i = 0; $i < 10; $i++ ) {
			$this->rest_base->validate_token( 'wrong-key-' . $i );
		}

		// 11th attempt should be blocked even with correct key.
		$result = $this->rest_base->validate_token( 'correct-key' );

		$this->assertFalse( $result );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test validate_token clears rate limit on successful authentication.
	 *
	 * @return void
	 */
	public function test_validate_token_clears_rate_limit_on_success() {
		\update_option( 'progress_planner_license_key', 'correct-key' );

		$_SERVER['REMOTE_ADDR'] = '192.168.1.1';

		// Make 5 failed attempts.
		for ( $i = 0; $i < 5; $i++ ) {
			$this->rest_base->validate_token( 'wrong-key-' . $i );
		}

		// Successful authentication.
		$result = $this->rest_base->validate_token( 'correct-key' );
		$this->assertTrue( $result );

		// Check that rate limit counter was cleared.
		$ip_address     = '192.168.1.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		$failed_count   = \get_transient( $rate_limit_key );

		$this->assertFalse( $failed_count );

		unset( $_SERVER['REMOTE_ADDR'] );
	}

	/**
	 * Test that constructor hooks into rest_api_init.
	 *
	 * @return void
	 */
	public function test_constructor_adds_rest_api_init_hook() {
		$mock = new class() extends Base {
			/**
			 * Register REST endpoint implementation.
			 *
			 * @return void
			 */
			public function register_rest_endpoint() {
				// Mock implementation.
			}
		};

		$this->assertEquals( 10, \has_action( 'rest_api_init', [ $mock, 'register_rest_endpoint' ] ) );
	}
}
