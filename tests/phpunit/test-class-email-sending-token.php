<?php
/**
 * Test that the email-sending provider does not clobber the completion token.
 *
 * Regression test for the 1.10.0 release audit finding B2. The provider's
 * `init()` used to mint a fresh completion token on every request. Since the
 * token is stored in a single per-task/per-user transient, this overwrote the
 * token that `ajax_test_email_sending()` had stored when the email was
 * actually sent — so the link in the user's inbox was invalidated by the very
 * next request (e.g. a Heartbeat poll or page navigation).
 *
 * The fix removes token generation from `init()`; it now happens only in the
 * AJAX handler, at send time.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Email_Sending_Token_Test
 */
class Email_Sending_Token_Test extends \WP_UnitTestCase {

	/**
	 * The email-sending provider.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Providers\Email_Sending
	 */
	private $provider;

	/**
	 * The current user id used for the token.
	 *
	 * @var int
	 */
	private $user_id;

	/**
	 * Set up the provider and an admin user before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->user_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $this->user_id );

		$this->provider = \progress_planner()
			->get_suggested_tasks()
			->get_tasks_manager()
			->get_task_provider( 'sending-email' );

		$this->assertNotNull( $this->provider, 'email-sending provider should be registered' );
	}

	/**
	 * The transient key that stores the completion token.
	 *
	 * @return string
	 */
	private function token_transient_key() {
		return 'prpl_complete_' . $this->provider->get_task_id() . '_' . $this->user_id;
	}

	/**
	 * Running init() must not overwrite a token stored by the send flow.
	 *
	 * @return void
	 */
	public function test_init_does_not_overwrite_stored_token() {
		// Simulate the send flow storing a token for the emailed link.
		$sent_token = \progress_planner()->get_suggested_tasks()->generate_task_completion_token(
			$this->provider->get_task_id(),
			$this->user_id
		);
		$this->assertSame(
			$sent_token,
			\get_transient( $this->token_transient_key() ),
			'the sent token should be stored'
		);

		// Simulate an unrelated later request running the provider's init().
		$this->provider->init();

		// The stored token must be unchanged, so the emailed link still verifies.
		$this->assertSame(
			$sent_token,
			\get_transient( $this->token_transient_key() ),
			'init() must not regenerate/overwrite the stored completion token'
		);
	}
}
