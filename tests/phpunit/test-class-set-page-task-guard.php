<?php
/**
 * Test the "Set page" interactive task guard.
 *
 * Regression test for the 1.10.0 release audit finding B8. The
 * `set-page` interactive task could be completed with "I have this page"
 * selected but no page chosen: the handler saved have_page = 'yes' with
 * id = 0, recording that a page exists while pointing at no page.
 *
 * The fix rejects have_page = 'yes' when no valid page id is supplied.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Set_Page_About;

/**
 * Class Set_Page_Task_Guard_Test
 */
class Set_Page_Task_Guard_Test extends \WP_Ajax_UnitTestCase {

	/**
	 * Set up an admin user and a valid nonce before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$admin = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin );

		$_REQUEST['nonce'] = \wp_create_nonce( 'progress_planner' );
	}

	/**
	 * Clean up request superglobals after each test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		unset( $_POST, $_REQUEST );
		$_POST    = [];
		$_REQUEST = [];
		parent::tearDown();
	}

	/**
	 * Run the handler with the given payload and return the decoded response.
	 *
	 * @param array<string,string> $payload The POST payload (merged with nonce).
	 *
	 * @return array|null The decoded JSON response.
	 */
	private function get_response( $payload ) {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- test setup; the handler verifies the nonce we seeded in setUp().
		$_REQUEST = \array_merge( $_REQUEST, $payload );
		$_POST    = $_REQUEST;
		// phpcs:enable WordPress.Security.NonceVerification.Recommended

		\ob_start();
		try {
			Set_Page_About::handle_interactive_task_specific_submit();
		} catch ( \WPAjaxDieContinueException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// Expected: wp_send_json_* calls wp_die().
		}

		return \json_decode( $this->_last_response, true );
	}

	/**
	 * "I have this page" with no page selected (id = 0) is rejected.
	 *
	 * @return void
	 */
	public function test_yes_without_page_is_rejected() {
		$response = $this->get_response(
			[
				'have_page' => 'yes',
				'id'        => '0',
				'task_id'   => 'set-page-about',
			]
		);

		$this->assertIsArray( $response );
		$this->assertFalse( $response['success'], 'have_page=yes with id=0 must be rejected' );
	}

	/**
	 * "I have this page" with a valid page id is accepted.
	 *
	 * @return void
	 */
	public function test_yes_with_page_is_accepted() {
		$page_id = self::factory()->post->create( [ 'post_type' => 'page' ] );

		$response = $this->get_response(
			[
				'have_page' => 'yes',
				'id'        => (string) $page_id,
				'task_id'   => 'set-page-about',
			]
		);

		$this->assertIsArray( $response );
		$this->assertTrue( $response['success'], 'have_page=yes with a real page id should succeed' );
	}

	/**
	 * "I don't have this page" completes with no page id (unchanged behaviour).
	 *
	 * @return void
	 */
	public function test_no_page_still_completes() {
		$response = $this->get_response(
			[
				'have_page' => 'no',
				'id'        => '0',
				'task_id'   => 'set-page-about',
			]
		);

		$this->assertIsArray( $response );
		$this->assertTrue( $response['success'], 'have_page=no should still complete without a page' );
	}
}
