<?php
/**
 * Unit tests for Onboard_Wizard class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Onboard_Wizard;

/**
 * Onboard_Wizard test case.
 */
class Onboard_Wizard_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Onboard_Wizard
	 */
	private $wizard;

	/**
	 * Admin user ID.
	 *
	 * @var int
	 */
	private $admin_user_id;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// Create an admin user.
		$this->admin_user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );

		// Create a fresh instance of the wizard.
		$this->wizard = new Onboard_Wizard();
	}

	/**
	 * Tear down test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up options.
		\delete_option( 'prpl_onboard_progress' );
		\delete_option( 'progress_planner_license_key' );

		// Reset current user.
		\wp_set_current_user( 0 );

		parent::tearDown();
	}

	/**
	 * Test constructor registers init hook.
	 *
	 * @return void
	 */
	public function test_constructor_registers_init_hook() {
		$wizard = new Onboard_Wizard();

		$this->assertNotFalse(
			\has_action( 'init', [ $wizard, 'maybe_register_popover_hooks' ] )
		);
	}

	/**
	 * Test maybe_register_popover_hooks does nothing for non-admin users.
	 *
	 * @return void
	 */
	public function test_maybe_register_popover_hooks_non_admin() {
		// Set non-admin user.
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// AJAX actions should not be registered for non-admin.
		$this->assertFalse(
			\has_action( 'wp_ajax_progress_planner_onboarding_complete_task', [ $wizard, 'ajax_complete_task' ] )
		);
	}

	/**
	 * Test maybe_register_popover_hooks registers hooks for admin users when privacy not accepted.
	 *
	 * @return void
	 */
	public function test_maybe_register_popover_hooks_admin_no_privacy() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Ensure privacy is not accepted.
		\delete_option( 'progress_planner_license_key' );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// AJAX actions should be registered.
		$this->assertNotFalse(
			\has_action( 'wp_ajax_progress_planner_onboarding_complete_task', [ $wizard, 'ajax_complete_task' ] )
		);
		$this->assertNotFalse(
			\has_action( 'wp_ajax_progress_planner_onboarding_save_progress', [ $wizard, 'ajax_save_onboarding_progress' ] )
		);
		$this->assertNotFalse(
			\has_action( 'wp_ajax_prpl_save_all_onboarding_settings', [ $wizard, 'ajax_save_all_onboarding_settings' ] )
		);
	}

	/**
	 * Test maybe_register_popover_hooks skips when privacy accepted and no progress.
	 *
	 * @return void
	 */
	public function test_maybe_register_popover_hooks_skips_when_complete() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Set privacy accepted (license key exists).
		\update_option( 'progress_planner_license_key', 'test-license-key' );

		// Ensure no onboarding progress.
		\delete_option( 'prpl_onboard_progress' );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// Footer hooks should NOT be registered when onboarding is complete.
		$this->assertFalse(
			\has_action( 'wp_footer', [ $wizard, 'add_popover' ] )
		);
	}

	/**
	 * Test maybe_register_popover_hooks registers hooks when onboarding in progress.
	 *
	 * @return void
	 */
	public function test_maybe_register_popover_hooks_with_progress() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Set privacy accepted but onboarding in progress.
		\update_option( 'progress_planner_license_key', 'test-license-key' );
		\update_option( 'prpl_onboard_progress', \wp_json_encode( [ 'currentStep' => 2 ] ) );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// Footer hooks SHOULD be registered when onboarding is in progress.
		$this->assertNotFalse(
			\has_action( 'wp_footer', [ $wizard, 'add_popover' ] )
		);
		$this->assertNotFalse(
			\has_action( 'admin_footer', [ $wizard, 'add_popover' ] )
		);
	}

	/**
	 * Test define_steps_and_order creates expected steps.
	 *
	 * @return void
	 */
	public function test_define_steps_and_order() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();
		$wizard->define_steps_and_order();

		// Use reflection to access protected property.
		$reflection = new \ReflectionClass( $wizard );
		$property   = $reflection->getProperty( 'steps' );
		$property->setAccessible( true );
		$steps = $property->getValue( $wizard );

		$this->assertIsArray( $steps );
		$this->assertNotEmpty( $steps );

		// Check that expected steps exist.
		$step_templates = \array_column( $steps, 'template_file_name' );
		$this->assertContains( 'welcome', $step_templates );
		$this->assertContains( 'whats-what', $step_templates );
		$this->assertContains( 'badges', $step_templates );
		$this->assertContains( 'email-frequency', $step_templates );
		$this->assertContains( 'settings', $step_templates );
	}

	/**
	 * Test get_saved_progress returns null when no progress.
	 *
	 * @return void
	 */
	public function test_get_saved_progress_returns_null_when_empty() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Ensure no progress saved.
		\delete_option( 'prpl_onboard_progress' );

		$wizard = new Onboard_Wizard();

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $wizard );
		$method     = $reflection->getMethod( 'get_saved_progress' );
		$method->setAccessible( true );

		$result = $method->invoke( $wizard );

		$this->assertNull( $result );
	}

	/**
	 * Test get_saved_progress returns decoded progress.
	 *
	 * @return void
	 */
	public function test_get_saved_progress_returns_progress() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Set progress.
		$progress = [
			'currentStep' => 3,
			'data'        => [
				'firstTaskCompleted' => true,
			],
		];
		\update_option( 'prpl_onboard_progress', \wp_json_encode( $progress ) );

		$wizard = new Onboard_Wizard();

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $wizard );
		$method     = $reflection->getMethod( 'get_saved_progress' );
		$method->setAccessible( true );

		$result = $method->invoke( $wizard );

		$this->assertIsArray( $result );
		$this->assertEquals( 3, $result['currentStep'] );
		$this->assertTrue( $result['data']['firstTaskCompleted'] );
	}

	/**
	 * Test get_saved_progress returns null for invalid JSON.
	 *
	 * @return void
	 */
	public function test_get_saved_progress_returns_null_for_invalid_json() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Set invalid JSON.
		\update_option( 'prpl_onboard_progress', 'not-valid-json' );

		$wizard = new Onboard_Wizard();

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $wizard );
		$method     = $reflection->getMethod( 'get_saved_progress' );
		$method->setAccessible( true );

		$result = $method->invoke( $wizard );

		$this->assertNull( $result );
	}

	/**
	 * Test get_saved_progress returns null when not logged in.
	 *
	 * @return void
	 */
	public function test_get_saved_progress_returns_null_when_not_logged_in() {
		// Ensure no user is logged in.
		\wp_set_current_user( 0 );

		$wizard = new Onboard_Wizard();

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $wizard );
		$method     = $reflection->getMethod( 'get_saved_progress' );
		$method->setAccessible( true );

		$result = $method->invoke( $wizard );

		$this->assertNull( $result );
	}

	/**
	 * Test rest_pre_insert_attachment returns WP_Error when no file provided for prpl upload.
	 *
	 * @return void
	 */
	public function test_rest_pre_insert_attachment_no_file_error() {
		$wizard = new Onboard_Wizard();

		// Create a mock request marked as prpl upload but with no file.
		$request = new \WP_REST_Request( 'POST', '/wp/v2/media' );
		$request->set_param( 'prplFileUpload', true );

		$result = $wizard->rest_pre_insert_attachment( [], $request );

		// Should return error for missing file.
		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'rest_no_file', $result->get_error_code() );
	}

	/**
	 * Test rest_pre_insert_attachment passes through non-prpl uploads.
	 *
	 * @return void
	 */
	public function test_rest_pre_insert_attachment_passes_through_non_prpl() {
		$wizard = new Onboard_Wizard();

		// Create a mock request without prplFileUpload flag.
		$request    = new \WP_REST_Request( 'POST', '/wp/v2/media' );
		$attachment = [ 'test' => 'data' ];

		$result = $wizard->rest_pre_insert_attachment( $attachment, $request );

		$this->assertEquals( $attachment, $result );
	}

	/**
	 * Test skip_onboarding filter.
	 *
	 * @return void
	 */
	public function test_skip_onboarding_filter() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Ensure privacy is not accepted (would normally show onboarding).
		\delete_option( 'progress_planner_license_key' );

		// Add filter to skip onboarding.
		\add_filter( 'progress_planner_skip_onboarding', '__return_true' );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// Footer hooks should NOT be registered when filter skips onboarding.
		$this->assertFalse(
			\has_action( 'wp_footer', [ $wizard, 'add_popover' ] )
		);

		// Remove filter.
		\remove_filter( 'progress_planner_skip_onboarding', '__return_true' );
	}

	/**
	 * Test trigger_onboarding does nothing during AJAX.
	 *
	 * @return void
	 */
	public function test_trigger_onboarding_skips_ajax() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Simulate AJAX request.
		\add_filter( 'wp_doing_ajax', '__return_true' );

		$wizard = new Onboard_Wizard();

		// Capture output.
		\ob_start();
		$wizard->trigger_onboarding();
		$output = \ob_get_clean();

		// Should not output anything during AJAX.
		$this->assertEmpty( $output );

		// Remove filter.
		\remove_filter( 'wp_doing_ajax', '__return_true' );
	}

	/**
	 * Test trigger_onboarding does nothing for non-admin users.
	 *
	 * @return void
	 */
	public function test_trigger_onboarding_skips_non_admin() {
		// Set non-admin user.
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );

		$wizard = new Onboard_Wizard();

		// Capture output.
		\ob_start();
		$wizard->trigger_onboarding();
		$output = \ob_get_clean();

		// Should not output anything for non-admin.
		$this->assertEmpty( $output );
	}

	/**
	 * Test trigger_onboarding outputs script when no saved progress.
	 *
	 * @return void
	 */
	public function test_trigger_onboarding_outputs_script() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Ensure no progress saved.
		\delete_option( 'prpl_onboard_progress' );

		$wizard = new Onboard_Wizard();

		// Capture output.
		\ob_start();
		$wizard->trigger_onboarding();
		$output = \ob_get_clean();

		// Should output script to start onboarding.
		$this->assertStringContainsString( '<script>', $output );
		$this->assertStringContainsString( 'prplOnboardWizardReady', $output );
		$this->assertStringContainsString( 'startOnboarding', $output );
	}

	/**
	 * Test trigger_onboarding does not output script when progress exists.
	 *
	 * @return void
	 */
	public function test_trigger_onboarding_skips_when_progress_exists() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Set progress.
		\update_option( 'prpl_onboard_progress', \wp_json_encode( [ 'currentStep' => 1 ] ) );

		$wizard = new Onboard_Wizard();

		// Capture output.
		\ob_start();
		$wizard->trigger_onboarding();
		$output = \ob_get_clean();

		// Should not output script when progress exists.
		$this->assertEmpty( $output );
	}

	/**
	 * Test add_popover outputs popover HTML.
	 *
	 * @return void
	 */
	public function test_add_popover_outputs_html() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();

		// Initialize steps (required for add_popover to work).
		$wizard->define_steps_and_order();

		// Capture output.
		\ob_start();
		$wizard->add_popover();
		$output = \ob_get_clean();

		// Should output popover HTML.
		$this->assertStringContainsString( 'id="prpl-popover-onboarding"', $output );
		$this->assertStringContainsString( 'class="prpl-popover-onboarding"', $output );
		$this->assertStringContainsString( 'prpl-onboarding-layout', $output );
		$this->assertStringContainsString( 'prpl-tour-close-btn', $output );
	}
}
