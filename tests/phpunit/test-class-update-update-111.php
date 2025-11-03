<?php
/**
 * Class Update_Update_111_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Update\Update_111;

/**
 * Update_Update_111_Test test case.
 */
class Update_Update_111_Test extends \WP_UnitTestCase {

	/**
	 * Update_111 instance.
	 *
	 * @var Update_111
	 */
	protected $update;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->update = new Update_111();
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
