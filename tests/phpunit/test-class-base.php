<?php
/**
 * Class Base_Test
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Base;

/**
 * Base_Test test case.
 */
class Base_Test extends \WP_UnitTestCase {

	/**
	 * Base instance.
	 *
	 * @var Base
	 */
	protected $base;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->base = \progress_planner();
	}

	/**
	 * Test SCORE_TARGET constant.
	 *
	 * @return void
	 */
	public function test_score_target_constant() {
		$this->assertEquals( 200, Base::SCORE_TARGET );
	}

	/**
	 * Test get_remote_server_root_url returns default.
	 *
	 * @return void
	 */
	public function test_get_remote_server_root_url_default() {
		$url = $this->base->get_remote_server_root_url();
		$this->assertEquals( 'https://progressplanner.com', $url );
	}

	/**
	 * Test get_placeholder_svg generates valid SVG.
	 *
	 * @return void
	 */
	public function test_get_placeholder_svg() {
		$svg = $this->base->get_placeholder_svg( 1200, 675 );

		$this->assertStringStartsWith( 'data:image/svg+xml;base64,', $svg );
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Testing SVG encoding, not obfuscation
		$this->assertStringContainsString( 'progressplanner.com', \base64_decode( \substr( $svg, 26 ) ) );
	}

	/**
	 * Test get_placeholder_svg with custom dimensions.
	 *
	 * @return void
	 */
	public function test_get_placeholder_svg_custom_dimensions() {
		$svg = $this->base->get_placeholder_svg( 800, 600 );

		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- Testing SVG encoding, not obfuscation
		$decoded = \base64_decode( \substr( $svg, 26 ) );
		$this->assertStringContainsString( 'width="800"', $decoded );
		$this->assertStringContainsString( 'height="600"', $decoded );
	}

	/**
	 * Test get_activation_date returns DateTime.
	 *
	 * @return void
	 */
	public function test_get_activation_date() {
		$date = $this->base->get_activation_date();
		$this->assertInstanceOf( \DateTime::class, $date );
	}

	/**
	 * Test get_activation_date creates setting if not exists.
	 *
	 * @return void
	 */
	public function test_get_activation_date_creates_setting() {
		// Delete existing setting.
		$this->base->get_settings()->delete( 'activation_date' );

		$date = $this->base->get_activation_date();

		$this->assertInstanceOf( \DateTime::class, $date );
		$this->assertNotNull( $this->base->get_settings()->get( 'activation_date' ) );
	}

	/**
	 * Test is_privacy_policy_accepted when no license.
	 *
	 * @return void
	 */
	public function test_is_privacy_policy_accepted_no_license() {
		\delete_option( 'progress_planner_license_key' );

		$result = $this->base->is_privacy_policy_accepted();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_privacy_policy_accepted with license.
	 *
	 * @return void
	 */
	public function test_is_privacy_policy_accepted_with_license() {
		\update_option( 'progress_planner_license_key', 'test-key' );

		$result = $this->base->is_privacy_policy_accepted();
		$this->assertTrue( $result );

		\delete_option( 'progress_planner_license_key' );
	}

	/**
	 * Test add_action_links adds dashboard link.
	 *
	 * @return void
	 */
	public function test_add_action_links() {
		$actions = [ 'deactivate' => 'Deactivate' ];
		$result  = $this->base->add_action_links( $actions );

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertStringContainsString( 'Dashboard', \reset( $result ) );
		$this->assertStringContainsString( 'admin.php?page=progress-planner', \reset( $result ) );
	}

	/**
	 * Test is_local_site with localhost.
	 *
	 * @return void
	 */
	public function test_is_local_site_localhost() {
		\add_filter(
			'home_url',
			function () {
				return 'http://localhost';
			}
		);

		$result = $this->base->is_local_site();
		$this->assertTrue( $result );

		\remove_all_filters( 'home_url' );
	}

	/**
	 * Test is_local_site with .local TLD.
	 *
	 * @return void
	 */
	public function test_is_local_site_local_tld() {
		\add_filter(
			'home_url',
			function () {
				return 'http://mysite.local';
			}
		);

		$result = $this->base->is_local_site();
		$this->assertTrue( $result );

		\remove_all_filters( 'home_url' );
	}

	/**
	 * Test is_local_site with .test TLD.
	 *
	 * @return void
	 */
	public function test_is_local_site_test_tld() {
		\add_filter(
			'home_url',
			function () {
				return 'http://mysite.test';
			}
		);

		$result = $this->base->is_local_site();
		$this->assertTrue( $result );

		\remove_all_filters( 'home_url' );
	}

	/**
	 * Test is_local_site with production domain.
	 *
	 * @return void
	 */
	public function test_is_local_site_production() {
		\add_filter(
			'home_url',
			function () {
				return 'https://example.com';
			}
		);

		$result = $this->base->is_local_site();
		$this->assertFalse( $result );

		\remove_all_filters( 'home_url' );
	}

	/**
	 * Test is_on_progress_planner_dashboard_page when not on page.
	 *
	 * @return void
	 */
	public function test_is_on_progress_planner_dashboard_page_false() {
		$result = $this->base->is_on_progress_planner_dashboard_page();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_debug_mode_enabled when debug is off.
	 *
	 * @return void
	 */
	public function test_is_debug_mode_enabled_false() {
		\delete_option( 'prpl_debug' );
		$result = $this->base->is_debug_mode_enabled();
		$this->assertFalse( $result );
	}

	/**
	 * Test is_debug_mode_enabled when option is set.
	 *
	 * @return void
	 */
	public function test_is_debug_mode_enabled_with_option() {
		\update_option( 'prpl_debug', true );
		$result = $this->base->is_debug_mode_enabled();
		$this->assertTrue( $result );
		\delete_option( 'prpl_debug' );
	}

	/**
	 * Test __call magic method with valid getter.
	 *
	 * @return void
	 */
	public function test_magic_call_valid_getter() {
		$settings = $this->base->get_settings();
		$this->assertInstanceOf( \Progress_Planner\Settings::class, $settings );
	}

	/**
	 * Test __call returns cached instance.
	 *
	 * @return void
	 */
	public function test_magic_call_returns_cached() {
		$settings1 = $this->base->get_settings();
		$settings2 = $this->base->get_settings();

		$this->assertSame( $settings1, $settings2 );
	}

	/**
	 * Test __call with non-getter method.
	 *
	 * @return void
	 */
	public function test_magic_call_non_getter() {
		$result = $this->base->some_random_method();
		$this->assertNull( $result );
	}

	/**
	 * Test get_file_version returns string.
	 *
	 * @return void
	 */
	public function test_get_file_version() {
		$version = $this->base->get_file_version( PROGRESS_PLANNER_FILE );
		$this->assertIsString( $version );
		$this->assertNotEmpty( $version );
	}

	/**
	 * Test redirect_on_login requires manage_options cap.
	 *
	 * @return void
	 */
	public function test_redirect_on_login_requires_cap() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'subscriber' ] );
		\update_user_meta( $user->ID, 'prpl_redirect_on_login', true );

		// Should not redirect (method returns early).
		$this->base->redirect_on_login( $user->user_login, $user );

		// If we get here, no redirect occurred (expected).
		$this->assertTrue( true );

		\wp_delete_user( $user->ID );
	}

	/**
	 * Test redirect_on_login requires meta.
	 *
	 * @return void
	 */
	public function test_redirect_on_login_requires_meta() {
		$user = $this->factory->user->create_and_get( [ 'role' => 'administrator' ] );
		\delete_user_meta( $user->ID, 'prpl_redirect_on_login' );

		// Should not redirect (method returns early).
		$this->base->redirect_on_login( $user->user_login, $user );

		// If we get here, no redirect occurred (expected).
		$this->assertTrue( true );

		\wp_delete_user( $user->ID );
	}

	/**
	 * Test the_view returns content.
	 *
	 * @return void
	 */
	public function test_the_view() {
		// Create a temporary view file.
		$temp_file = \PROGRESS_PLANNER_DIR . '/views/test-view.php';
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- Test file creation
		\file_put_contents( $temp_file, '<?php echo "test content"; ?>' );

		$content = $this->base->the_view( 'test-view.php', [], true );
		$this->assertEquals( 'test content', $content );

		// Clean up.
		// phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink -- Test file cleanup
		\unlink( $temp_file );
	}

	/**
	 * Test the_view with args.
	 *
	 * @return void
	 */
	public function test_the_view_with_args() {
		// Create a temporary view file.
		$temp_file = \PROGRESS_PLANNER_DIR . '/views/test-view-args.php';
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- Test file creation
		\file_put_contents( $temp_file, '<?php echo $test_var; ?>' );

		$content = $this->base->the_view( 'test-view-args.php', [ 'test_var' => 'hello world' ], true );
		$this->assertEquals( 'hello world', $content );

		// Clean up.
		// phpcs:ignore WordPress.WP.AlternativeFunctions.unlink_unlink -- Test file cleanup
		\unlink( $temp_file );
	}

	/**
	 * Test is_local_site with IP address.
	 *
	 * @return void
	 */
	public function test_is_local_site_ip_address() {
		\add_filter(
			'home_url',
			function () {
				return 'http://192.168.1.1';
			}
		);

		$result = $this->base->is_local_site();
		$this->assertTrue( $result );

		\remove_all_filters( 'home_url' );
	}

	/**
	 * Test is_local_site with staging subdomain.
	 *
	 * @return void
	 */
	public function test_is_local_site_staging_subdomain() {
		\add_filter(
			'home_url',
			function () {
				return 'http://staging-12345.example.com';
			}
		);

		$result = $this->base->is_local_site();
		$this->assertTrue( $result ); // staging-*.  matches the pattern.

		\remove_all_filters( 'home_url' );
	}
}
