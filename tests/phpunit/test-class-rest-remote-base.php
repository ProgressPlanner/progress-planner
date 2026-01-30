<?php
/**
 * Class Rest_Remote_Base_Test
 *
 * Tests for the Remote_Base auth layer:
 * - Bearer token extraction
 * - HMAC signature verification
 * - Timestamp replay protection
 * - Full check_permission flow
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Remote_Base;

/**
 * Concrete subclass of abstract Remote_Base for testing.
 *
 * Since Remote_Base is abstract, we need a concrete class to instantiate.
 */
class Test_Remote_Base_Concrete extends Remote_Base {

	/**
	 * Register REST endpoint (required by abstract parent).
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		// No-op for testing.
	}

	/**
	 * Expose extract_bearer_token for testing.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 *
	 * @return string|\WP_Error The token string or WP_Error.
	 */
	public function test_extract_bearer_token( $request ) {
		return $this->extract_bearer_token( $request );
	}

	/**
	 * Expose verify_signature for testing.
	 *
	 * @param \WP_REST_Request $request The REST request.
	 * @param string           $token   The token.
	 *
	 * @return true|\WP_Error True if valid, WP_Error otherwise.
	 */
	public function test_verify_signature( $request, $token ) {
		return $this->verify_signature( $request, $token );
	}
}

/**
 * REST API Remote_Base test case.
 */
