<?php
/**
 * Class Sunset_Notice_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Sunset_Notice;

/**
 * Sunset notice test case.
 */
class Sunset_Notice_Test extends \WP_UnitTestCase {

	/**
	 * Clean up after each test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		\remove_all_filters( 'progress_planner_show_sunset_notice' );
		\remove_all_actions( 'progress_planner_admin_page_header_before' );
		\remove_all_actions( 'after_plugin_row_' . \plugin_basename( \PROGRESS_PLANNER_FILE ) );
		parent::tearDown();
	}

	/**
	 * Test that should_show returns true in a clean install.
	 *
	 * @return void
	 */
	public function test_should_show_by_default() {
		$notice = new Sunset_Notice();
		$this->assertTrue( $notice->should_show() );
	}

	/**
	 * Test that hooks are registered on instantiation in a clean install.
	 *
	 * @return void
	 */
	public function test_hooks_registered_by_default() {
		$notice = new Sunset_Notice();
		$this->assertNotFalse( \has_action( 'progress_planner_admin_page_header_before', [ $notice, 'the_dashboard_notice' ] ) );
		$this->assertNotFalse( \has_action( 'after_plugin_row_' . \plugin_basename( \PROGRESS_PLANNER_FILE ), [ $notice, 'the_plugin_row_notice' ] ) );
	}

	/**
	 * Test that hooks are not registered when the filter hides the notice.
	 *
	 * @return void
	 */
	public function test_hooks_not_registered_when_filtered_out() {
		\add_filter( 'progress_planner_show_sunset_notice', '__return_false' );
		$notice = new Sunset_Notice();
		$this->assertFalse( $notice->should_show() );
		$this->assertFalse( \has_action( 'progress_planner_admin_page_header_before', [ $notice, 'the_dashboard_notice' ] ) );
		$this->assertFalse( \has_action( 'after_plugin_row_' . \plugin_basename( \PROGRESS_PLANNER_FILE ), [ $notice, 'the_plugin_row_notice' ] ) );
	}

	/**
	 * Test that the message is not empty and contains no links.
	 *
	 * @return void
	 */
	public function test_message_has_no_links() {
		$notice = new Sunset_Notice();
		$this->assertNotEmpty( $notice->get_message() );
		$this->assertStringNotContainsString( '<a ', $notice->get_message() );
	}

	/**
	 * Test the plugin-row notice output.
	 *
	 * @return void
	 */
	public function test_plugin_row_notice_output() {
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		if ( \is_multisite() ) {
			\grant_super_admin( $user_id );
		}
		\wp_set_current_user( $user_id );

		$notice = new Sunset_Notice();
		\ob_start();
		$notice->the_plugin_row_notice( \plugin_basename( \PROGRESS_PLANNER_FILE ), [] );
		$output = \ob_get_clean();

		$this->assertStringContainsString( 'plugin-update-tr', $output );
		$this->assertStringContainsString( 'notice-warning', $output );
		$this->assertStringContainsString( Sunset_Notice::CERTIFICATE_ACTION, $output );
	}

	/**
	 * Test that the certificate endpoint is registered on instantiation.
	 *
	 * @return void
	 */
	public function test_certificate_endpoint_registered() {
		$notice = new Sunset_Notice();
		$this->assertNotFalse( \has_action( 'admin_post_' . Sunset_Notice::CERTIFICATE_ACTION, [ $notice, 'render_certificate' ] ) );
	}

	/**
	 * Test that get_completed_badges only returns badges with 100% progress.
	 *
	 * @return void
	 */
	public function test_get_completed_badges_are_complete() {
		$notice = new Sunset_Notice();
		$badges = $notice->get_completed_badges();
		$this->assertIsArray( $badges );
		foreach ( $badges as $badge ) {
			$this->assertInstanceOf( \Progress_Planner\Badges\Badge::class, $badge );
			$this->assertSame( 100, (int) $badge->get_progress()['progress'] );
		}
	}

	/**
	 * Test the certificate output contains the site URL and activation year.
	 *
	 * @return void
	 */
	public function test_certificate_output() {
		$user_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $user_id );

		$notice = new Sunset_Notice();
		\ob_start();
		$notice->the_certificate();
		$output = \ob_get_clean();

		$this->assertStringContainsString( \home_url(), $output );
		$this->assertStringContainsString( \progress_planner()->get_activation_date()->format( 'Y' ), $output );
		$this->assertStringContainsString( 'prpl-certificate', $output );
	}

	/**
	 * Test that the certificate endpoint dies for users without capabilities.
	 *
	 * @return void
	 */
	public function test_certificate_requires_capability() {
		\wp_set_current_user( 0 );

		$notice = new Sunset_Notice();
		$this->expectException( \WPDieException::class );
		$notice->render_certificate();
	}

	/**
	 * Test that the plugin-row notice outputs nothing for users without capabilities.
	 *
	 * @return void
	 */
	public function test_plugin_row_notice_requires_capability() {
		\wp_set_current_user( 0 );

		$notice = new Sunset_Notice();
		\ob_start();
		$notice->the_plugin_row_notice( \plugin_basename( \PROGRESS_PLANNER_FILE ), [] );
		$output = \ob_get_clean();

		$this->assertSame( '', $output );
	}
}
