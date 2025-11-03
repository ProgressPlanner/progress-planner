<?php
/**
 * Class Badges_Badge_Maintenance_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Badges\Badge_Maintenance;

/**
 * Mock Badge_Maintenance for testing.
 */
class Mock_Badge_Maintenance extends Badge_Maintenance {
	/**
	 * Badge ID.
	 *
	 * @var string
	 */
	protected $id = 'test-maintenance-badge';

	/**
	 * Get the badge title.
	 *
	 * @return string
	 */
	public function get_title() {
		return 'Test Maintenance Badge';
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
 * Badges_Badge_Maintenance_Test test case.
 */
class Badges_Badge_Maintenance_Test extends \WP_UnitTestCase {

	/**
	 * Badge_Maintenance instance.
	 *
	 * @var Mock_Badge_Maintenance
	 */
	protected $badge;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->badge = new Mock_Badge_Maintenance();
	}

	/**
	 * Test instance creation.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Badge_Maintenance::class, $this->badge );
	}

	/**
	 * Test get_id returns string.
	 *
	 * @return void
	 */
	public function test_get_id() {
		$result = $this->badge->get_id();
		$this->assertEquals( 'test-maintenance-badge', $result );
	}

	/**
	 * Test get_goal returns Goal_Recurring.
	 *
	 * @return void
	 */
	public function test_get_goal() {
		$goal = $this->badge->get_goal();
		$this->assertInstanceOf( \Progress_Planner\Goals\Goal_Recurring::class, $goal );
	}
}
