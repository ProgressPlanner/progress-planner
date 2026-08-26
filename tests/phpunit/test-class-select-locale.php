<?php
/**
 * Class Select_Locale_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Select locale test case.
 */
class Select_Locale_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'select-locale';

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		// Set the browser locale to something different from WP's en_US.
		$_SERVER['HTTP_ACCEPT_LANGUAGE'] = 'fr-FR,fr;q=0.9';

		// Set the current user to the admin user.
		\wp_set_current_user( 1 );
	}

	/**
	 * Tear down the test.
	 *
	 * @return void
	 */
	public static function tearDownAfterClass(): void { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
		unset( $_SERVER['HTTP_ACCEPT_LANGUAGE'] );

		// Reset the current user.
		\wp_set_current_user( 0 );
	}

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		$activity          = new \Progress_Planner\Activities\Suggested_Task();
		$activity->data_id = 'select-locale';
		$activity->save();
	}
}
