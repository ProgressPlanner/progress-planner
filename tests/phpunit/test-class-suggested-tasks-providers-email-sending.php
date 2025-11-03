<?php
/**
 * Class Suggested_Tasks_Providers_Email_Sending_Test
 *
 * @package Progress_Planner\Tests
 * @group suggested-tasks-providers-2
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Email_Sending;

/**
 * Suggested_Tasks_Providers_Email_Sending_Test test case.
 *
 * @group suggested-tasks-providers-2
 */
class Suggested_Tasks_Providers_Email_Sending_Test extends \WP_UnitTestCase {

	/**
	 * Email_Sending instance.
	 *
	 * @var Email_Sending
	 */
	protected $provider;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->provider = new Email_Sending();
	}

	/**
	 * Test get_provider_id returns correct ID.
	 *
	 * @return void
	 */
	public function test_get_provider_id() {
		$this->assertEquals( 'sending-email', $this->provider->get_provider_id() );
	}

	/**
	 * Test should_add_task returns true.
	 *
	 * @return void
	 */
	public function test_should_add_task() {
		$this->assertTrue( $this->provider->should_add_task() );
	}

	/**
	 * Test is_task_completed returns false.
	 *
	 * @return void
	 */
	public function test_is_task_completed() {
		$this->assertFalse( $this->provider->is_task_completed() );
	}

	/**
	 * Test evaluate_task returns false.
	 *
	 * @return void
	 */
	public function test_evaluate_task() {
		$this->assertFalse( $this->provider->evaluate_task( 'test' ) );
	}

	/**
	 * Test init registers actions.
	 *
	 * @return void
	 */
	public function test_init_registers_actions() {
		$this->provider->init();
		$this->assertEquals( 10, \has_action( 'admin_enqueue_scripts', [ $this->provider, 'enqueue_scripts' ] ) );
		$this->assertEquals( 10, \has_action( 'wp_ajax_prpl_test_email_sending', [ $this->provider, 'ajax_test_email_sending' ] ) );
		$this->assertEquals( 10, \has_action( 'wp_mail_failed', [ $this->provider, 'set_email_error' ] ) );
	}

	/**
	 * Test check_if_wp_mail_is_filtered is callable.
	 *
	 * @return void
	 */
	public function test_check_if_wp_mail_is_filtered() {
		$this->provider->check_if_wp_mail_is_filtered();
		$this->assertTrue( true );
	}

	/**
	 * Test check_if_wp_mail_has_override is callable.
	 *
	 * @return void
	 */
	public function test_check_if_wp_mail_has_override() {
		$this->provider->check_if_wp_mail_has_override();
		$this->assertTrue( true );
	}
}
