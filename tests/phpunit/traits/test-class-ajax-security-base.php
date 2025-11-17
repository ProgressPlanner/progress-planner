<?php
/**
 * Test Ajax_Security_Base trait.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests\Traits;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base;

/**
 * Ajax_Security_Base test case.
 *
 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base
 */
class Ajax_Security_Base_Test extends \WP_Ajax_UnitTestCase {

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
			use Ajax_Security_Base;

			/**
			 * Public wrapper for verify_nonce_or_fail.
			 *
			 * @param string $action The nonce action.
			 * @param string $field  The nonce field.
			 * @return void
			 */
			public function public_verify_nonce_or_fail( $action = 'progress_planner', $field = 'nonce' ) {
				$this->verify_nonce_or_fail( $action, $field );
			}

			/**
			 * Public wrapper for verify_capability_or_fail.
			 *
			 * @param string $capability The capability to check.
			 * @return void
			 */
			public function public_verify_capability_or_fail( $capability = 'manage_options' ) {
				$this->verify_capability_or_fail( $capability );
			}

			/**
			 * Public wrapper for verify_ajax_security.
			 *
			 * @param string $capability The capability to check.
			 * @param string $action     The nonce action.
			 * @param string $field      The nonce field.
			 * @return void
			 */
			public function public_verify_ajax_security( $capability = 'manage_options', $action = 'progress_planner', $field = 'nonce' ) {
				$this->verify_ajax_security( $capability, $action, $field );
			}
		};
	}

	/**
	 * Test verify_nonce_or_fail with valid nonce.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_nonce_or_fail
	 *
	 * @return void
	 */
	public function test_verify_nonce_or_fail_valid() {
		// Create a valid nonce.
		$nonce             = \wp_create_nonce( 'progress_planner' );
		$_REQUEST['nonce'] = $nonce;

		// This should not throw an exception or send JSON error.
		$this->mock_class->public_verify_nonce_or_fail();

		// If we get here, the test passed.
		$this->assertTrue( true );

		// Clean up.
		unset( $_REQUEST['nonce'] );
	}

	/**
	 * Test verify_nonce_or_fail with invalid nonce.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_nonce_or_fail
	 *
	 * @return void
	 */
	public function test_verify_nonce_or_fail_invalid() {
		$_REQUEST['nonce'] = 'invalid_nonce';

		// WordPress Core's _handleAjax() starts output buffering before calling AJAX actions.
		// We need to do the same since we're calling methods directly.
		// WordPress Core's dieHandler() will call ob_get_clean() to clean this buffer.
		\ini_set( 'implicit_flush', false ); // phpcs:ignore WordPress.PHP.IniSet.Risky
		\ob_start();

		// WP_Ajax_UnitTestCase allows us to test AJAX methods that call wp_send_json_error().
		try {
			$this->mock_class->public_verify_nonce_or_fail();
			$this->fail( 'Expected WPAjaxDieContinueException was not thrown' );
		} catch ( \WPAjaxDieContinueException $e ) {
			// WordPress Core's dieHandler() calls ob_get_clean() which gets output and cleans buffer.
			// Get the response.
			$response = json_decode( $this->_last_response, true );
			$this->assertFalse( $response['success'] );
			$this->assertArrayHasKey( 'data', $response );
			$this->assertArrayHasKey( 'message', $response['data'] );
		}

		// Clean up.
		unset( $_REQUEST['nonce'] );
	}

	/**
	 * Test verify_capability_or_fail with admin user.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_capability_or_fail
	 *
	 * @return void
	 */
	public function test_verify_capability_or_fail_admin() {
		// Create an admin user.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// This should not throw an exception.
		$this->mock_class->public_verify_capability_or_fail();

		// If we get here, the test passed.
		$this->assertTrue( true );
	}

	/**
	 * Test verify_capability_or_fail with non-admin user.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_capability_or_fail
	 * @return void
	 */
	public function test_verify_capability_or_fail_non_admin() {
		// Create a subscriber user.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $user_id );

		// WordPress Core's _handleAjax() starts output buffering before calling AJAX actions.
		// We need to do the same since we're calling methods directly.
		// WordPress Core's dieHandler() will call ob_get_clean() to clean this buffer.
		\ini_set( 'implicit_flush', false ); // phpcs:ignore WordPress.PHP.IniSet.Risky
		\ob_start();

		// WP_Ajax_UnitTestCase allows us to test AJAX methods that call wp_send_json_error().
		try {
			$this->mock_class->public_verify_capability_or_fail();
			$this->fail( 'Expected WPAjaxDieContinueException was not thrown' );
		} catch ( \WPAjaxDieContinueException $e ) {
			// WordPress Core's dieHandler() calls ob_get_clean() which gets output and cleans buffer.
			// Get the response.
			$response = json_decode( $this->_last_response, true );
			$this->assertFalse( $response['success'] );
			$this->assertArrayHasKey( 'data', $response );
			$this->assertArrayHasKey( 'message', $response['data'] );
			$this->assertStringContainsString( 'permission', $response['data']['message'] );
		}
	}

	/**
	 * Test verify_ajax_security with valid conditions.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_ajax_security
	 * @return void
	 */
	public function test_verify_ajax_security_valid() {
		// Create an admin user.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// Create a valid nonce.
		$nonce             = \wp_create_nonce( 'progress_planner' );
		$_REQUEST['nonce'] = $nonce;

		// This should not throw an exception.
		$this->mock_class->public_verify_ajax_security();

		// If we get here, the test passed.
		$this->assertTrue( true );

		// Clean up.
		unset( $_REQUEST['nonce'] );
	}

	/**
	 * Test that methods have correct default parameters.
	 *
	 * @return void
	 */
	public function test_default_parameters() {
		$reflection = new \ReflectionClass( $this->mock_class );

		// Check verify_nonce_or_fail defaults.
		$method = $reflection->getMethod( 'verify_nonce_or_fail' );
		$params = $method->getParameters();
		$this->assertEquals( 'progress_planner', $params[0]->getDefaultValue() );
		$this->assertEquals( 'nonce', $params[1]->getDefaultValue() );

		// Check verify_capability_or_fail defaults.
		$method = $reflection->getMethod( 'verify_capability_or_fail' );
		$params = $method->getParameters();
		$this->assertEquals( 'manage_options', $params[0]->getDefaultValue() );

		// Check verify_ajax_security defaults.
		$method = $reflection->getMethod( 'verify_ajax_security' );
		$params = $method->getParameters();
		$this->assertEquals( 'manage_options', $params[0]->getDefaultValue() );
		$this->assertEquals( 'progress_planner', $params[1]->getDefaultValue() );
		$this->assertEquals( 'nonce', $params[2]->getDefaultValue() );
	}

	/**
	 * Test verify_nonce_or_fail with various valid configurations.
	 *
	 * @dataProvider provider_valid_nonce_configurations
	 *
	 * @param string $action The nonce action.
	 * @param string $field  The nonce field name.
	 *
	 * @return void
	 */
	public function test_verify_nonce_or_fail_valid_configurations( $action, $field ) {
		// Create a valid nonce.
		$nonce              = \wp_create_nonce( $action );
		$_REQUEST[ $field ] = $nonce;

		// This should not throw an exception.
		$this->mock_class->public_verify_nonce_or_fail( $action, $field );

		// If we get here, the test passed.
		$this->assertTrue( true );

		// Clean up.
		unset( $_REQUEST[ $field ] );
	}

	/**
	 * Data provider for valid nonce configurations.
	 *
	 * @return array
	 */
	public function provider_valid_nonce_configurations() {
		return [
			'custom_action'       => [ 'custom_action', 'nonce' ],
			'custom_field'        => [ 'progress_planner', 'custom_nonce' ],
			'custom_action_field' => [ 'my_action', 'my_nonce' ],
			'underscored_action'  => [ 'my_custom_action', 'nonce' ],
			'hyphenated_field'    => [ 'progress_planner', 'my-custom-nonce' ],
		];
	}

	/**
	 * Test verify_nonce_or_fail with missing nonce field.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_nonce_or_fail
	 * @return void
	 */
	public function test_verify_nonce_or_fail_missing_field() {
		// Don't set any nonce field.
		$result = \check_ajax_referer( 'progress_planner', 'nonce', false );
		$this->assertFalse( $result );
	}

	/**
	 * Test verify_capability_or_fail with various capabilities and roles.
	 *
	 * @dataProvider provider_valid_capability_role_combinations
	 *
	 * @param string $role       The user role.
	 * @param string $capability The capability to check.
	 *
	 * @return void
	 */
	public function test_verify_capability_or_fail_valid_combinations( $role, $capability ) {
		// Create a user with the specified role.
		$user_id = $this->factory->user->create( [ 'role' => $role ] );
		\wp_set_current_user( $user_id );

		// This should not throw an exception.
		$this->mock_class->public_verify_capability_or_fail( $capability );

		// If we get here, the test passed.
		$this->assertTrue( true );
	}

	/**
	 * Data provider for valid capability and role combinations.
	 *
	 * @return array
	 */
	public function provider_valid_capability_role_combinations() {
		return [
			'admin_manage_options'   => [ 'administrator', 'manage_options' ],
			'editor_edit_posts'      => [ 'editor', 'edit_posts' ],
			'editor_edit_pages'      => [ 'editor', 'edit_pages' ],
			'editor_publish_posts'   => [ 'editor', 'publish_posts' ],
			'author_edit_posts'      => [ 'author', 'edit_posts' ],
			'contributor_edit_posts' => [ 'contributor', 'edit_posts' ],
		];
	}

	/**
	 * Test verify_capability_or_fail with no user logged in.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_capability_or_fail
	 * @return void
	 */
	public function test_verify_capability_or_fail_no_user() {
		// Set current user to 0 (not logged in).
		\wp_set_current_user( 0 );

		// Verify user cannot manage options.
		$this->assertFalse( \current_user_can( 'manage_options' ) );
	}

	/**
	 * Test verify_ajax_security with invalid nonce.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_ajax_security
	 * @return void
	 */
	public function test_verify_ajax_security_invalid_nonce() {
		// Create an admin user.
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		// Set invalid nonce.
		$_REQUEST['nonce'] = 'invalid_nonce';

		// Verify the nonce check would fail.
		$result = \check_ajax_referer( 'progress_planner', 'nonce', false );
		$this->assertFalse( $result );

		// Clean up.
		unset( $_REQUEST['nonce'] );
	}

	/**
	 * Test verify_ajax_security with insufficient permissions.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_ajax_security
	 * @return void
	 */
	public function test_verify_ajax_security_insufficient_permissions() {
		// Create a subscriber user.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $user_id );

		// Create a valid nonce.
		$nonce             = \wp_create_nonce( 'progress_planner' );
		$_REQUEST['nonce'] = $nonce;

		// Verify user cannot manage options.
		$this->assertFalse( \current_user_can( 'manage_options' ) );

		// Clean up.
		unset( $_REQUEST['nonce'] );
	}

	/**
	 * Test verify_ajax_security with custom parameters.
	 *
	 * @covers \Progress_Planner\Suggested_Tasks\Providers\Traits\Ajax_Security_Base::verify_ajax_security
	 * @return void
	 */
	public function test_verify_ajax_security_custom_parameters() {
		// Create an editor user.
		$user_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $user_id );

		// Create a valid nonce with custom action.
		$nonce                    = \wp_create_nonce( 'custom_action' );
		$_REQUEST['custom_nonce'] = $nonce;

		// This should not throw an exception.
		$this->mock_class->public_verify_ajax_security( 'edit_posts', 'custom_action', 'custom_nonce' );

		// If we get here, the test passed.
		$this->assertTrue( true );

		// Clean up.
		unset( $_REQUEST['custom_nonce'] );
	}
}
