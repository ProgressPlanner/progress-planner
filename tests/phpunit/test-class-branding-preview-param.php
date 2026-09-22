<?php
/**
 * Test that the `pp_branding_id` preview URL param is honoured only for
 * logged-in users.
 *
 * Regression test for the 1.10.0 release audit finding S3: an anonymous
 * visitor could set `?pp_branding_id=N` to force a non-zero branding ID,
 * which in turn could trigger the auto-onboard remote call and a stored
 * license key in `Base::init()`. The param is a preview seam and must only
 * be honoured for logged-in users.
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
		unset( $_GET['pp_branding_id'] );
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
	 * A logged-in admin can still use the param to preview branding.
	 *
	 * @return void
	 */
	public function test_logged_in_admin_param_is_honoured() {
		$admin = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin );
		$_GET['pp_branding_id'] = '4958';

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
}
