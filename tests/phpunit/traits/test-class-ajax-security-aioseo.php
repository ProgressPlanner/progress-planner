<?php
/**
 * Test Ajax_Security_AIOSEO trait.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests\Traits;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_AIOSEO;

/**
 * Ajax_Security_AIOSEO test case.
 *
 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_AIOSEO
 */
class Ajax_Security_AIOSEO_Test extends \WP_Ajax_UnitTestCase {

	/**
	 * Mock class that uses the trait.
	 *
	 * @var object
	 */
	protected $mock_class;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Create an anonymous class that uses the trait.
		$this->mock_class = new class() {
			use Ajax_Security_AIOSEO;

			/**
			 * Public wrapper for verify_aioseo_active_or_fail.
			 *
			 * @return void
			 */
			public function public_verify_aioseo_active_or_fail() {
				$this->verify_aioseo_active_or_fail();
			}

			/**
			 * Public wrapper for verify_aioseo_ajax_security.
			 *
			 * @param string $capability The capability to check.
			 * @param string $action     The nonce action.
			 * @param string $field      The nonce field.
			 * @return void
			 */
			public function public_verify_aioseo_ajax_security( $capability = 'manage_options', $action = 'progress_planner', $field = 'nonce' ) {
				$this->verify_aioseo_ajax_security( $capability, $action, $field );
			}
		};
	}

	/**
	 * Test verify_aioseo_active_or_fail when AIOSEO is not active.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_AIOSEO::verify_aioseo_active_or_fail
	 *
	 * @return void
	 */
	public function test_verify_aioseo_active_or_fail_not_active() {
		// Verify aioseo function doesn't exist.
		$this->assertFalse( \function_exists( 'aioseo' ) );

		// WordPress Core's _handleAjax() starts output buffering before calling AJAX actions.
		// We need to do the same since we're calling methods directly.
		// WordPress Core's dieHandler() will call ob_get_clean() to clean this buffer.
		\ini_set( 'implicit_flush', false ); // phpcs:ignore WordPress.PHP.IniSet.Risky
		\ob_start();

		// WP_Ajax_UnitTestCase allows us to test AJAX methods that call wp_send_json_error().
		try {
			$this->mock_class->public_verify_aioseo_active_or_fail();
			$this->fail( 'Expected WPAjaxDieContinueException was not thrown' );
		} catch ( \WPAjaxDieContinueException $e ) {
			// WordPress Core's dieHandler() calls ob_get_clean() which gets output and cleans buffer.
			// Get the response.
			$response = json_decode( $this->_last_response, true );
			$this->assertFalse( $response['success'] );
			$this->assertArrayHasKey( 'data', $response );
			$this->assertArrayHasKey( 'message', $response['data'] );
			$this->assertStringContainsString( 'AIOSEO', $response['data']['message'] );
		}
	}

	/**
	 * Test that the trait uses Ajax_Security_Base.
	 *
	 * This test verifies that base trait methods are available,
	 * indicating Ajax_Security_Base is properly included.
	 *
	 * @return void
	 */
	public function test_uses_base_trait() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Verify base trait methods are available via the AIOSEO trait.
		$this->assertTrue( $reflection->hasMethod( 'verify_nonce_or_fail' ) );
		$this->assertTrue( $reflection->hasMethod( 'verify_capability_or_fail' ) );
		$this->assertTrue( $reflection->hasMethod( 'verify_ajax_security' ) );
	}

	/**
	 * Test that verify_aioseo_ajax_security has correct default parameters.
	 *
	 * @return void
	 */
	public function test_verify_aioseo_ajax_security_default_parameters() {
		$reflection = new \ReflectionClass( $this->mock_class );
		$method     = $reflection->getMethod( 'verify_aioseo_ajax_security' );
		$params     = $method->getParameters();

		$this->assertEquals( 'manage_options', $params[0]->getDefaultValue() );
		$this->assertEquals( 'progress_planner', $params[1]->getDefaultValue() );
		$this->assertEquals( 'nonce', $params[2]->getDefaultValue() );
	}

	/**
	 * Test that methods exist and are protected.
	 *
	 * @return void
	 */
	public function test_methods_exist() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Check verify_aioseo_active_or_fail exists and is protected.
		$this->assertTrue( $reflection->hasMethod( 'verify_aioseo_active_or_fail' ) );
		$method = $reflection->getMethod( 'verify_aioseo_active_or_fail' );
		$this->assertTrue( $method->isProtected() );

		// Check verify_aioseo_ajax_security exists and is protected.
		$this->assertTrue( $reflection->hasMethod( 'verify_aioseo_ajax_security' ) );
		$method = $reflection->getMethod( 'verify_aioseo_ajax_security' );
		$this->assertTrue( $method->isProtected() );
	}

	/**
	 * Test that base trait methods are available.
	 *
	 * @return void
	 */
	public function test_base_trait_methods_available() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Verify base trait methods are available.
		$this->assertTrue( $reflection->hasMethod( 'verify_nonce_or_fail' ) );
		$this->assertTrue( $reflection->hasMethod( 'verify_capability_or_fail' ) );
		$this->assertTrue( $reflection->hasMethod( 'verify_ajax_security' ) );
	}
}
