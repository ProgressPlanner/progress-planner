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
	 * Test maybe_register_popover_hooks registers AJAX handlers when privacy not accepted.
	 *
	 * @return void
	 */
	public function test_maybe_register_popover_hooks_registers_ajax_handlers() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Ensure privacy is not accepted.
		\delete_option( 'progress_planner_license_key' );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// AJAX handlers should be registered for admin users.
		$this->assertNotFalse(
			\has_action( 'wp_ajax_progress_planner_onboarding_complete_task', [ $wizard, 'ajax_complete_task' ] )
		);
		$this->assertNotFalse(
			\has_action( 'wp_ajax_progress_planner_onboarding_save_progress', [ $wizard, 'ajax_save_onboarding_progress' ] )
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
	 * Test skip_onboarding filter affects step definition registration.
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

		// AJAX handlers should still be registered (they're needed for React).
		$this->assertNotFalse(
			\has_action( 'wp_ajax_progress_planner_onboarding_complete_task', [ $wizard, 'ajax_complete_task' ] )
		);

		// Remove filter.
		\remove_filter( 'progress_planner_skip_onboarding', '__return_true' );
	}

	/**
	 * Test verify_ajax_security method exists and is protected.
	 *
	 * @return void
	 */
	public function test_verify_ajax_security_method_exists() {
		$wizard     = new Onboard_Wizard();
		$reflection = new \ReflectionClass( $wizard );

		$this->assertTrue( $reflection->hasMethod( 'verify_ajax_security' ) );

		$method = $reflection->getMethod( 'verify_ajax_security' );
		$this->assertTrue( $method->isProtected() );
	}

	/**
	 * Test get_steps returns array with expected structure.
	 *
	 * @return void
	 */
	public function test_get_steps_returns_expected_structure() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();
		$steps = $wizard->get_steps();

		$this->assertIsArray( $steps );
		$this->assertNotEmpty( $steps );

		// Check that each step has required keys.
		foreach ( $steps as $step ) {
			$this->assertArrayHasKey( 'script_file_name', $step );
			$this->assertArrayHasKey( 'template_file_name', $step );
			$this->assertArrayHasKey( 'template_id', $step );
			$this->assertArrayHasKey( 'title', $step );
		}
	}

	/**
	 * Test get_steps returns steps even when steps are empty.
	 *
	 * @return void
	 */
	public function test_get_steps_defines_steps_if_empty() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();

		// Get steps directly (should auto-define).
		$steps = $wizard->get_steps();

		$this->assertIsArray( $steps );
		$this->assertNotEmpty( $steps );
	}

	/**
	 * Test rest_pre_insert_attachment rejects non-image files.
	 *
	 * @return void
	 */
	public function test_rest_pre_insert_attachment_rejects_non_image() {
		$wizard = new Onboard_Wizard();

		// Create mock request with non-image file.
		$request = new \WP_REST_Request( 'POST', '/wp/v2/media' );
		$request->set_param( 'prplFileUpload', true );
		$request->set_file_params(
			[
				'file' => [
					'name' => 'test.pdf',
					'type' => 'application/pdf',
				],
			]
		);

		$result = $wizard->rest_pre_insert_attachment( [], $request );

		$this->assertInstanceOf( \WP_Error::class, $result );
		$this->assertEquals( 'rest_invalid_file_type', $result->get_error_code() );
	}

	/**
	 * Test rest_pre_insert_attachment accepts image files.
	 *
	 * @return void
	 */
	public function test_rest_pre_insert_attachment_accepts_image() {
		$wizard = new Onboard_Wizard();

		// Create mock request with image file.
		$request = new \WP_REST_Request( 'POST', '/wp/v2/media' );
		$request->set_param( 'prplFileUpload', true );
		$request->set_file_params(
			[
				'file' => [
					'name' => 'test.png',
					'type' => 'image/png',
				],
			]
		);

		$attachment = [ 'test' => 'data' ];
		$result     = $wizard->rest_pre_insert_attachment( $attachment, $request );

		$this->assertEquals( $attachment, $result );
	}

	/**
	 * Test define_steps_and_order creates badge step.
	 *
	 * @return void
	 */
	public function test_define_steps_includes_badge_step() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();
		$wizard->define_steps_and_order();

		$steps          = $wizard->get_steps();
		$step_templates = \array_column( $steps, 'template_file_name' );

		$this->assertContains( 'badges', $step_templates );
	}

	/**
	 * Test define_steps_and_order includes email frequency step.
	 *
	 * @return void
	 */
	public function test_define_steps_includes_email_frequency_step() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();
		$wizard->define_steps_and_order();

		$steps          = $wizard->get_steps();
		$step_templates = \array_column( $steps, 'template_file_name' );

		$this->assertContains( 'email-frequency', $step_templates );
	}

	/**
	 * Test saved progress is preserved across instances.
	 *
	 * @return void
	 */
	public function test_saved_progress_persistence() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Save progress.
		$progress = [
			'currentStep' => 5,
			'data'        => [
				'firstTaskCompleted' => true,
				'someOtherData'      => 'value',
			],
		];
		\update_option( 'prpl_onboard_progress', \wp_json_encode( $progress ) );

		// Create new wizard instance and get progress.
		$wizard = new Onboard_Wizard();

		$reflection = new \ReflectionClass( $wizard );
		$method     = $reflection->getMethod( 'get_saved_progress' );
		$method->setAccessible( true );

		$result = $method->invoke( $wizard );

		$this->assertIsArray( $result );
		$this->assertEquals( 5, $result['currentStep'] );
		$this->assertTrue( $result['data']['firstTaskCompleted'] );
		$this->assertEquals( 'value', $result['data']['someOtherData'] );
	}

	/**
	 * Test onboarding registers all expected AJAX actions.
	 *
	 * @return void
	 */
	public function test_all_ajax_actions_registered() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		// Ensure privacy is not accepted.
		\delete_option( 'progress_planner_license_key' );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();

		// Check all AJAX actions are registered.
		$expected_actions = [
			'progress_planner_onboarding_complete_task' => 'ajax_complete_task',
			'progress_planner_onboarding_save_progress' => 'ajax_save_onboarding_progress',
			'prpl_save_all_onboarding_settings'         => 'ajax_save_all_onboarding_settings',
		];

		foreach ( $expected_actions as $action => $method ) {
			$this->assertNotFalse(
				\has_action( 'wp_ajax_' . $action, [ $wizard, $method ] ),
				"Expected AJAX action {$action} to be registered"
			);
		}
	}

	/**
	 * Test steps have correct template IDs.
	 *
	 * @return void
	 */
	public function test_steps_have_correct_template_ids() {
		// Set admin user.
		\wp_set_current_user( $this->admin_user_id );

		$wizard = new Onboard_Wizard();
		$wizard->maybe_register_popover_hooks();
		$steps = $wizard->get_steps();

		$expected_ids = [
			'onboarding-step-welcome',
			'onboarding-step-whats-what',
			'onboarding-step-badges',
			'onboarding-step-email-frequency',
			'onboarding-step-settings',
		];

		$template_ids = \array_column( $steps, 'template_id' );

		foreach ( $expected_ids as $expected_id ) {
			$this->assertContains(
				$expected_id,
				$template_ids,
				"Expected template ID {$expected_id} not found"
			);
		}
	}
}
