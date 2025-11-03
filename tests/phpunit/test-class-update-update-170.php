<?php
/**
 * Class Update_Update_170_Test
 *
 * @package Progress_Planner\Tests
 * @group updates
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Update\Update_170;

/**
 * Update_Update_170_Test test case.
 */
class Update_Update_170_Test extends \WP_UnitTestCase {

	/**
	 * Update_170 instance.
	 *
	 * @var Update_170
	 */
	protected $update;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->update = new Update_170();
	}

	/**
	 * Test run method is callable.
	 *
	 * @return void
	 */
	public function test_run_callable() {
		$this->assertTrue( \is_callable( [ $this->update, 'run' ] ) );
	}

	/**
	 * Test run method executes without errors.
	 *
	 * @return void
	 */
	public function test_run_executes() {
		$this->update->run();
		$this->assertTrue( true );
	}
}
