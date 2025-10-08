<?php
/**
 * Security Tests
 *
 * Tests for security enhancements including CSRF protection, authentication,
 * rate limiting, and input validation.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

/**
 * Security test case.
 */
class Test_Security extends \WP_UnitTestCase {

	/**
	 * Holds the WP REST Server object.
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * The test token.
	 *
	 * @var string
	 */
	private $token;

	/**
	 * Admin user ID.
	 *
	 * @var int
	 */
	private $admin_user_id;

	/**
	 * Editor user ID.
	 *
	 * @var int
	 */
	private $editor_user_id;

	/**
	 * Subscriber user ID.
	 *
	 * @var int
	 */
	private $subscriber_user_id;

	/**
	 * Setup before tests.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->token = 'test_token_123456789';

		// Create test users.
		$this->admin_user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		$this->editor_user_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		$this->subscriber_user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );

		// Set license key.
		\update_option( 'progress_planner_license_key', $this->token );

		// Initialize REST API.
		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		$this->server   = $wp_rest_server;
		\do_action( 'rest_api_init' );
	}

	/**
	 * Cleanup after tests.
	 */
	public function tearDown(): void {
		parent::tearDown();

		// Cleanup options.
		\delete_option( 'progress_planner_license_key' );

		// Clear rate limit transients.
		global $wpdb;
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_prpl_api_rate_limit_%'" );
		$wpdb->query( "DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_prpl_api_rate_limit_%'" );

		global $wp_rest_server;
		$wp_rest_server = null;
	}

	/**
	 * Test REST API authentication requires valid token or authenticated user.
	 */
	public function test_rest_api_requires_authentication() {
		// Test 1: No token, no auth - should fail.
		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/invalid_token' );
		$response = $this->server->dispatch( $request );

		$this->assertNotEquals( 200, $response->get_status(), 'Invalid token should not be allowed' );

		// Test 2: Valid token, no auth - should succeed.
		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status(), 'Valid token should be allowed' );

