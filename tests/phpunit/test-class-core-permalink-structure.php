<?php
/**
 * Class Core_Permalink_Structure_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Core permalink structure test case.
 */
class Core_Permalink_Structure_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait {
		setUpBeforeClass as public parentSetUpBeforeClass;
		tearDownAfterClass as public parentTearDownAfterClass;
	}

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'core-permalink-structure';

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void {
		self::parentSetUpBeforeClass();

		\update_option( 'permalink_structure', '/%year%/%monthnum%/%day%/%postname%/' );
	}

	/**
	 * Tear down the test.
	 *
	 * @return void
	 */
	public static function tearDownAfterClass(): void {
		self::parentTearDownAfterClass();

		\update_option( 'permalink_structure', '' );
	}

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		\update_option( 'permalink_structure', '/%postname%/' );
	}
}
