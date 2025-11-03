<?php
/**
 * Class Lessons_Test
 *
 * @package Progress_Planner\Tests
 * @group lessons
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Lessons;

/**
 * Lessons_Test test case.
 *
 * @group lessons
 */
class Lessons_Test extends \WP_UnitTestCase {

	/**
	 * Lessons instance.
	 *
	 * @var Lessons
	 */
	protected $lessons;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->lessons = new Lessons();
	}

	/**
	 * Test get_items returns array.
	 *
	 * @return void
	 */
	public function test_get_items() {
		$result = $this->lessons->get_items();
		$this->assertIsArray( $result );
	}

	/**
	 * Test get_remote_api_items returns array.
	 *
	 * @return void
	 */
	public function test_get_remote_api_items() {
		$result = $this->lessons->get_remote_api_items();
		$this->assertIsArray( $result );
	}
}
