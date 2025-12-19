<?php
/**
 * Security Tests
 *
 * Tests for security vulnerabilities and their fixes.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Page_Settings;

/**
 * Security test case.
 */
class Security_Test extends \WP_UnitTestCase {

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
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();

		// Create admin user.
		$this->admin_user_id = $this->factory->user->create(
			[
				'role' => 'administrator',
			]
		);

		// Create editor user.
		$this->editor_user_id = $this->factory->user->create(
			[
				'role' => 'editor',
			]
		);
	}

	/**
	 * Test that admin referer is checked for AJAX settings form.
	 *
	 * This tests the CURRENT behavior where check_admin_referer is used
	 * instead of check_ajax_referer.
	 *
	 * @return void
	 */
	public function test_settings_form_nonce_check_current_behavior() {
		\wp_set_current_user( $this->admin_user_id );

		// Set up POST data without nonce.
		$_POST['pages'] = [
			'about' => [
				'have_page' => 'no',
				'id'        => 0,
			],
		];

		// Create the settings page instance.
		$settings_page = new Page_Settings();

		// Expect this to fail due to missing nonce.
		$this->expectException( \WPDieException::class );
		$settings_page->store_settings_form_options();
	}

	/**
	 * Test that only users with manage_options can save settings.
	 *
	 * @return void
	 */
	public function test_settings_form_requires_manage_options() {
		\wp_set_current_user( $this->editor_user_id );

		$_POST['pages'] = [
			'about' => [
				'have_page' => 'no',
				'id'        => 0,
			],
		];

		// Create the settings page instance.
		$settings_page = new Page_Settings();

		// Capture the JSON output.
		\ob_start();
		$settings_page->store_settings_form_options();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );
		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'permission', $result['data']['message'] );
	}

	/**
	 * Test that settings form properly sanitizes input.
	 *
	 * @return void
	 */
	public function test_settings_form_sanitizes_input() {
		\wp_set_current_user( $this->admin_user_id );

		// Create a page to test with.
		$page_id = $this->factory->post->create(
			[
				'post_type'  => 'page',
				'post_title' => 'Test Page',
			]
		);

		$_POST['_wpnonce'] = \wp_create_nonce( 'progress_planner' );
		$_POST['pages']    = [
			'about' => [
				'have_page' => 'yes',
				'id'        => $page_id,
			],
		];

		// Create the settings page instance.
		$settings_page = new Page_Settings();

		// This should succeed.
		\ob_start();
		$settings_page->store_settings_form_options();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );
		$this->assertTrue( $result['success'] );
	}

	/**
	 * Test that AJAX nonce check fix works correctly.
	 *
	 * @return void
	 */
	public function test_settings_form_ajax_nonce_check() {
		\wp_set_current_user( $this->admin_user_id );

		$settings_page = new Page_Settings();

		// Test with valid AJAX nonce (should succeed).
		$_POST['nonce'] = \wp_create_nonce( 'progress_planner' );
		$_POST['pages'] = [
			'about' => [
				'have_page' => 'no',
				'id'        => 0,
			],
		];

		\ob_start();
		$settings_page->store_settings_form_options();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );
		$this->assertTrue( $result['success'] );

		// Test with invalid nonce (should fail).
		$_POST['nonce'] = 'invalid_nonce';

		\ob_start();
		$settings_page->store_settings_form_options();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );
		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'nonce', \strtolower( $result['data']['message'] ) );
	}

	/**
	 * Test task completion requires valid token (CSRF protection).
	 *
	 * @return void
	 */
	public function test_task_completion_requires_token() {
		\wp_set_current_user( $this->admin_user_id );

		// Create a test task.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task',
				'task_id'     => 'test-task-csrf',
				'provider_id' => 'test',
				'category'    => 'test',
			]
		);

		// Attempt to complete task without token (should FAIL with fix).
		$_GET['prpl_complete_task'] = 'test-task-csrf';
		unset( $_GET['token'] );

		// Mock the dashboard page check.
		\add_filter( 'progress_planner_is_dashboard_page', '__return_true' );

		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		// Task should NOT be completed.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( 'test-task-csrf' );
		$this->assertNotEquals( 'pending', $task->post_status );

		\remove_filter( 'progress_planner_is_dashboard_page', '__return_true' );
	}

	/**
	 * Test task completion with valid token succeeds.
	 *
	 * @return void
	 */
	public function test_task_completion_with_valid_token() {
		\wp_set_current_user( $this->admin_user_id );

		// Create a test task.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task Valid Token',
				'task_id'     => 'test-task-valid-token',
				'provider_id' => 'test',
				'category'    => 'test',
			]
		);

		// Generate valid token.
		$token = \progress_planner()->get_suggested_tasks()->generate_task_completion_token(
			'test-task-valid-token',
			$this->admin_user_id
		);

		// Attempt to complete task with valid token (should SUCCEED).
		$_GET['prpl_complete_task'] = 'test-task-valid-token';
		$_GET['token']              = $token;

		// Mock the dashboard page check.
		\add_filter( 'progress_planner_is_dashboard_page', '__return_true' );

		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		// Task SHOULD be completed.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( 'test-task-valid-token' );
		$this->assertEquals( 'pending', $task->post_status );

		\remove_filter( 'progress_planner_is_dashboard_page', '__return_true' );
	}

	/**
	 * Test task completion fails with invalid token.
	 *
	 * @return void
	 */
	public function test_task_completion_with_invalid_token() {
		\wp_set_current_user( $this->admin_user_id );

		// Create a test task.
		$task_id = \progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task Invalid Token',
				'task_id'     => 'test-task-invalid-token',
				'provider_id' => 'test',
				'category'    => 'test',
			]
		);

		// Use invalid token.
		$_GET['prpl_complete_task'] = 'test-task-invalid-token';
		$_GET['token']              = 'invalid-token-12345';

		// Mock the dashboard page check.
		\add_filter( 'progress_planner_is_dashboard_page', '__return_true' );

		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		// Task should NOT be completed.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( 'test-task-invalid-token' );
		$this->assertNotEquals( 'pending', $task->post_status );

		\remove_filter( 'progress_planner_is_dashboard_page', '__return_true' );
	}

	/**
	 * Test tokens are one-time use.
	 *
	 * @return void
	 */
	public function test_task_completion_token_one_time_use() {
		\wp_set_current_user( $this->admin_user_id );

		// Create two test tasks.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task One Time 1',
				'task_id'     => 'test-task-one-time-1',
				'provider_id' => 'test',
				'category'    => 'test',
			]
		);

		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task One Time 2',
				'task_id'     => 'test-task-one-time-2',
				'provider_id' => 'test',
				'category'    => 'test',
			]
		);

		// Generate token and complete first task.
		$token = \progress_planner()->get_suggested_tasks()->generate_task_completion_token(
			'test-task-one-time-1',
			$this->admin_user_id
		);

		$_GET['prpl_complete_task'] = 'test-task-one-time-1';
		$_GET['token']              = $token;

		\add_filter( 'progress_planner_is_dashboard_page', '__return_true' );
		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		// First task should be completed.
		$task1 = \progress_planner()->get_suggested_tasks_db()->get_post( 'test-task-one-time-1' );
		$this->assertEquals( 'pending', $task1->post_status );

		// Try to use same token for second task (should FAIL).
		$_GET['prpl_complete_task'] = 'test-task-one-time-2';
		// Token is same - already used and deleted.

		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		// Second task should NOT be completed.
		$task2 = \progress_planner()->get_suggested_tasks_db()->get_post( 'test-task-one-time-2' );
		$this->assertNotEquals( 'pending', $task2->post_status );

		\remove_filter( 'progress_planner_is_dashboard_page', '__return_true' );
	}

	/**
	 * Test token generation creates unique tokens.
	 *
	 * @return void
	 */
	public function test_token_generation_uniqueness() {
		\wp_set_current_user( $this->admin_user_id );

		// Generate two tokens for the same task.
		$token1 = \progress_planner()->get_suggested_tasks()->generate_task_completion_token(
			'test-task-unique',
			$this->admin_user_id
		);

		$token2 = \progress_planner()->get_suggested_tasks()->generate_task_completion_token(
			'test-task-unique',
			$this->admin_user_id
		);

		// Tokens should be different (includes random component).
		$this->assertNotEquals( $token1, $token2 );
	}

	/**
	 * Test token expiration.
	 *
	 * @return void
	 */
	public function test_token_expiration() {
		\wp_set_current_user( $this->admin_user_id );

		// Generate token.
		$token = \progress_planner()->get_suggested_tasks()->generate_task_completion_token(
			'test-task-expiry',
			$this->admin_user_id
		);

		// Manually delete the transient to simulate expiration.
		\delete_transient( 'prpl_complete_test-task-expiry_' . $this->admin_user_id );

		// Try to use expired token (should FAIL).
		$_GET['prpl_complete_task'] = 'test-task-expiry';
		$_GET['token']              = $token;

		\add_filter( 'progress_planner_is_dashboard_page', '__return_true' );

		// Create the task.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'post_title'  => 'Test Task Expiry',
				'task_id'     => 'test-task-expiry',
				'provider_id' => 'test',
				'category'    => 'test',
			]
		);

		\progress_planner()->get_suggested_tasks()->maybe_complete_task();

		// Task should NOT be completed.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( 'test-task-expiry' );
		$this->assertNotEquals( 'pending', $task->post_status );

		\remove_filter( 'progress_planner_is_dashboard_page', '__return_true' );
	}

	/**
	 * Clean up after tests.
	 */
	public function tear_down() {
		// Clean up test tasks.
		$test_tasks = [
			'test-task-csrf',
			'test-task-valid-token',
			'test-task-invalid-token',
			'test-task-one-time-1',
			'test-task-one-time-2',
			'test-task-expiry',
		];

		foreach ( $test_tasks as $task_id ) {
			$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );
			if ( $task ) {
				\wp_delete_post( $task->ID, true );
			}
		}

		parent::tear_down();
	}
}