class Rest_Remote_Base_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Test_Remote_Base_Concrete
	 */
	private $instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// Remove action to prevent register_rest_endpoint from running.
		$this->instance = new Test_Remote_Base_Concrete();
	}

	// =========================================================================
	// Bearer Token Extraction Tests
	// =========================================================================

	/**
	 * Test extract_bearer_token with valid Authorization header.
	 *
	 * @return void
	 */
	public function test_extract_bearer_token_valid() {
		$request = new \WP_REST_Request();
		$request->set_header( 'authorization', 'Bearer my-secret-token' );

		$result = $this->instance->test_extract_bearer_token( $request );

		$this->assertIsString( $result );
		$this->assertEquals( 'my-secret-token', $result );
	}

	/**
	 * Test extract_bearer_token with missing Authorization header.
	 *
	 * @return void
	 */
	public function test_extract_bearer_token_missing_header() {
		$request = new \WP_REST_Request();
		// No authorization header set.

		$result = $this->instance->test_extract_bearer_token( $request );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test extract_bearer_token with Authorization header without Bearer prefix.
	 *
	 * @return void
	 */
	public function test_extract_bearer_token_no_bearer_prefix() {
		$request = new \WP_REST_Request();
		$request->set_header( 'authorization', 'Basic dXNlcjpwYXNz' );

		$result = $this->instance->test_extract_bearer_token( $request );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test extract_bearer_token with empty Bearer value.
	 *
	 * "Authorization: Bearer " with nothing after.
	 *
	 * @return void
	 */
	public function test_extract_bearer_token_empty_value() {
		$request = new \WP_REST_Request();
		$request->set_header( 'authorization', 'Bearer ' );

		$result = $this->instance->test_extract_bearer_token( $request );

		// The implementation uses strpos to check for "Bearer " prefix,
		// then substr to extract. An empty Bearer value returns empty string.
		$this->assertIsString( $result );
		$this->assertEquals( '', $result );
	}

	// =========================================================================
	// HMAC Signature Verification Tests
	// =========================================================================

	/**
	 * Test verify_signature with valid signature and timestamp.
	 *
	 * @return void
	 */
	public function test_verify_signature_valid() {
		$token     = 'test-secret-token';
		$body      = '{"key":"value"}';
		$timestamp = (string) \time();
		$signature = \hash_hmac( 'sha256', $body . $timestamp, $token );

		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', $signature );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->test_verify_signature( $request, $token );

		$this->assertTrue( $result );
	}

	/**
	 * Test verify_signature with missing signature header.
	 *
	 * @return void
	 */
	public function test_verify_signature_missing_signature() {
		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_timestamp', (string) \time() );
		// No signature header.

		$result = $this->instance->test_verify_signature( $request, 'some-token' );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test verify_signature with missing timestamp header.
	 *
	 * @return void
	 */
	public function test_verify_signature_missing_timestamp() {
		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', 'some-sig' );
		// No timestamp header.

		$result = $this->instance->test_verify_signature( $request, 'some-token' );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test verify_signature with tampered/invalid signature.
	 *
	 * @return void
	 */
	public function test_verify_signature_invalid_signature() {
		$token     = 'test-secret-token';
		$body      = '{"key":"value"}';
		$timestamp = (string) \time();

		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', 'tampered-invalid-signature' );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->test_verify_signature( $request, $token );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test verify_signature with expired timestamp (>300 seconds ago).
	 *
	 * @return void
	 */
	public function test_verify_signature_expired_timestamp() {
		$token     = 'test-secret-token';
		$body      = '{"key":"value"}';
		$timestamp = (string) ( \time() - 301 ); // 301 seconds ago, beyond tolerance.
		$signature = \hash_hmac( 'sha256', $body . $timestamp, $token );

		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', $signature );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->test_verify_signature( $request, $token );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test verify_signature with future timestamp (>300 seconds ahead).
	 *
	 * @return void
	 */
	public function test_verify_signature_future_timestamp() {
		$token     = 'test-secret-token';
		$body      = '{"key":"value"}';
		$timestamp = (string) ( \time() + 301 ); // 301 seconds in the future.
		$signature = \hash_hmac( 'sha256', $body . $timestamp, $token );

		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', $signature );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->test_verify_signature( $request, $token );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test verify_signature with timestamp exactly at boundary (300 seconds ago).
	 *
	 * The implementation uses `abs(time() - timestamp) > TIMESTAMP_TOLERANCE`,
	 * so exactly 300 seconds should be accepted (not greater than 300).
	 *
	 * @return void
	 */
	public function test_verify_signature_boundary_timestamp() {
		$token     = 'test-secret-token';
		$body      = '{"key":"value"}';
		$timestamp = (string) ( \time() - 300 ); // Exactly at boundary.
		$signature = \hash_hmac( 'sha256', $body . $timestamp, $token );

		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', $signature );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->test_verify_signature( $request, $token );

		$this->assertTrue( $result );
	}

	/**
	 * Test verify_signature with empty request body.
	 *
	 * HMAC should work correctly with empty body (GET requests).
	 *
	 * @return void
	 */
	public function test_verify_signature_empty_body() {
		$token     = 'test-secret-token';
		$body      = '';
		$timestamp = (string) \time();
		$signature = \hash_hmac( 'sha256', $body . $timestamp, $token );

		$request = new \WP_REST_Request();
		$request->set_header( 'x_pp_server_signature', $signature );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->test_verify_signature( $request, $token );

		$this->assertTrue( $result );
	}

	// =========================================================================
	// Full check_permission Flow Tests
	// =========================================================================

	/**
	 * Test check_permission with valid Bearer token + valid HMAC signature.
	 *
	 * @return void
	 */
	public function test_check_permission_valid() {
		$token = 'test-license-key-for-check';

		// Set up the test token so validate_token passes.
		\update_option( 'progress_planner_test_token', $token );

		// Clear rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		// Build a request with valid Bearer + valid HMAC.
		$body      = '';
		$timestamp = (string) \time();
		$signature = \hash_hmac( 'sha256', $body . $timestamp, $token );

		$request = new \WP_REST_Request();
		$request->set_header( 'authorization', 'Bearer ' . $token );
		$request->set_header( 'x_pp_server_signature', $signature );
		$request->set_header( 'x_pp_server_timestamp', $timestamp );
		$request->set_body( $body );

		$result = $this->instance->check_permission( $request );

		$this->assertTrue( $result );
	}

	/**
	 * Test check_permission with invalid Bearer token.
	 *
	 * Should return WP_Error before reaching HMAC check.
	 *
	 * @return void
	 */
	public function test_check_permission_invalid_bearer() {
		$request = new \WP_REST_Request();
		// No authorization header at all.

		$result = $this->instance->check_permission( $request );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test check_permission with valid Bearer token but unrecognised token value.
	 *
	 * The token passes extraction but fails validate_token.
	 *
	 * @return void
	 */
	public function test_check_permission_bearer_extracted_but_invalid_token() {
		// Set up a known token that does NOT match.
		\update_option( 'progress_planner_test_token', 'correct-token' );
		\update_option( 'progress_planner_license_key', 'no-license' );

		// Clear rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$request = new \WP_REST_Request();
		$request->set_header( 'authorization', 'Bearer wrong-token' );

		$result = $this->instance->check_permission( $request );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test check_permission with valid Bearer token + invalid HMAC.
	 *
	 * The token passes both extraction and validation, but signature fails.
	 *
	 * @return void
	 */
	public function test_check_permission_valid_bearer_invalid_hmac() {
		$token = 'test-license-key-hmac';

		// Set up the test token so validate_token passes.
		\update_option( 'progress_planner_test_token', $token );

		// Clear rate limiting.
		$ip_address     = '127.0.0.1';
		$rate_limit_key = 'prpl_api_rate_limit_' . \md5( $ip_address );
		\delete_transient( $rate_limit_key );
		$_SERVER['REMOTE_ADDR'] = $ip_address;

		$request = new \WP_REST_Request();
		$request->set_header( 'authorization', 'Bearer ' . $token );
		$request->set_header( 'x_pp_server_signature', 'invalid-signature' );
		$request->set_header( 'x_pp_server_timestamp', (string) \time() );
		$request->set_body( '' );

		$result = $this->instance->check_permission( $request );

		$this->assertWPError( $result );
		$this->assertEquals( 'invalid_token', $result->get_error_code() );
		$this->assertEquals( 401, $result->get_error_data()['status'] );
	}

	/**
	 * Test TIMESTAMP_TOLERANCE constant value.
	 *
	 * @return void
	 */
	public function test_timestamp_tolerance_value() {
		$this->assertEquals( 300, Remote_Base::TIMESTAMP_TOLERANCE );
	}

	/**
	 * Clean up after tests.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		unset( $_SERVER['REMOTE_ADDR'] );

		\delete_option( 'progress_planner_license_key' );
		\delete_option( 'progress_planner_test_token' );

		// Clean up rate limit transients.
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
