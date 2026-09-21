<?php
/**
 * Test that a monthly badge's activity window does not overflow into the next
 * month.
 *
 * Regression test for the 1.10.0 release audit finding B4. The badge's
 * progress window used gmdate( 't', strtotime( $badge_name ) ), but the badge
 * name (e.g. "Felix February") is not a parseable date, so strtotime returned
 * false and gmdate( 't', false ) always yielded 31. The end date became
 * "<year>-<month>-31", which DateTime overflows for shorter months — e.g.
 * February's window ran to March 3, counting early-March activity toward the
 * February badge.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Badges\Monthly;
use Progress_Planner\Activities\Suggested_Task as Activity;

/**
 * Class Monthly_Badge_Window_Test
 */
class Monthly_Badge_Window_Test extends \WP_UnitTestCase {

	/**
	 * Insert a suggested-task activity on a specific date.
	 *
	 * @param string $date    The activity date (Y-m-d).
	 * @param int    $data_id The activity data id.
	 *
	 * @return void
	 */
	private function insert_activity_on( $date, $data_id ) {
		$activity           = new Activity();
		$activity->category = 'suggested_task';
		$activity->type     = 'test_activity';
		$activity->date     = new \DateTime( $date );
		$activity->data_id  = $data_id;
		$activity->user_id  = 1;
		$activity->save();
	}

	/**
	 * Early-March activity must not count toward the February badge.
	 *
	 * With the bug, February's window ran to March 3, so an activity on
	 * March 2 was counted. The correct window ends on February's real last day.
	 *
	 * @return void
	 */
	public function test_march_activity_does_not_count_toward_february() {
		// Activity two days into March.
		$this->insert_activity_on( '2026-03-02', 5001 );

		$february = new Monthly( 'monthly-2026-m2' );
		$progress = $february->progress_callback();

		$this->assertSame(
			0,
			$progress['progress'],
			'March activity must not count toward the February badge'
		);
	}

	/**
	 * A February-dated activity still counts toward the February badge, so the
	 * window has not been narrowed incorrectly.
	 *
	 * @return void
	 */
	public function test_february_activity_counts_toward_february() {
		$this->insert_activity_on( '2026-02-15', 5002 );

		$february = new Monthly( 'monthly-2026-m2' );
		$progress = $february->progress_callback();

		$this->assertGreaterThan(
			0,
			$progress['progress'],
			'a February activity should count toward the February badge'
		);
	}

	/**
	 * Activity on February's real last day (28th, 2026 is not a leap year)
	 * counts; the window includes the whole month.
	 *
	 * @return void
	 */
	public function test_last_day_of_february_counts() {
		$this->insert_activity_on( '2026-02-28', 5003 );

		$february = new Monthly( 'monthly-2026-m2' );
		$progress = $february->progress_callback();

		$this->assertGreaterThan(
			0,
			$progress['progress'],
			'activity on February 28 should count toward the February badge'
		);
	}
}