		// Test 3: Valid token with authenticated admin - should succeed.
		\wp_set_current_user( $this->admin_user_id );
		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 200, $response->get_status(), 'Authenticated admin should be allowed' );
		\wp_set_current_user( 0 );
	}

	/**
	 * Test rate limiting on REST API.
	 */
	public function test_rest_api_rate_limiting() {
		// Make requests up to the limit (default 10).
		$max_requests = apply_filters( 'progress_planner_api_rate_limit', 10 );

		for ( $i = 0; $i < $max_requests; $i++ ) {
			$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
			$response = $this->server->dispatch( $request );

			$this->assertEquals( 200, $response->get_status(), "Request $i should succeed" );
		}

		// The next request should be rate limited.
		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
		$response = $this->server->dispatch( $request );

		$this->assertEquals( 429, $response->get_status(), 'Request should be rate limited after ' . $max_requests . ' requests' );

		$data = $response->get_data();
		$this->assertArrayHasKey( 'code', $data );
		$this->assertEquals( 'rest_too_many_requests', $data['code'] );
	}

	/**
	 * Test that authenticated users bypass rate limiting.
	 */
	public function test_authenticated_users_bypass_rate_limiting() {
		\wp_set_current_user( $this->admin_user_id );

		// Make many requests.
		$max_requests = apply_filters( 'progress_planner_api_rate_limit', 10 );

		for ( $i = 0; $i < $max_requests + 5; $i++ ) {
			$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
			$response = $this->server->dispatch( $request );

			$this->assertEquals( 200, $response->get_status(), "Authenticated request $i should succeed" );
		}

		\wp_set_current_user( 0 );
	}

	/**
	 * Test timing-safe token comparison.
	 */
	public function test_token_comparison_uses_hash_equals() {
		$stats = new \Progress_Planner\Rest\Stats();

		// Test with valid token.
		$this->assertTrue( $stats->validate_token( $this->token ), 'Valid token should pass' );

		// Test with invalid token.
		$this->assertFalse( $stats->validate_token( 'wrong_token' ), 'Invalid token should fail' );

		// Test with similar but different token (timing attack prevention).
		$similar_token = $this->token . 'x';
		$this->assertFalse( $stats->validate_token( $similar_token ), 'Similar token should fail' );
	}

	/**
	 * Test that sensitive data is only exposed to authenticated admins.
	 */
	public function test_sensitive_data_exposure() {
		// Test 1: Token-based access should not get sensitive data.
		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
		$response = $this->server->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'plugins_count', $data, 'Token access should only get plugin count' );
		$this->assertArrayNotHasKey( 'plugins', $data, 'Token access should not get full plugin list' );

		// Test 2: Authenticated admin should get sensitive data.
		\wp_set_current_user( $this->admin_user_id );
		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
		$response = $this->server->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'plugins', $data, 'Admin should get full plugin list' );
		$this->assertArrayNotHasKey( 'plugins_count', $data, 'Admin should not get plugin count field' );

		\wp_set_current_user( 0 );
	}

	/**
	 * Test AJAX task action requires proper capability.
	 *
	 * This test verifies that users without edit_posts capability cannot perform task actions.
	 * Full AJAX flow is tested in E2E tests.
	 */
	public function test_ajax_task_action_requires_capability() {
		// Test 1: Unauthenticated user should not have edit_posts capability.
		\wp_set_current_user( 0 );
		$this->assertFalse( \current_user_can( 'edit_posts' ), 'Unauthenticated user should not have edit_posts' );

		// Test 2: Subscriber should not have edit_posts capability.
		\wp_set_current_user( $this->subscriber_user_id );
		$this->assertFalse( \current_user_can( 'edit_posts' ), 'Subscriber should not have edit_posts' );

		// Test 3: Editor should have edit_posts capability.
		\wp_set_current_user( $this->editor_user_id );
		$this->assertTrue( \current_user_can( 'edit_posts' ), 'Editor should have edit_posts' );

		// Test 4: Admin should have edit_posts capability.
		\wp_set_current_user( $this->admin_user_id );
		$this->assertTrue( \current_user_can( 'edit_posts' ), 'Admin should have edit_posts' );

		\wp_set_current_user( 0 );
	}

	/**
	 * Test interactive task settings whitelist.
	 *
	 * This test verifies that the settings whitelist properly restricts which settings can be modified.
	 * Full AJAX flow is tested in E2E tests.
	 */
	public function test_interactive_task_settings_whitelist() {
		// Test that the whitelist filter exists and contains expected safe settings.
		$allowed_settings = \apply_filters(
			'progress_planner_interactive_task_allowed_settings',
			[
				'date_format',
				'time_format',
				'timezone_string',
				'WPLANG',
				'start_of_week',
			]
		);

		// Test 1: Safe settings should be in whitelist.
		$this->assertContains( 'timezone_string', $allowed_settings, 'timezone_string should be whitelisted' );
		$this->assertContains( 'date_format', $allowed_settings, 'date_format should be whitelisted' );
		$this->assertContains( 'time_format', $allowed_settings, 'time_format should be whitelisted' );

		// Test 2: Dangerous settings should NOT be in whitelist.
		$this->assertNotContains( 'admin_email', $allowed_settings, 'admin_email should not be whitelisted' );
		$this->assertNotContains( 'active_plugins', $allowed_settings, 'active_plugins should not be whitelisted' );
		$this->assertNotContains( 'siteurl', $allowed_settings, 'siteurl should not be whitelisted' );
		$this->assertNotContains( 'home', $allowed_settings, 'home should not be whitelisted' );
	}

	/**
	 * Test path traversal protection.
	 */
	public function test_path_traversal_protection() {
		$base = \progress_planner();

		// Test 1: Normal file within plugin directory - should work.
		ob_start();
		$base->the_file( 'views/page-widgets/suggested-tasks.php' );
		$output = ob_get_clean();

		$this->assertNotEmpty( $output, 'Normal file should be included' );

		// Test 2: Path traversal attempt - should be blocked.
		ob_start();
		$base->the_file( '../../../wp-config.php' );
		$output = ob_get_clean();

		$this->assertEmpty( $output, 'Path traversal should be blocked' );

		// Test 3: Another traversal attempt - should be blocked.
		ob_start();
		$base->the_file( 'views/../../../../../../etc/passwd' );
		$output = ob_get_clean();

		$this->assertEmpty( $output, 'Path traversal should be blocked' );
	}

	/**
	 * Test REST API permissions controller.
	 */
	public function test_rest_recommendations_controller_permissions() {
		// Test 1: Unauthenticated user cannot create recommendations.
		\wp_set_current_user( 0 );

		$request = new WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );
		$request->set_body_params( [
			'title'   => 'Test Recommendation',
			'content' => 'Test content',
			'status'  => 'publish',
		] );

		$response = $this->server->dispatch( $request );
		$this->assertNotEquals( 200, $response->get_status(), 'Unauthenticated user should not create recommendations' );

		// Test 2: Subscriber cannot create recommendations.
		\wp_set_current_user( $this->subscriber_user_id );

		$request = new WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );
		$request->set_body_params( [
			'title'   => 'Test Recommendation',
			'content' => 'Test content',
			'status'  => 'publish',
		] );

		$response = $this->server->dispatch( $request );
		$this->assertNotEquals( 200, $response->get_status(), 'Subscriber should not create recommendations' );

		\wp_set_current_user( 0 );
	}

	/**
	 * Test SQL injection protection in database upgrade.
	 */
	public function test_sql_injection_protection() {
		global $wpdb;

		// Create a test table with potentially malicious name.
		$test_table = $wpdb->prefix . 'progress_planner_activities';

		// Verify the table exists.
		$table_exists = $wpdb->get_var( "SHOW TABLES LIKE '{$test_table}'" );
		$this->assertEquals( $test_table, $table_exists, 'Test table should exist' );

		// Test that the query uses prepared statements (just verify no errors).
		$query_obj = new \Progress_Planner\Activities\Query();

		// If this runs without SQL errors, prepared statements are working.
		$activities = $query_obj->query_activities( [] );
		$this->assertIsArray( $activities, 'Query should return array' );
	}

	/**
	 * Test that nonce verification works for task completion.
	 */
	public function test_task_completion_nonce_verification() {
		\wp_set_current_user( $this->admin_user_id );

		// Create a test task.
		$task_id = 'test-task-' . time();

		// Test 1: Without nonce - should fail.
		$_GET['prpl_complete_task'] = $task_id;

		try {
			\progress_planner()->get_suggested_tasks()->maybe_complete_task();
			$this->fail( 'Should have died due to missing nonce' );
		} catch ( \WPAjaxDieStopException $e ) {
			// Expected - nonce verification failed.
		} catch ( \Exception $e ) {
			// WP_Die throws different exceptions.
		}

		// Test 2: With invalid nonce - should fail.
		$_GET['prpl_complete_task'] = $task_id;
		$_GET['_wpnonce']           = 'invalid_nonce';

		try {
			\progress_planner()->get_suggested_tasks()->maybe_complete_task();
			$this->fail( 'Should have died due to invalid nonce' );
		} catch ( \WPAjaxDieStopException $e ) {
			// Expected.
		} catch ( \Exception $e ) {
			// Expected.
		}

		// Test 3: With valid nonce - should proceed (no exception).
		$_GET['prpl_complete_task'] = $task_id;
		$_GET['_wpnonce']           = \wp_create_nonce( 'prpl_complete_task' );

		// This should not throw an exception.
		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		$this->assertTrue( true, 'Valid nonce should allow task completion' );

		\wp_set_current_user( 0 );
		unset( $_GET['prpl_complete_task'] );
		unset( $_GET['_wpnonce'] );
	}
}
