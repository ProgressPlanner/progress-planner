<?php
/**
 * Class Monthly_Badge_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activities\Activity;
use Progress_Planner\Badges\Monthly;

/**
 * Monthly badge test case.
 */
class Monthly_Badge_Test extends \WP_UnitTestCase {

	/**
	 * Current month.
	 *
	 * @var string
	 */
	protected $current_month;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->current_month = \strtolower( \gmdate( 'M' ) );
	}

	/**
	 * Test the monthly badge 0 percent.
	 *
	 * @return void
	 */
	public function test_monthly_badge_0_percent() {
		foreach ( \progress_planner()->get_badges()->get_badges( 'monthly_flat' ) as $badge ) {
			if ( 'monthly-' . $this->current_month === $badge->get_id() ) {
				$this->assertEquals( 0, $badge->progress_callback()['progress'] );
			}
		}
	}

	/**
	 * Test the monthly badge 100 percent.
	 *
	 * @return void
	 */
	public function test_monthly_badge_100_percent() {
		for ( $i = 1; $i <= Monthly::TARGET_POINTS; $i++ ) {
			$this->insert_activity( 1000 + $i );
		}

		foreach ( \progress_planner()->get_badges()->get_badges( 'monthly_flat' ) as $badge ) {
			if ( 'monthly-' . $this->current_month === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );
			}
		}
	}

	/**
	 * Test the monthly badge over 100 percent, we should top at 100 percent.
	 *
	 * @return void
	 */
	public function test_monthly_badge_over_100_percent() {
		for ( $i = 1; $i <= Monthly::TARGET_POINTS + 2; $i++ ) {
			$this->insert_activity( 1000 + $i );
		}

		foreach ( \progress_planner()->get_badges()->get_badges( 'monthly_flat' ) as $badge ) {
			if ( 'monthly-' . $this->current_month === $badge->get_id() ) {
				$this->assertEquals( 100, $badge->progress_callback()['progress'] );
			}
		}
	}

	/**
	 * Insert an activity.
	 *
	 * @param int $data_id The data id.
	 *
	 * @return void
	 */
	protected function insert_activity( $data_id = 1000 ) {
		$activity           = new Activity();
		$activity->category = 'suggested_task';
		$activity->type     = 'test_activity';
		$activity->date     = new \DateTime( \gmdate( 'Y-m-d' ) );
		$activity->data_id  = $data_id;
		$activity->user_id  = 1;
		$activity->save();
	}
}
