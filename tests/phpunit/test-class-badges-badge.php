<?php
/**
 * Class Badges_Badge_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Badges\Badge;

/**
 * Mock Badge for testing abstract class.
 */
class Mock_Badge extends Badge {
	/**
	 * Badge ID.
	 *
	 * @var string
	 */
	protected $id = 'test-badge';

	/**
	 * Badge category.
	 *
	 * @var string
	 */
	protected $category = 'test';

	/**
	 * Get the badge title.
	 *
	 * @return string
	 */
	public function get_title() {
		return 'Test Badge';
	}

	/**
	 * Check if badge is completed.
	 *
	 * @return bool
	 */
	public function is_completed() {
		return false;
	}
}

/**
 * Badges_Badge_Test test case.
 */
class Badges_Badge_Test extends \WP_UnitTestCase {

	/**
	 * Badge instance.
	 *
	 * @var Mock_Badge
	 */
	protected $badge;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->badge = new Mock_Badge();
	}

	/**
	 * Test get_id returns string.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$result = $this->badge->get_id();
		$this->assertEquals( 'test-badge', $result );
	}

	/**
	 * Test get_title returns string.
	 *
	 * @return void
	 */
	public function test_get_title() {
		$result = $this->badge->get_title();
		$this->assertEquals( 'Test Badge', $result );
	}

	/**
	 * Test is_completed returns boolean.
	 *
	 * @return void
	 */
	public function test_is_completed() {
		$result = $this->badge->is_completed();
		$this->assertIsBool( $result );
	}
}
