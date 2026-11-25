<?php
/**
 * Tests for the numbers and hover states in the monthly badges popover.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Widgets\Monthly_Badges;
use Progress_Planner\Badges\Monthly;
use Progress_Planner\Activities\Suggested_Task as Activity;

/**
 * Class Monthly_Badges_Popover_Test
 */
class Monthly_Badges_Popover_Test extends \WP_UnitTestCase {

	/**
	 * Start every test six months after activation, with no saved badge progress.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->set_activation_date( ( new \DateTime( 'first day of this month' ) )->modify( '-6 months' ) );
		\progress_planner()->get_settings()->set( 'badges', [] );
	}

	/**
	 * Set the activation date and drop the cached badge instances built from it.
	 *
	 * @param \DateTime $date The activation date.
	 *
	 * @return void
	 */
	private function set_activation_date( $date ) {
		\progress_planner()->get_settings()->set( 'activation_date', $date->format( 'Y-m-d' ) );

		$instances = new \ReflectionProperty( Monthly::class, 'instances' );
		$instances->setAccessible( true );
		$instances->setValue( null, [] );
	}

	/**
	 * Insert task activities on a date.
	 *
	 * @param string $date  The activity date (Y-m-d).
	 * @param int    $count How many activities.
	 * @param string $type  The activity type.
	 *
	 * @return void
	 */
	private function insert_activities( $date, $count, $type = 'completed' ) {
		static $data_id = 7000;
		for ( $i = 0; $i < $count; $i++ ) {
			$activity           = new Activity();
			$activity->category = 'suggested_task';
			$activity->type     = $type;
			$activity->date     = new \DateTime( $date );
			$activity->data_id  = (string) ++$data_id;
			$activity->user_id  = 1;
			$activity->save();
		}
	}

	/**
	 * Get the badge for a month relative to now.
	 *
	 * @param string $modify A DateTime modifier, e.g. "-1 month".
	 *
	 * @return Monthly
	 */
	private function badge_for( $modify ) {
		$date = ( new \DateTime( 'first day of this month' ) )->modify( $modify );
		return Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( $date ) );
	}

	/**
	 * Months are counted as started months, so this month counts as one.
	 *
	 * @return void
	 */
	public function test_months_since_activation() {
		$widget = new Monthly_Badges();

		$this->set_activation_date( new \DateTime( 'first day of this month' ) );
		$this->assertSame( 1, $widget->get_months_since_activation() );

		$this->set_activation_date( ( new \DateTime( 'first day of this month' ) )->modify( '-3 months' ) );
		$this->assertSame( 4, $widget->get_months_since_activation() );
	}

	/**
	 * The current month's badge is "in progress" until it is complete.
	 *
	 * @return void
	 */
	public function test_current_month_badge_is_in_progress() {
		$this->assertSame( 'in-progress', ( new Monthly_Badges() )->get_popover_badge_state( $this->badge_for( '+0 months' ) ) );
	}

	/**
	 * The previous two months are "missed" while incomplete; older months have no state.
	 *
	 * @return void
	 */
	public function test_only_the_previous_two_months_are_missed() {
		$widget = new Monthly_Badges();

		$this->assertSame( 'missed', $widget->get_popover_badge_state( $this->badge_for( '-1 month' ) ) );
		$this->assertSame( 'missed', $widget->get_popover_badge_state( $this->badge_for( '-2 months' ) ) );
		$this->assertSame( '', $widget->get_popover_badge_state( $this->badge_for( '-3 months' ) ) );
	}

	/**
	 * A complete badge has no hover state.
	 *
	 * @return void
	 */
	public function test_complete_badge_has_no_state() {
		$this->insert_activities( ( new \DateTime( 'first day of this month' ) )->format( 'Y-m-d' ), Monthly::TARGET_POINTS );

		$this->assertSame( '', ( new Monthly_Badges() )->get_popover_badge_state( $this->badge_for( '+0 months' ) ) );
	}

	/**
	 * Earned badges and completed tasks are counted per year and in total.
	 *
	 * @return void
	 */
	public function test_popover_stats_count_badges_and_completed_tasks() {
		$this_month = new \DateTime( 'first day of this month' );
		$year       = (int) $this_month->format( 'Y' );

		// Enough completed tasks to earn this month's badge.
		$this->insert_activities( $this_month->format( 'Y-m-d' ), Monthly::TARGET_POINTS );

		// A task activity that is not a completion is not a completed task.
		$this->insert_activities( $this_month->format( 'Y-m-d' ), 1, 'test_activity' );

		$stats = ( new Monthly_Badges() )->get_popover_stats();

		$this->assertSame( 1, $stats['years'][ $year ]['badges'] );
		$this->assertSame( Monthly::TARGET_POINTS, $stats['years'][ $year ]['tasks'] );
		$this->assertSame( 1, $stats['badges'] );
		$this->assertSame( Monthly::TARGET_POINTS, $stats['tasks'] );
		$this->assertSame( 7, $stats['months'] );
	}
}
