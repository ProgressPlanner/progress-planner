<?php
/**
 * Class Rest_Base_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Base;
use Progress_Planner\Rest\Tasks;

/**
 * REST API Base test case.
 */
class Rest_Base_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Tasks
	 */
	private $rest_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->rest_instance = new Tasks();
	}

	/**
	 * Test get_client_ip with Cloudflare header.
	 *
	 * @return void
	 */
	public function test_get_client_ip_cloudflare() {
		$_SERVER['HTTP_CF_CONNECTING_IP'] = '192.168.1.100';
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		unset( $_SERVER['REMOTE_ADDR'] );

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '192.168.1.100', $ip );
	}

	/**
	 * Test get_client_ip with X-Real-IP header.
	 *
	 * @return void
	 */
	public function test_get_client_ip_x_real_ip() {
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		$_SERVER['HTTP_X_REAL_IP'] = '192.168.1.101';
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		unset( $_SERVER['REMOTE_ADDR'] );

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '192.168.1.101', $ip );
	}

	/**
	 * Test get_client_ip with X-Forwarded-For header (single IP).
	 *
	 * @return void
	 */
	public function test_get_client_ip_x_forwarded_for_single() {
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		$_SERVER['HTTP_X_FORWARDED_FOR'] = '192.168.1.102';
		unset( $_SERVER['REMOTE_ADDR'] );

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '192.168.1.102', $ip );
	}

	/**
	 * Test get_client_ip with X-Forwarded-For header (multiple IPs).
	 *
	 * @return void
	 */
	public function test_get_client_ip_x_forwarded_for_multiple() {
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		$_SERVER['HTTP_X_FORWARDED_FOR'] = '192.168.1.103, 10.0.0.1, 172.16.0.1';
		unset( $_SERVER['REMOTE_ADDR'] );

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '192.168.1.103', $ip );
	}

	/**
	 * Test get_client_ip with REMOTE_ADDR.
	 *
	 * @return void
	 */
	public function test_get_client_ip_remote_addr() {
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		$_SERVER['REMOTE_ADDR'] = '192.168.1.104';

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '192.168.1.104', $ip );
	}

	/**
	 * Test get_client_ip with invalid IP.
	 *
	 * @return void
	 */
	public function test_get_client_ip_invalid() {
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		$_SERVER['REMOTE_ADDR'] = 'invalid-ip';

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '0.0.0.0', $ip );
	}

	/**
	 * Test get_client_ip with no headers.
	 *
	 * @return void
	 */
	public function test_get_client_ip_no_headers() {
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		unset( $_SERVER['REMOTE_ADDR'] );

		$reflection = new \ReflectionClass( $this->rest_instance );
		$method     = $reflection->getMethod( 'get_client_ip' );
		$method->setAccessible( true );

		$ip = $method->invoke( $this->rest_instance );

		$this->assertEquals( '0.0.0.0', $ip );
	}

	/**
	 * Test validate_token with valid license key.
	 *
	 * @return void
	 */
	public function test_validate_token_valid_license_key() {
		$token       = 'test-license-key-123';
		$license_key = 'test-license-key-123';

		\update_option( 'progress_planner_license_key', $license_key );

		// Clear any rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertTrue( $result );
	}

	/**
	 * Test validate_token with invalid license key.
	 *
	 * @return void
	 */
	public function test_validate_token_invalid_license_key() {
		$token       = 'wrong-token';
		$license_key = 'correct-license-key';

		\update_option( 'progress_planner_license_key', $license_key );

		// Clear any rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertFalse( $result );

		// Verify failed attempts counter was incremented.
		$failed_attempts = \get_transient( $rate_limit_key );
		$this->assertEquals( 1, $failed_attempts );
	}

	/**
	 * Test validate_token with test token.
	 *
	 * @return void
	 */
	public function test_validate_token_test_token() {
		$token      = 'test-token-123';
		$test_token = 'test-token-123';

		\update_option( 'progress_planner_test_token', $test_token );
		\update_option( 'progress_planner_license_key', 'no-license' );

		// Clear any rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertTrue( $result );
	}

	/**
	 * Test validate_token with token containing "token/" prefix.
	 *
	 * @return void
	 */
	public function test_validate_token_with_prefix() {
		$token       = 'token/test-license-key-123';
		$license_key = 'test-license-key-123';

		\update_option( 'progress_planner_license_key', $license_key );

		// Clear any rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertTrue( $result );
	}

	/**
	 * Test validate_token rate limiting blocks after 10 failed attempts.
	 *
	 * @return void
	 */
	public function test_validate_token_rate_limiting() {
		$token = 'wrong-token';
		\update_option( 'progress_planner_license_key', 'correct-key' );

		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		// Set failed attempts to 10.
		\set_transient( $rate_limit_key, 10, HOUR_IN_SECONDS );

		$result = $this->rest_instance->validate_token( $token );

		$this->assertFalse( $result );
	}

	/**
	 * Test validate_token clears rate limit on successful authentication.
	 *
	 * @return void
	 */
	public function test_validate_token_clears_rate_limit_on_success() {
		$token       = 'test-license-key-123';
		$license_key = 'test-license-key-123';

		\update_option( 'progress_planner_license_key', $license_key );

		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );

		// Set some failed attempts.
		\set_transient( $rate_limit_key, 5, HOUR_IN_SECONDS );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertTrue( $result );

		// Verify rate limit was cleared.
		$failed_attempts = \get_transient( $rate_limit_key );
		$this->assertFalse( $failed_attempts );
	}

	/**
	 * Test validate_token with no license key.
	 *
	 * @return void
	 */
	public function test_validate_token_no_license_key() {
		$token = 'any-token';

		\delete_option( 'progress_planner_license_key' );

		// Clear any rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertFalse( $result );

		// Verify failed attempts counter was incremented.
		$failed_attempts = \get_transient( $rate_limit_key );
		$this->assertEquals( 1, $failed_attempts );
	}

	/**
	 * Test validate_token with "no-license" license key.
	 *
	 * @return void
	 */
	public function test_validate_token_no_license_value() {
		$token = 'any-token';

		\update_option( 'progress_planner_license_key', 'no-license' );

		// Clear any rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );

		// Mock IP address.
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$result = $this->rest_instance->validate_token( $token );

		$this->assertFalse( $result );

		// Verify failed attempts counter was incremented.
		$failed_attempts = \get_transient( $rate_limit_key );
		$this->assertEquals( 1, $failed_attempts );
	}

	/**
	 * Clean up after tests.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up server variables.
		unset( $_SERVER['HTTP_CF_CONNECTING_IP'] );
		unset( $_SERVER['HTTP_X_REAL_IP'] );
		unset( $_SERVER['HTTP_X_FORWARDED_FOR'] );
		unset( $_SERVER['REMOTE_ADDR'] );

		// Clean up options.
		\delete_option( 'progress_planner_license_key' );
		\delete_option( 'progress_planner_test_token' );

		// Clean up transients.
		global $wpdb;
		$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"DELETE FROM $wpdb->options WHERE option_name LIKE %s", // @phpstan-ignore-line property.nonObject
				'%prpl_api_rate_limit_%'
			)
		);

		parent::tearDown();
	}
}

