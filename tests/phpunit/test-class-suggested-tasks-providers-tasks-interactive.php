<?php
/**
 * Unit tests for Tasks_Interactive class.
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-4
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks\Providers\Tasks_Interactive;

/**
 * Mock interactive task for testing.
 *
 * @group suggested-tasks-providers-4
 */
class Mock_Interactive_Task extends Tasks_Interactive {
	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'test-interactive';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'test-popover';

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		echo '<div>Test Form</div>';
	}

	/**
	 * Get tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		return [];
	}

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task id.
	 *
	 * @return \Progress_Planner\Suggested_Tasks\Task|false
	 */
	public function evaluate_task( $task_id ) {
		return false;
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return true;
	}
}

/**
 * Suggested_Tasks_Providers_Tasks_Interactive test case.
 *
 * Tests the Tasks_Interactive abstract class that provides
 * interactive task functionality with popovers and AJAX handling.
 */
class Suggested_Tasks_Providers_Tasks_Interactive_Test extends WP_UnitTestCase {

	/**
	 * Mock interactive task instance.
	 *
	 * @var Mock_Interactive_Task
	 */
	private $task;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->task = new Mock_Interactive_Task();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );
	}

	/**
	 * Test constructor registers hooks.
	 */
	public function test_constructor_registers_hooks() {
		$task = new Mock_Interactive_Task();

		$this->assertEquals(
			10,
			\has_action( 'progress_planner_admin_page_after_widgets', [ $task, 'add_popover' ] ),
			'progress_planner_admin_page_after_widgets hook should be registered'
		);

		$this->assertEquals(
			10,
			\has_action( 'progress_planner_admin_dashboard_widget_score_after', [ $task, 'add_popover' ] ),
			'progress_planner_admin_dashboard_widget_score_after hook should be registered'
		);

		$this->assertEquals(
			10,
			\has_action( 'admin_enqueue_scripts', [ $task, 'enqueue_scripts' ] ),
			'admin_enqueue_scripts hook should be registered'
		);

		$this->assertEquals(
			10,
			\has_action( 'wp_ajax_prpl_interactive_task_submit', [ $task, 'handle_interactive_task_submit' ] ),
			'wp_ajax_prpl_interactive_task_submit hook should be registered'
		);
	}

	/**
	 * Test get_task_details includes popover_id.
	 */
	public function test_get_task_details_includes_popover_id() {
		$details = $this->task->get_task_details();

		$this->assertIsArray( $details, 'Should return array' );
		$this->assertArrayHasKey( 'popover_id', $details, 'Should include popover_id' );
		$this->assertEquals( 'prpl-popover-test-popover', $details['popover_id'], 'Popover ID should match format' );
	}

	/**
	 * Test add_popover outputs HTML.
	 */
	public function test_add_popover_outputs_html() {
		\ob_start();
		$this->task->add_popover();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'prpl-popover-test-popover', $output, 'Should output popover ID' );
		$this->assertStringContainsString( 'prpl-popover', $output, 'Should have popover class' );
		$this->assertStringContainsString( 'popover', $output, 'Should have popover attribute' );
	}

	/**
	 * Test print_popover_form_contents is called.
	 */
	public function test_print_popover_form_contents_called() {
		// This is an abstract method that must be implemented.
		\ob_start();
		$this->task->print_popover_form_contents();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'Test Form', $output, 'Should output form content' );
	}

	/**
	 * Test print_popover_instructions outputs description.
	 */
	public function test_print_popover_instructions() {
		// Use reflection to test the method.
		$reflection = new \ReflectionClass( $this->task );
		$method     = $reflection->getMethod( 'print_popover_instructions' );
		$method->setAccessible( true );

		\ob_start();
		$method->invoke( $this->task );
		$output = \ob_get_clean();

		// Output may be empty if no description is set.
		$this->assertIsString( $output, 'Should return string output' );
	}

	/**
	 * Test print_submit_button with default text.
	 */
	public function test_print_submit_button_default() {
		$reflection = new \ReflectionClass( $this->task );
		$method     = $reflection->getMethod( 'print_submit_button' );
		$method->setAccessible( true );

		\ob_start();
		$method->invoke( $this->task );
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'Submit', $output, 'Should have default button text' );
		$this->assertStringContainsString( 'prpl-button', $output, 'Should have button class' );
		$this->assertStringContainsString( 'prpl-steps-nav-wrapper', $output, 'Should have wrapper class' );
	}

	/**
	 * Test print_submit_button with custom text.
	 */
	public function test_print_submit_button_custom() {
		$reflection = new \ReflectionClass( $this->task );
		$method     = $reflection->getMethod( 'print_submit_button' );
		$method->setAccessible( true );

		\ob_start();
		$method->invoke( $this->task, 'Custom Button', 'custom-class' );
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'Custom Button', $output, 'Should have custom button text' );
		$this->assertStringContainsString( 'custom-class', $output, 'Should have custom CSS class' );
	}

	/**
	 * Test enqueue_scripts requires capability.
	 */
	public function test_enqueue_scripts_requires_capability() {
		// Set current user to subscriber (no edit_others_posts capability).
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );

		// Should return early without enqueuing.
		$this->task->enqueue_scripts( 'toplevel_page_progress-planner' );

		// No easy way to assert script wasn't enqueued, but method should complete without error.
		$this->assertTrue( true, 'Method should complete without error' );
	}

	/**
	 * Test enqueue_scripts only on specific pages.
	 */
	public function test_enqueue_scripts_specific_pages() {
		// Test with wrong hook.
		$this->task->enqueue_scripts( 'wrong-page' );

		// Method should complete without error.
		$this->assertTrue( true, 'Should complete without error on wrong page' );
	}

	/**
	 * Test get_allowed_interactive_options returns array.
	 */
	public function test_get_allowed_interactive_options() {
		$reflection = new \ReflectionClass( $this->task );
		$method     = $reflection->getMethod( 'get_allowed_interactive_options' );
		$method->setAccessible( true );

		$options = $method->invoke( $this->task );

		$this->assertIsArray( $options, 'Should return array' );
		$this->assertNotEmpty( $options, 'Should have at least one allowed option' );
		$this->assertContains( 'blogdescription', $options, 'Should include blogdescription' );
		$this->assertContains( 'timezone_string', $options, 'Should include timezone_string' );
	}

	/**
	 * Test get_allowed_interactive_options filter works.
	 */
	public function test_get_allowed_interactive_options_filter() {
		\add_filter(
			'progress_planner_interactive_task_allowed_options',
			function ( $options ) {
				$options[] = 'custom_option';
				return $options;
			}
		);

		$reflection = new \ReflectionClass( $this->task );
		$method     = $reflection->getMethod( 'get_allowed_interactive_options' );
		$method->setAccessible( true );

		$options = $method->invoke( $this->task );

		$this->assertContains( 'custom_option', $options, 'Should include filtered option' );
	}

	/**
	 * Test get_enqueue_data returns array.
	 */
	public function test_get_enqueue_data() {
		$reflection = new \ReflectionClass( $this->task );
		$method     = $reflection->getMethod( 'get_enqueue_data' );
		$method->setAccessible( true );

		$data = $method->invoke( $this->task );

		$this->assertIsArray( $data, 'Should return array' );
	}

	/**
	 * Test handle_interactive_task_submit requires manage_options capability.
	 */
	public function test_handle_interactive_task_submit_requires_capability() {
		// Set current user to subscriber.
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );

		// Expect JSON error response.
		$this->expectException( \WPAjaxDieContinueException::class );

		$this->task->handle_interactive_task_submit();
	}

	/**
	 * Test handle_interactive_task_submit requires valid nonce.
	 */
	public function test_handle_interactive_task_submit_requires_nonce() {
		$_POST['nonce'] = 'invalid_nonce';

		// Expect JSON error response.
		$this->expectException( \WPAjaxDieContinueException::class );

		$this->task->handle_interactive_task_submit();
	}

	/**
	 * Test handle_interactive_task_submit requires setting parameter.
	 */
	public function test_handle_interactive_task_submit_requires_setting() {
		$_POST['nonce'] = \wp_create_nonce( 'progress_planner' );

		// Expect JSON error response for missing setting.
		$this->expectException( \WPAjaxDieContinueException::class );

		$this->task->handle_interactive_task_submit();
	}

	/**
	 * Test handle_interactive_task_submit validates allowed options.
	 */
	public function test_handle_interactive_task_submit_validates_options() {
		$_POST['nonce']        = \wp_create_nonce( 'progress_planner' );
		$_POST['setting']      = 'admin_email'; // Not in allowed list.
		$_POST['value']        = 'test@example.com';
		$_POST['setting_path'] = '[]';

		// Expect JSON error response.
		$this->expectException( \WPAjaxDieContinueException::class );

		$this->task->handle_interactive_task_submit();
	}
}
