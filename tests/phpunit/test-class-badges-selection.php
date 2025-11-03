<?php
/**
 * Unit tests for badge selection by timestamp.
 *
 * @package Progress_Planner\Tests
 * @group badges
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;

/**
 * Test_Badges_Selection test case.
 *
 * Tests the badge system structure and settings storage.
 * Full badge completion tests would require creating actual activities.
 */
class Test_Badges_Selection extends WP_UnitTestCase {

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Set current user to admin.
		\wp_set_current_user( 1 );

		// Clear badge settings.
		\progress_planner()->get_settings()->set( 'badges', [] );
	}

	/**
	 * Tear down the test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		// Clear badge settings.
		\progress_planner()->get_settings()->set( 'badges', [] );

		parent::tear_down();
	}

	/**
	 * Test that badge contexts exist.
	 *
	 * @return void
	 */
	public function test_badge_contexts_exist() {
		// Get badges from different contexts.
		$content_badges     = \progress_planner()->get_badges()->get_badges( 'content' );
		$maintenance_badges = \progress_planner()->get_badges()->get_badges( 'maintenance' );
		$monthly_badges     = \progress_planner()->get_badges()->get_badges( 'monthly_flat' );

		// Verify badges exist in all contexts.
		$this->assertNotEmpty( $content_badges, 'Content badges should exist' );
		$this->assertNotEmpty( $maintenance_badges, 'Maintenance badges should exist' );
		$this->assertNotEmpty( $monthly_badges, 'Monthly badges should exist' );
	}

	/**
	 * Test that badge objects have required methods.
	 *
	 * @return void
	 */
	public function test_badge_objects_have_methods() {
		$content_badges = \progress_planner()->get_badges()->get_badges( 'content' );
		$badge          = \array_values( $content_badges )[0];

		// Verify badge has required methods.
		$this->assertTrue( \method_exists( $badge, 'get_id' ), 'Badge should have get_id method' );
		$this->assertTrue( \method_exists( $badge, 'get_progress' ), 'Badge should have get_progress method' );

		// Verify get_id returns a string.
		$badge_id = $badge->get_id();
		$this->assertIsString( $badge_id, 'Badge ID should be a string' );
		$this->assertNotEmpty( $badge_id, 'Badge ID should not be empty' );
	}

	/**
	 * Test badge settings storage.
	 *
	 * @return void
	 */
	public function test_badge_settings_storage() {
		// Get a badge.
		$badges   = \progress_planner()->get_badges()->get_badges( 'content' );
		$badge_id = \array_keys( $badges )[0];

		// Store a completion date.
		$test_date = '2025-10-31 15:00:00';
		$settings  = [
			$badge_id => [
				'date'     => $test_date,
				'progress' => 100,
			],
		];

		\progress_planner()->get_settings()->set( 'badges', $settings );

		// Retrieve and verify.
		$retrieved = \progress_planner()->get_settings()->get( 'badges', [] );
		$this->assertArrayHasKey( $badge_id, $retrieved, 'Badge settings should be stored' );
		$this->assertEquals( $test_date, $retrieved[ $badge_id ]['date'], 'Date should match' );
		$this->assertEquals( 100, $retrieved[ $badge_id ]['progress'], 'Progress should match' );
	}

	/**
	 * Test get_latest_completed_badge returns null when no badges are completed.
	 *
	 * @return void
	 */
	public function test_no_completed_badges() {
		// Don't mark any badges as completed.
		$latest = \progress_planner()->get_badges()->get_latest_completed_badge();

		// Should return null when no badges are completed.
		$this->assertNull( $latest, 'Should return null when no badges are completed' );
	}

	/**
	 * Test that get_badges returns badge objects.
	 *
	 * @return void
	 */
	public function test_get_badges_returns_objects() {
		$badges = \progress_planner()->get_badges()->get_badges( 'content' );

		// Should return an array.
		$this->assertIsArray( $badges, 'get_badges should return an array' );

		// Each item should be an object with required properties.
		foreach ( $badges as $badge ) {
			$this->assertIsObject( $badge, 'Badge should be an object' );
		}
	}

	/**
	 * Test badge ID uniqueness.
	 *
	 * @return void
	 */
	public function test_badge_ids_are_unique() {
		$all_badge_ids = [];

		// Collect all badge IDs from all contexts.
		foreach ( [ 'content', 'maintenance', 'monthly_flat' ] as $context ) {
			$badges = \progress_planner()->get_badges()->get_badges( $context );
			foreach ( $badges as $badge ) {
				$all_badge_ids[] = $badge->get_id();
			}
		}

		// Verify all IDs are unique.
		$unique_ids = \array_unique( $all_badge_ids );
		$this->assertCount(
			\count( $unique_ids ),
			$all_badge_ids,
			'All badge IDs should be unique across contexts'
		);
	}
}
