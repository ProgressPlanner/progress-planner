<?php
/**
 * Class Badges_Test
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Badges;

/**
 * Badges_Test test case.
 *
 * @group misc
 */
class Badges_Test extends \WP_UnitTestCase {

	/**
	 * Badges instance.
	 *
	 * @var Badges
	 */
	protected $badges;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->badges = new Badges();
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, \has_action( 'progress_planner_suggested_task_completed', [ $this->badges, 'clear_monthly_progress' ] ) );
		$this->assertEquals( 10, \has_action( 'progress_planner_activity_content_publish_saved', [ $this->badges, 'clear_content_progress' ] ) );
	}

	/**
	 * Test get method returns badges.
	 *
	 * @return void
	 */
	public function test_get_returns_badges() {
		$content_badges = $this->badges->get( 'content' );
		$this->assertIsArray( $content_badges );

		$maintenance_badges = $this->badges->get( 'maintenance' );
		$this->assertIsArray( $maintenance_badges );

		$monthly_badges = $this->badges->get( 'monthly' );
		$this->assertIsArray( $monthly_badges );
	}
}
