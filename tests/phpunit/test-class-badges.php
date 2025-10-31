<?php
/**
 * Class Badges_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Badges test case.
 *
 * Tests the Badges class that manages user badge system including
 * content, maintenance, and monthly badges.
 */
class Badges_Test extends \WP_UnitTestCase {

	/**
	 * Badges instance.
	 *
	 * @var \Progress_Planner\Badges
	 */
	private $badges;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->badges = \progress_planner()->get_badges();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );
	}

	/**
	 * Test constructor registers hooks.
	 */
	public function test_constructor_registers_hooks() {
		$badges = new \Progress_Planner\Badges();

		$this->assertEquals(
			10,
			\has_action( 'progress_planner_suggested_task_completed', [ $badges, 'clear_monthly_progress' ] ),
			'progress_planner_suggested_task_completed hook should be registered'
		);

		$this->assertEquals(
			10,
			\has_action( 'progress_planner_activity_content_publish_saved', [ $badges, 'clear_content_progress' ] ),
			'progress_planner_activity_content_publish_saved hook should be registered'
		);
	}

	/**
	 * Test the content badges.
	 *
	 * @return void
	 */
	public function test_content_badges() {
		$badges = $this->badges->get_badges( 'content' );
		$this->assertCount( 3, $badges );

		// Verify all are Badge instances.
		foreach ( $badges as $badge ) {
			$this->assertInstanceOf( \Progress_Planner\Badges\Badge::class, $badge );
		}
	}

	/**
	 * Test the maintenance badges.
	 *
	 * @return void
	 */
	public function test_maintenance_badges() {
		$badges = $this->badges->get_badges( 'maintenance' );
		$this->assertCount( 3, $badges );

		// Verify all are Badge instances.
		foreach ( $badges as $badge ) {
			$this->assertInstanceOf( \Progress_Planner\Badges\Badge::class, $badge );
		}
	}

	/**
	 * Test the monthly badges.
	 *
	 * @return void
	 */
	public function test_monthly_badges() {
		$badges = $this->badges->get_badges( 'monthly' );
		$this->assertNotEmpty( $badges[ \gmdate( 'Y' ) ] );
		$this->assertIsArray( $badges );
	}

	/**
	 * Test the monthly_flat badges.
	 *
	 * @return void
	 */
	public function test_monthly_flat_badges() {
		$badges = $this->badges->get_badges( 'monthly_flat' );
		$this->assertIsArray( $badges );
		$this->assertNotEmpty( $badges );

		// Verify structure.
		foreach ( $badges as $badge ) {
			$this->assertInstanceOf( \Progress_Planner\Badges\Badge::class, $badge );
			$this->assertIsString( $badge->get_id() );
			$this->assertIsString( $badge->get_name() );
		}
	}

	/**
	 * Test get_badges with invalid context.
	 */
	public function test_get_badges_invalid_context() {
		$badges = $this->badges->get_badges( 'nonexistent' );
		$this->assertIsArray( $badges );
		$this->assertEmpty( $badges );
	}

	/**
	 * Test get_badge with valid ID.
	 */
	public function test_get_badge_valid() {
		// Get a content badge first.
		$content_badges = $this->badges->get_badges( 'content' );
		$first_badge    = $content_badges[0];
		$badge_id       = $first_badge->get_id();

		// Now get it by ID.
		$badge = $this->badges->get_badge( $badge_id );

		$this->assertInstanceOf( \Progress_Planner\Badges\Badge::class, $badge );
		$this->assertEquals( $badge_id, $badge->get_id() );
	}

	/**
	 * Test get_badge with invalid ID.
	 */
	public function test_get_badge_invalid() {
		$badge = $this->badges->get_badge( 'nonexistent-badge-id' );
		$this->assertNull( $badge );
	}

	/**
	 * Test clear_content_progress.
	 */
	public function test_clear_content_progress() {
		// This should not throw errors.
		$this->badges->clear_content_progress();

		$this->assertTrue( true, 'clear_content_progress should complete without errors' );
	}

	/**
	 * Test get_latest_completed_badge with no completed badges.
	 */
	public function test_get_latest_completed_badge_none() {
		// Clear any existing badge data.
		\progress_planner()->get_settings()->set( 'badges', [] );

		$badge = $this->badges->get_latest_completed_badge();

		$this->assertNull( $badge );
	}

	/**
	 * Test clear_monthly_progress with no activity.
	 */
	public function test_clear_monthly_progress_no_activity() {
		// Call with a non-existent activity ID.
		$this->badges->clear_monthly_progress( 'nonexistent-activity' );

		// Should complete without errors.
		$this->assertTrue( true );
	}

	/**
	 * Test get_badge searches all contexts.
	 */
	public function test_get_badge_searches_all_contexts() {
		// Test content badge.
		$content_badges = $this->badges->get_badges( 'content' );
		if ( ! empty( $content_badges ) ) {
			$content_badge_id = $content_badges[0]->get_id();
			$found_badge      = $this->badges->get_badge( $content_badge_id );
			$this->assertNotNull( $found_badge, 'Should find content badge' );
		}

		// Test maintenance badge.
		$maintenance_badges = $this->badges->get_badges( 'maintenance' );
		if ( ! empty( $maintenance_badges ) ) {
			$maintenance_badge_id = $maintenance_badges[0]->get_id();
			$found_badge          = $this->badges->get_badge( $maintenance_badge_id );
			$this->assertNotNull( $found_badge, 'Should find maintenance badge' );
		}

		// Test monthly badge.
		$monthly_badges = $this->badges->get_badges( 'monthly_flat' );
		if ( ! empty( $monthly_badges ) ) {
			$monthly_badge_id = $monthly_badges[0]->get_id();
			$found_badge      = $this->badges->get_badge( $monthly_badge_id );
			$this->assertNotNull( $found_badge, 'Should find monthly badge' );
		}
	}

	/**
	 * Test monthly badges have unique IDs.
	 */
	public function test_monthly_badges_unique_ids() {
		$badges = $this->badges->get_badges( 'monthly_flat' );
		$ids    = [];

		foreach ( $badges as $badge ) {
			$id = $badge->get_id();
			$this->assertNotContains( $id, $ids, "Badge ID {$id} should be unique" );
			$ids[] = $id;
		}
	}
}
