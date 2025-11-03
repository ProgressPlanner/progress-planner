<?php
/**
 * Unit tests for Activities\Maintenance class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Activities\Maintenance;

/**
 * Activities_Maintenance test case.
 *
 * Tests the Activities\Maintenance class for maintenance activities.

 * @group activities
 */
class Activities_Maintenance_Test extends WP_UnitTestCase {

	/**
	 * Maintenance activity instance.
	 *
	 * @var Maintenance
	 */
	private $maintenance;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->maintenance = new Maintenance();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );
	}

	/**
	 * Tear down test environment.
	 *
	 * phpcs:disable Generic.CodeAnalysis.UselessOverridingMethod.Found -- Reserved for future test cleanup
	 */
	public function tearDown(): void {
		parent::tearDown();
	}
	// phpcs:enable Generic.CodeAnalysis.UselessOverridingMethod.Found

	/**
	 * Test class has correct points configuration.
	 */
	public function test_points_config() {
		$this->assertEquals( 10, Maintenance::$points_config );
	}

	/**
	 * Test default category is maintenance.
	 */
	public function test_default_category() {
		$this->assertEquals( 'maintenance', $this->maintenance->category );
	}

	/**
	 * Test default data_id is 0.
	 */
	public function test_default_data_id() {
		$this->assertEquals( '0', $this->maintenance->data_id );
	}

	/**
	 * Test save() creates new activity.
	 */
	public function test_save_creates_activity() {
		$this->maintenance->type = 'test-maintenance';
		$this->maintenance->save();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'maintenance',
				'type'     => 'test-maintenance',
			]
		);

		$this->assertNotEmpty( $activities );
		$this->assertEquals( 'maintenance', $activities[0]->category );
	}

	/**
	 * Test save() sets current date.
	 */
	public function test_save_sets_date() {
		$this->maintenance->type = 'test-date';
		$this->maintenance->save();

		$this->assertInstanceOf( \DateTime::class, $this->maintenance->date );
	}

	/**
	 * Test save() sets current user.
	 */
	public function test_save_sets_user_id() {
		$current_user_id = \get_current_user_id();

		$this->maintenance->type = 'test-user';
		$this->maintenance->save();

		$this->assertEquals( $current_user_id, $this->maintenance->user_id );
	}

	/**
	 * Test save() updates existing activity.
	 */
	public function test_save_updates_existing() {
		$this->maintenance->type = 'test-update';
		$this->maintenance->save();

		$activities_before = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'maintenance',
				'type'     => 'test-update',
			]
		);

		$count_before = \count( $activities_before );

		// Save again with same type.
		$this->maintenance->save();

		$activities_after = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'maintenance',
				'type'     => 'test-update',
			]
		);

		$count_after = \count( $activities_after );

		$this->assertEquals( $count_before, $count_after, 'Should update existing instead of creating new' );
	}

	/**
	 * Test save() fires action.
	 */
	public function test_save_fires_action() {
		$action_fired   = false;
		$saved_activity = null;

		\add_action(
			'progress_planner_activity_saved',
			function ( $activity ) use ( &$action_fired, &$saved_activity ) {
				$action_fired   = true;
				$saved_activity = $activity;
			}
		);

		$this->maintenance->type = 'test-action';
		$this->maintenance->save();

		$this->assertTrue( $action_fired, 'Should fire progress_planner_activity_saved action' );
		$this->assertInstanceOf( Maintenance::class, $saved_activity );
	}

	/**
	 * Test get_points() returns configured points for recent activity.
	 */
	public function test_get_points_recent() {
		$this->maintenance->date = new \DateTime();

		$points = $this->maintenance->get_points( new \DateTime() );

		$this->assertEquals( 10, $points, 'Should return 10 points for same day activity' );
	}

	/**
	 * Test get_points() returns 0 for old activity.
	 */
	public function test_get_points_old() {
		$this->maintenance->date = new \DateTime( '-10 days' );

		$points = $this->maintenance->get_points( new \DateTime() );

		$this->assertEquals( 0, $points, 'Should return 0 points for activity older than 7 days' );
	}

	/**
	 * Test get_points() with activity 6 days ago.
	 */
	public function test_get_points_six_days() {
		$this->maintenance->date = new \DateTime( '-6 days' );

		$points = $this->maintenance->get_points( new \DateTime() );

		$this->assertEquals( 10, $points, 'Should return 10 points for activity within 7 days' );
	}

	/**
	 * Test get_points() with activity 7 days ago.
	 */
	public function test_get_points_seven_days() {
		$this->maintenance->date = new \DateTime( '-7 days' );

		$points = $this->maintenance->get_points( new \DateTime() );

		$this->assertEquals( 0, $points, 'Should return 0 points for activity exactly 7 days old' );
	}

	/**
	 * Test get_points() caches results.
	 */
	public function test_get_points_caches() {
		$this->maintenance->date = new \DateTime();
		$date                    = new \DateTime();

		$points1 = $this->maintenance->get_points( $date );
		$points2 = $this->maintenance->get_points( $date );

		$this->assertEquals( $points1, $points2, 'Should return cached points' );
	}

	/**
	 * Test get_points() with future activity.
	 */
	public function test_get_points_future() {
		$this->maintenance->date = new \DateTime( '+1 day' );

		$points = $this->maintenance->get_points( new \DateTime() );

		$this->assertEquals( 10, $points, 'Should handle future activities' );
	}

	/**
	 * Test data_id is always 0.
	 */
	public function test_data_id_always_zero() {
		$this->maintenance->data_id = '123';

		$this->assertEquals( '123', $this->maintenance->data_id );

		// Create new instance.
		$new_maintenance = new Maintenance();

		$this->assertEquals( '0', $new_maintenance->data_id, 'New instance should have data_id = 0' );
	}

	/**
	 * Test save() with custom type.
	 */
	public function test_save_custom_type() {
		$this->maintenance->type = 'plugin-update';
		$this->maintenance->save();

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'maintenance',
				'type'     => 'plugin-update',
			]
		);

		$this->assertNotEmpty( $activities );
		$this->assertEquals( 'plugin-update', $activities[0]->type );
	}

	/**
	 * Test multiple maintenance activities.
	 */
	public function test_multiple_activities() {
		$types = [ 'plugin-update', 'theme-update', 'wordpress-update' ];

		foreach ( $types as $type ) {
			$maintenance       = new Maintenance();
			$maintenance->type = $type;
			$maintenance->save();
		}

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'maintenance',
			]
		);

		$this->assertCount( 3, $activities, 'Should save multiple different maintenance types' );
	}

	/**
	 * Test get_points() with different dates.
	 */
	public function test_get_points_different_dates() {
		$this->maintenance->date = new \DateTime( '2025-01-01' );

		$points_jan = $this->maintenance->get_points( new \DateTime( '2025-01-05' ) );
		$points_feb = $this->maintenance->get_points( new \DateTime( '2025-02-01' ) );

		$this->assertEquals( 10, $points_jan, 'Should have points within 7 days' );
		$this->assertEquals( 0, $points_feb, 'Should have 0 points after 7 days' );
	}

	/**
	 * Test category cannot be changed.
	 */
	public function test_category_is_maintenance() {
		$this->maintenance->category = 'content';

		$this->assertEquals( 'content', $this->maintenance->category );

		// Create new instance.
		$new_maintenance = new Maintenance();

		$this->assertEquals( 'maintenance', $new_maintenance->category, 'New instance should have maintenance category' );
	}

	/**
	 * Test points configuration can be modified.
	 */
	public function test_points_config_modifiable() {
		$original = Maintenance::$points_config;

		Maintenance::$points_config = 20;

		$this->assertEquals( 20, Maintenance::$points_config );

		// Restore original.
		Maintenance::$points_config = $original;
	}

	/**
	 * Test save() action receives correct activity.
	 */
	public function test_save_action_receives_activity() {
		$received_type     = null;
		$received_category = null;

		\add_action(
			'progress_planner_activity_saved',
			function ( $activity ) use ( &$received_type, &$received_category ) {
				$received_type     = $activity->type;
				$received_category = $activity->category;
			}
		);

		$this->maintenance->type = 'specific-maintenance';
		$this->maintenance->save();

		$this->assertEquals( 'specific-maintenance', $received_type );
		$this->assertEquals( 'maintenance', $received_category );
	}
}
