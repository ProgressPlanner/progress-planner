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
use Progress_Planner\Suggested_Tasks\Providers\Tasks_Interactive;

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
	 * Test arbitrary options update vulnerability in Tasks_Interactive.
	 *
	 * This tests the CURRENT vulnerable behavior where any option can be updated.
	 *
	 * @return void
	 */
	public function test_interactive_task_arbitrary_options_vulnerability() {
		\wp_set_current_user( $this->admin_user_id );

		// Create a mock interactive task provider.
		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		// Set initial value.
		\update_option( 'test_safe_option', 'original_value' );
		\update_option( 'test_dangerous_option', 'original_value' );

		// Test 1: Try to update an arbitrary option (vulnerable behavior).
		$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']      = 'test_dangerous_option'; // This should be in whitelist.
		$_POST['value']        = 'malicious_value';
		$_POST['setting_path'] = '[]';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		// CURRENT VULNERABLE BEHAVIOR: This succeeds.
		$this->assertTrue( $result['success'] );
		$this->assertEquals( 'malicious_value', \get_option( 'test_dangerous_option' ) );

		// Test 2: Try to update a critical WordPress option.
		$original_blogname = \get_option( 'blogname' );
		$_POST['setting']  = 'blogname';
		$_POST['value']    = 'Hacked Site';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		// CURRENT VULNERABLE BEHAVIOR: This also succeeds (CRITICAL VULNERABILITY).
		$this->assertTrue( $result['success'] );
		$this->assertEquals( 'Hacked Site', \get_option( 'blogname' ) );

		// Restore original value.
		\update_option( 'blogname', $original_blogname );
	}

	/**
	 * Test that interactive task requires proper nonce.
	 *
	 * @return void
	 */
	public function test_interactive_task_requires_nonce() {
		\wp_set_current_user( $this->admin_user_id );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		// Test without nonce.
		$_POST['nonce']        = 'invalid_nonce';
		$_POST['setting']      = 'test_option';
		$_POST['value']        = 'new_value';
		$_POST['setting_path'] = '[]';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'Invalid nonce', $result['data']['message'] );
	}

	/**
	 * Test that interactive task requires manage_options capability.
	 *
	 * @return void
	 */
	public function test_interactive_task_requires_manage_options() {
		\wp_set_current_user( $this->editor_user_id );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']      = 'test_option';
		$_POST['value']        = 'new_value';
		$_POST['setting_path'] = '[]';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'permission', $result['data']['message'] );
	}

	/**
	 * Test nested setting path update.
	 *
	 * @return void
	 */
	public function test_interactive_task_nested_setting_path() {
		\wp_set_current_user( $this->admin_user_id );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		// Set up a nested option.
		\update_option(
			'test_nested_option',
			[
				'level1' => [
					'level2' => [
						'level3' => 'original_value',
					],
				],
			]
		);

		$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']      = 'test_nested_option';
		$_POST['value']        = 'new_value';
		$_POST['setting_path'] = \wp_json_encode( [ 'level1', 'level2', 'level3' ] );

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		$this->assertTrue( $result['success'] );

		$option = \get_option( 'test_nested_option' );
		$this->assertEquals( 'new_value', $option['level1']['level2']['level3'] );
	}

	/**
	 * Test that the security fix prevents arbitrary options update.
	 *
	 * This tests the FIXED behavior with the whitelist in place.
	 *
	 * @return void
	 */
	public function test_interactive_task_whitelist_prevents_arbitrary_updates() {
		\wp_set_current_user( $this->admin_user_id );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		// Test 1: Try to update a non-whitelisted option (should FAIL with fix).
		$original_admin_email  = \get_option( 'admin_email' );
		$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']      = 'admin_email'; // Not in whitelist.
		$_POST['value']        = 'hacker@evil.com';
		$_POST['setting_path'] = '[]';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		// FIXED BEHAVIOR: This should fail.
		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'Invalid setting', $result['data']['message'] );
		$this->assertEquals( $original_admin_email, \get_option( 'admin_email' ) );

		// Test 2: Try to update another critical option (should FAIL with fix).
		$_POST['setting'] = 'active_plugins'; // Not in whitelist.
		$_POST['value']   = 'malicious-plugin/malicious.php';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		// FIXED BEHAVIOR: This should also fail.
		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'Invalid setting', $result['data']['message'] );
	}

	/**
	 * Test that whitelisted options CAN be updated.
	 *
	 * @return void
	 */
	public function test_interactive_task_allows_whitelisted_options() {
		\wp_set_current_user( $this->admin_user_id );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		// Test updating a whitelisted option (should SUCCEED).
		$original_blogdescription = \get_option( 'blogdescription' );
		$_POST['nonce']           = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']         = 'blogdescription'; // This IS in whitelist.
		$_POST['value']           = 'New tagline';
		$_POST['setting_path']    = '[]';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		// FIXED BEHAVIOR: This should succeed.
		$this->assertTrue( $result['success'] );
		$this->assertEquals( 'New tagline', \get_option( 'blogdescription' ) );

		// Restore original value.
		\update_option( 'blogdescription', $original_blogdescription );
	}

	/**
	 * Test that the whitelist filter works correctly.
	 *
	 * @return void
	 */
	public function test_interactive_task_whitelist_filter() {
		\wp_set_current_user( $this->admin_user_id );

		// Add a custom option to the whitelist via filter.
		$filter_callback = function ( $allowed_options ) {
			$allowed_options[] = 'test_custom_allowed_option';
			return $allowed_options;
		};
		\add_filter( 'progress_planner_interactive_task_allowed_options', $filter_callback );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		// Test updating the custom whitelisted option (should SUCCEED).
		\update_option( 'test_custom_allowed_option', 'original' );
		$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']      = 'test_custom_allowed_option';
		$_POST['value']        = 'custom_value';
		$_POST['setting_path'] = '[]';

		\ob_start();
		$task->handle_interactive_task_submit();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		$this->assertTrue( $result['success'] );
		$this->assertEquals( 'custom_value', \get_option( 'test_custom_allowed_option' ) );

		// Clean up.
		\remove_filter( 'progress_planner_interactive_task_allowed_options', $filter_callback );
		\delete_option( 'test_custom_allowed_option' );
	}

	/**
	 * Test that critical WordPress options are protected.
	 *
	 * @return void
	 */
	public function test_interactive_task_protects_critical_options() {
		\wp_set_current_user( $this->admin_user_id );

		$task = new class() extends Tasks_Interactive {
			/**
			 * Get the provider ID.
			 *
			 * @return string
			 */
			public function get_provider_id() {
				return 'test-task';
			}

			/**
			 * Get the task details.
			 *
			 * @param array $task_data The task data.
			 * @return array
			 */
			public function get_task_details( $task_data = [] ) {
				return [];
			}

			/**
			 * Print the popover form contents.
			 *
			 * @return void
			 */
			public function print_popover_form_contents() {}

			/**
			 * Evaluate the task.
			 *
			 * @return bool
			 */
			public function evaluate() {
				return false;
			}
		};

		$critical_options = [
			'admin_email'        => 'admin@example.com',
			'siteurl'            => 'https://example.com',
			'home'               => 'https://example.com',
			'users_can_register' => '0',
			'active_plugins'     => [],
			'default_role'       => 'subscriber',
			'wp_user_roles'      => [],
		];

		foreach ( $critical_options as $option => $malicious_value ) {
			$original_value = \get_option( $option );

			$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
			$_POST['setting']      = $option;
			$_POST['value']        = $malicious_value;
			$_POST['setting_path'] = '[]';

			\ob_start();
			$task->handle_interactive_task_submit();
			$output = \ob_get_clean();

			$result = \json_decode( $output, true );

			// All critical options should be blocked.
			$this->assertFalse( $result['success'], "Critical option '$option' should be blocked" );
			$this->assertEquals( $original_value, \get_option( $option ), "Critical option '$option' should not change" );
		}
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
	 * Test email AJAX handler uses correct nonce function.
	 *
	 * @return void
	 */
	public function test_email_ajax_uses_correct_nonce() {
		\wp_set_current_user( $this->admin_user_id );

		// Create the email sending task provider.
		$email_task = new \Progress_Planner\Suggested_Tasks\Providers\Email_Sending();

		// Test with invalid nonce (should FAIL).
		$_POST['nonce']         = 'invalid_nonce';
		$_POST['email_address'] = 'test@example.com';

		\ob_start();
		$email_task->ajax_test_email_sending();
		$output = \ob_get_clean();

		$result = \json_decode( $output, true );

		$this->assertFalse( $result['success'] );
		$this->assertStringContainsString( 'nonce', \strtolower( $result['data']['message'] ) );
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
		// Clean up test options.
		\delete_option( 'test_safe_option' );
		\delete_option( 'test_dangerous_option' );
		\delete_option( 'test_option' );
		\delete_option( 'test_nested_option' );

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
