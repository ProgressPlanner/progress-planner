<?php
/**
 * Tests for Badges class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Badges;

/**
 * Badges test case.
 */
class Badges_Test extends \WP_UnitTestCase {

	/**
	 * The Badges instance.
	 *
	 * @var Badges
	 */
	private $badges;

	/**
	 * Set up before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->badges = new Badges();
	}

	/**
	 * Test clear_monthly_progress clears incomplete badge.
	 *
	 * @return void
	 */
	public function test_clear_monthly_progress_clears_incomplete_badge() {
		$settings = \progress_planner()->get_settings();

		// Create a test activity.
		$activity          = new \Progress_Planner\Activities\Suggested_Task();
		$activity->type    = 'completed';
		$activity->data_id = 'test-activity-monthly';
		$activity->date    = new \DateTime();
		$activity->save();

		// Set up an incomplete monthly badge for the current month.
		$year     = $activity->date->format( 'Y' );
		$month    = $activity->date->format( 'n' );
		$badge_id = "monthly-{$year}-m{$month}";

		$badges = [
			$badge_id => [
				'progress' => 50,
			],
		];
		$settings->set( 'badges', $badges );

		// Call the method.
		$this->badges->clear_monthly_progress( 'test-activity-monthly' );

		// Verify the badge was cleared.
		$badges_after = $settings->get( 'badges', [] );
		$this->assertArrayNotHasKey( $badge_id, $badges_after );
	}

	/**
	 * Test clear_monthly_progress does not clear completed badge.
	 *
	 * @return void
	 */
	public function test_clear_monthly_progress_preserves_completed_badge() {
		$settings = \progress_planner()->get_settings();

		// Create a test activity.
		$activity          = new \Progress_Planner\Activities\Suggested_Task();
		$activity->type    = 'completed';
		$activity->data_id = 'test-activity-complete';
		$activity->date    = new \DateTime();
		$activity->save();

		// Set up a completed monthly badge for the current month.
		$year     = $activity->date->format( 'Y' );
		$month    = $activity->date->format( 'n' );
		$badge_id = "monthly-{$year}-m{$month}";

		$badges = [
			$badge_id => [
				'progress' => 100,
				'date'     => \gmdate( 'Y-m-d H:i:s' ),
			],
		];
		$settings->set( 'badges', $badges );

		// Call the method.
		$this->badges->clear_monthly_progress( 'test-activity-complete' );

		// Verify the badge was not cleared.
		$badges_after = $settings->get( 'badges', [] );
		$this->assertArrayHasKey( $badge_id, $badges_after );
		$this->assertEquals( 100, $badges_after[ $badge_id ]['progress'] );
	}

	/**
	 * Test clear_monthly_progress does nothing with non-existent activity.
	 *
	 * @return void
	 */
	public function test_clear_monthly_progress_with_nonexistent_activity() {
		$settings = \progress_planner()->get_settings();

		// Set up a badge without creating an activity.
		$badges = [
			'monthly-2024-m1' => [
				'progress' => 50,
			],
		];
		$settings->set( 'badges', $badges );

		// Call the method with non-existent activity.
		$this->badges->clear_monthly_progress( 'non-existent-activity' );

		// Verify the badge was not touched.
		$badges_after = $settings->get( 'badges', [] );
		$this->assertArrayHasKey( 'monthly-2024-m1', $badges_after );
	}

	/**
	 * Test clear_content_progress clears incomplete content badges.
	 *
	 * @return void
	 */
	public function test_clear_content_progress_clears_incomplete_badges() {
		$settings = \progress_planner()->get_settings();

		// Set up incomplete content badges.
		$badges = [
			'content-curator'      => [ 'progress' => 30 ],
			'revision-ranger'      => [ 'progress' => 50 ],
			'purposeful-publisher' => [ 'progress' => 70 ],
			'some-other-badge'     => [ 'progress' => 40 ],
		];
		$settings->set( 'badges', $badges );

		// Call the method.
		$this->badges->clear_content_progress();

		// Verify the content badges were cleared but other badges remain.
		$badges_after = $settings->get( 'badges', [] );
		$this->assertArrayNotHasKey( 'content-curator', $badges_after );
		$this->assertArrayNotHasKey( 'revision-ranger', $badges_after );
		$this->assertArrayNotHasKey( 'purposeful-publisher', $badges_after );
		$this->assertArrayHasKey( 'some-other-badge', $badges_after );
	}

	/**
	 * Test clear_content_progress preserves completed badges.
	 *
	 * @return void
	 */
	public function test_clear_content_progress_preserves_completed_badges() {
		$settings = \progress_planner()->get_settings();

		// Set up completed content badges.
		$badges = [
			'content-curator'      => [
				'progress' => 100,
				'date'     => '2024-01-15 10:00:00',
			],
			'revision-ranger'      => [
				'progress' => 100,
				'date'     => '2024-02-20 15:30:00',
			],
			'purposeful-publisher' => [ 'progress' => 50 ],
		];
		$settings->set( 'badges', $badges );

		// Call the method.
		$this->badges->clear_content_progress();

		// Verify completed badges were preserved.
		$badges_after = $settings->get( 'badges', [] );
		$this->assertArrayHasKey( 'content-curator', $badges_after );
		$this->assertArrayHasKey( 'revision-ranger', $badges_after );
		$this->assertArrayNotHasKey( 'purposeful-publisher', $badges_after );
	}

