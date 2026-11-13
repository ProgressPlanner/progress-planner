<?php
/**
 * Test that branding previews require an administrator and a nonce, and never
 * select branding for automatic onboarding.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Branding_Preview_Param_Test
 */
class Branding_Preview_Param_Test extends \WP_UnitTestCase {

	/**
	 * Clean up the request param and current user after each test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		unset( $_GET['pp_branding_id'], $_GET['_pp_branding_nonce'] );
		\wp_set_current_user( 0 );
		parent::tearDown();
	}

	/**
	 * An anonymous visitor cannot steer the branding ID via the URL param.
	 *
	 * @return void
	 */
	public function test_anonymous_param_is_ignored() {
		\wp_set_current_user( 0 );
		$_GET['pp_branding_id'] = '4958';

		$branding_id = \progress_planner()->get_ui__branding()->get_branding_id();

		$this->assertSame(
			0,
			$branding_id,
			'anonymous pp_branding_id must be ignored (default 0), got ' . $branding_id
		);
	}

	/**
	 * An administrator can use a signed URL to preview branding.
	 *
	 * @return void
	 */
	public function test_logged_in_admin_param_is_honoured() {
		$admin = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin );
		$_GET['pp_branding_id']     = '4958';
		$_GET['_pp_branding_nonce'] = \wp_create_nonce( 'pp_branding_preview_4958' );

		$branding_id = \progress_planner()->get_ui__branding()->get_branding_id();

		$this->assertSame(
			4958,
			$branding_id,
			'logged-in admin pp_branding_id should be honoured'
		);
	}

	/**
	 * A logged-in non-admin (e.g. subscriber) must NOT be able to steer the
	 * branding ID: the param is gated on `manage_options`, since a non-zero
	 * branding ID can trigger the auto-onboard remote call.
	 *
	 * @return void
	 */
	public function test_logged_in_subscriber_param_is_ignored() {
		$subscriber = self::factory()->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber );
		$_GET['pp_branding_id'] = '4958';

		$branding_id = \progress_planner()->get_ui__branding()->get_branding_id();

		$this->assertSame( 0, $branding_id, 'a subscriber must not be able to set pp_branding_id' );
	}
	/**
	 * An unsigned admin link cannot select branding or grant onboarding consent.
	 *
	 * @return void
	 */
	public function test_admin_preview_requires_nonce_and_never_auto_onboards() {
		\wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$_GET['pp_branding_id'] = '4958';
		$branding               = \progress_planner()->get_ui__branding();
		$this->assertSame( 0, $branding->get_branding_id() );
		$_GET['_pp_branding_nonce'] = \wp_create_nonce( 'pp_branding_preview_4958' );
		$this->assertSame( 4958, $branding->get_branding_id() );
		$this->assertSame( 0, $branding->get_branding_id( false ) );
		$_GET['pp_branding_id'] = '5938';
		$this->assertSame( 0, $branding->get_branding_id() );
	}
}
