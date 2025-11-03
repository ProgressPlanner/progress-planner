<?php
/**
 * Class Update_Update_140_Test
 *
 * @package Progress_Planner\Tests
 * @group updates
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Update\Update_140;

/**
 * Update_Update_140_Test test case.
 *
 * @group updates
 */
class Update_Update_140_Test extends \WP_UnitTestCase {

	/**
	 * Update_140 instance.
	 *
	 * @var Update_140
	 */
	protected $update;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->update = new Update_140();
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