	/**
	 * Test get_latest_completed_badge returns null when no badges completed.
	 *
	 * @return void
	 */
	public function test_get_latest_completed_badge_returns_null_when_none() {
		$settings = \progress_planner()->get_settings();

		// Set up incomplete badges only.
		$badges = [
			'content-curator' => [ 'progress' => 50 ],
			'revision-ranger' => [ 'progress' => 70 ],
		];
		$settings->set( 'badges', $badges );

		$result = $this->badges->get_latest_completed_badge();

		$this->assertNull( $result );
	}

	/**
	 * Test get_latest_completed_badge returns the most recent completed badge.
	 *
	 * @return void
	 */
	public function test_get_latest_completed_badge_returns_most_recent() {
		$settings = \progress_planner()->get_settings();

		// Set up badges with different completion dates.
		$badges = [
			'content-curator'      => [
				'progress' => 100,
				'date'     => '2024-01-15 10:00:00',
			],
			'revision-ranger'      => [
				'progress' => 100,
				'date'     => '2024-03-20 15:30:00',
			],
			'purposeful-publisher' => [
				'progress' => 100,
				'date'     => '2024-02-10 08:00:00',
			],
		];
		$settings->set( 'badges', $badges );

		$result = $this->badges->get_latest_completed_badge();

		$this->assertIsArray( $result );
		$this->assertEquals( 'revision-ranger', $result['id'] );
		$this->assertEquals( '2024-03-20 15:30:00', $result['date'] );
	}

	/**
	 * Test get_latest_completed_badge ignores badges without dates.
	 *
	 * @return void
	 */
	public function test_get_latest_completed_badge_ignores_badges_without_dates() {
		$settings = \progress_planner()->get_settings();

		// Set up badges where one completed badge has no date.
		$badges = [
			'content-curator' => [
				'progress' => 100,
				// No date field.
			],
			'revision-ranger' => [
				'progress' => 100,
				'date'     => '2024-02-20 15:30:00',
			],
		];
		$settings->set( 'badges', $badges );

		$result = $this->badges->get_latest_completed_badge();

		$this->assertIsArray( $result );
		$this->assertEquals( 'revision-ranger', $result['id'] );
	}

	/**
	 * Test get_latest_completed_badge ignores badges with invalid dates.
	 *
	 * @return void
	 */
	public function test_get_latest_completed_badge_ignores_invalid_dates() {
		$settings = \progress_planner()->get_settings();

		// Set up badges where one has an invalid date format.
		$badges = [
			'content-curator' => [
				'progress' => 100,
				'date'     => 'invalid-date',
			],
			'revision-ranger' => [
				'progress' => 100,
				'date'     => '2024-02-20 15:30:00',
			],
		];
		$settings->set( 'badges', $badges );

		$result = $this->badges->get_latest_completed_badge();

		$this->assertIsArray( $result );
		$this->assertEquals( 'revision-ranger', $result['id'] );
	}

	/**
	 * Test get_latest_completed_badge with single completed badge.
	 *
	 * @return void
	 */
	public function test_get_latest_completed_badge_single_badge() {
		$settings = \progress_planner()->get_settings();

		// Set up a single completed badge.
		$badges = [
			'content-curator' => [
				'progress' => 100,
				'date'     => '2024-05-10 12:00:00',
			],
			'revision-ranger' => [
				'progress' => 50,
			],
		];
		$settings->set( 'badges', $badges );

		$result = $this->badges->get_latest_completed_badge();

		$this->assertIsArray( $result );
		$this->assertEquals( 'content-curator', $result['id'] );
		$this->assertEquals( '2024-05-10 12:00:00', $result['date'] );
	}

	/**
	 * Test get_latest_completed_badge returns latest when same date.
	 *
	 * @return void
	 */
	public function test_get_latest_completed_badge_same_date() {
		$settings = \progress_planner()->get_settings();

		// Set up badges completed at the same time.
		$same_date = '2024-03-15 10:00:00';
		$badges    = [
			'content-curator' => [
				'progress' => 100,
				'date'     => $same_date,
			],
			'revision-ranger' => [
				'progress' => 100,
				'date'     => $same_date,
			],
		];
		$settings->set( 'badges', $badges );

		$result = $this->badges->get_latest_completed_badge();

		// Should return one of the badges.
		$this->assertIsArray( $result );
		$this->assertContains( $result['id'], [ 'content-curator', 'revision-ranger' ] );
		$this->assertEquals( $same_date, $result['date'] );
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		// Create a new instance to trigger constructor.
		$badges = new Badges();

		// Check that the hooks are registered.
		$this->assertGreaterThan(
			0,
			\has_action( 'progress_planner_suggested_task_completed', [ $badges, 'clear_monthly_progress' ] )
		);
		$this->assertGreaterThan(
			0,
			\has_action( 'progress_planner_activity_content_publish_saved', [ $badges, 'clear_content_progress' ] )
		);
	}
}
