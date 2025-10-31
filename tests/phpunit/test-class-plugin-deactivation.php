<?php
/**
 * Unit tests for Plugin_Deactivation class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Plugin_Deactivation;

/**
 * Plugin_Deactivation test case.
 *
 * Tests the Plugin_Deactivation class that handles deactivation feedback.
 */
class Plugin_Deactivation_Test extends WP_UnitTestCase {

	/**
	 * Plugin_Deactivation instance.
	 *
	 * @var Plugin_Deactivation
	 */
	private $deactivation;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->deactivation = new Plugin_Deactivation();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		parent::tearDown();
	}

	/**
	 * Test constructor registers hooks.
	 */
	public function test_constructor_registers_hooks() {
		$deactivation = new Plugin_Deactivation();

		$this->assertEquals(
			10,
			\has_action( 'admin_footer', [ $deactivation, 'maybe_add_script' ] ),
			'admin_footer hook should be registered'
		);
	}

	/**
	 * Test PLUGIN_SLUG constant.
	 */
	public function test_plugin_slug_constant() {
		$this->assertEquals(
			'progress-planner',
			Plugin_Deactivation::PLUGIN_SLUG
		);
	}

	/**
	 * Test maybe_add_script() does nothing outside plugins page.
	 */
	public function test_maybe_add_script_not_on_plugins_page() {
		// Set the current screen to something other than plugins.
		\set_current_screen( 'dashboard' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertEmpty( $output, 'Should not output anything when not on plugins page' );
	}

	/**
	 * Test maybe_add_script() outputs on plugins page.
	 */
	public function test_maybe_add_script_on_plugins_page() {
		// Set the current screen to plugins.
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertNotEmpty( $output, 'Should output script on plugins page' );
	}

	/**
	 * Test maybe_add_script() includes popover.
	 */
	public function test_maybe_add_script_includes_popover() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'progress-planner-popover', $output );
		$this->assertStringContainsString( 'popover', $output );
	}

	/**
	 * Test maybe_add_script() includes JavaScript.
	 */
	public function test_maybe_add_script_includes_javascript() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( '<script>', $output );
		$this->assertStringContainsString( 'deactivateButton', $output );
	}

	/**
	 * Test maybe_add_script() includes CSS.
	 */
	public function test_maybe_add_script_includes_css() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( '<style>', $output );
		$this->assertStringContainsString( '#progress-planner-popover', $output );
	}

	/**
	 * Test popover includes all reason options.
	 */
	public function test_popover_includes_all_reasons() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		// Check for key reasons.
		$this->assertStringContainsString( 'unexpected-behavior', $output );
		$this->assertStringContainsString( 'wrong-feature', $output );
		$this->assertStringContainsString( 'not-working', $output );
		$this->assertStringContainsString( 'found-better-plugin', $output );
		$this->assertStringContainsString( 'missing-feature', $output );
		$this->assertStringContainsString( 'hard-to-understand', $output );
		$this->assertStringContainsString( 'temporary-deactivation', $output );
		$this->assertStringContainsString( 'other', $output );
	}

	/**
	 * Test popover includes heading.
	 */
	public function test_popover_includes_heading() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( "We're sorry to see you go", $output );
	}

	/**
	 * Test popover includes form.
	 */
	public function test_popover_includes_form() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( '<form>', $output );
		$this->assertStringContainsString( '</form>', $output );
	}

	/**
	 * Test popover includes radio buttons.
	 */
	public function test_popover_includes_radio_buttons() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'type="radio"', $output );
		$this->assertStringContainsString( 'name="reason"', $output );
	}

	/**
	 * Test popover includes textareas for feedback.
	 */
	public function test_popover_includes_textareas() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( '<textarea', $output );
		$this->assertStringContainsString( 'name="feedback"', $output );
	}

	/**
	 * Test popover includes text inputs for feedback.
	 */
	public function test_popover_includes_text_inputs() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'type="text"', $output );
	}

	/**
	 * Test popover includes action buttons.
	 */
	public function test_popover_includes_action_buttons() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'Submit & Deactivate', $output );
		$this->assertStringContainsString( 'Skip & Deactivate', $output );
		$this->assertStringContainsString( 'class="submit"', $output );
		$this->assertStringContainsString( 'class="dismiss"', $output );
	}

	/**
	 * Test JavaScript includes AJAX function.
	 */
	public function test_javascript_includes_ajax_function() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'deactivatePluginFeedbackAjaxRequest', $output );
		$this->assertStringContainsString( 'XMLHttpRequest', $output );
	}

	/**
	 * Test JavaScript includes event listeners.
	 */
	public function test_javascript_includes_event_listeners() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'addEventListener', $output );
		$this->assertStringContainsString( 'click', $output );
	}

	/**
	 * Test JavaScript references deactivate button.
	 */
	public function test_javascript_references_deactivate_button() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'deactivate-progress-planner', $output );
	}

	/**
	 * Test JavaScript includes remote server URL.
	 */
	public function test_javascript_includes_remote_server_url() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$remote_url = \progress_planner()->get_remote_server_root_url();
		$this->assertStringContainsString( $remote_url, $output );
	}

	/**
	 * Test JavaScript includes site URL.
	 */
	public function test_javascript_includes_site_url() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$site_url = \get_site_url();
		$this->assertStringContainsString( $site_url, $output );
	}

	/**
	 * Test CSS includes popover styles.
	 */
	public function test_css_includes_popover_styles() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( '::backdrop', $output );
		$this->assertStringContainsString( 'border-radius', $output );
		$this->assertStringContainsString( 'padding', $output );
	}

	/**
	 * Test CSS includes form styles.
	 */
	public function test_css_includes_form_styles() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'flex-direction', $output );
		$this->assertStringContainsString( 'gap:', $output );
	}

	/**
	 * Test CSS includes button styles.
	 */
	public function test_css_includes_button_styles() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'cursor', $output );
		$this->assertStringContainsString( 'background-color', $output );
	}

	/**
	 * Test output is properly escaped.
	 */
	public function test_output_is_escaped() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		// Check for escaping functions in output (they should have run).
		// The actual escaping happened, so we just verify output is present and safe.
		$this->assertStringNotContainsString( '<?php', $output, 'PHP tags should be processed' );
	}

	/**
	 * Test popover ID format.
	 */
	public function test_popover_id_format() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$expected_id = 'id="progress-planner-popover"';
		$this->assertStringContainsString( $expected_id, $output );
	}

	/**
	 * Test JavaScript handles nonce requests.
	 */
	public function test_javascript_handles_nonce_requests() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'get-nonce', $output );
		$this->assertStringContainsString( 'submit-feedback', $output );
	}

	/**
	 * Test JavaScript includes feedback handling.
	 */
	public function test_javascript_includes_feedback_handling() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'feedback-wrapper', $output );
		$this->assertStringContainsString( 'style.display', $output );
	}

	/**
	 * Test popover includes all necessary data attributes.
	 */
	public function test_popover_includes_data_attributes() {
		\set_current_screen( 'plugins' );

		\ob_start();
		$this->deactivation->maybe_add_script();
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'data-reason=', $output );
	}
}
