<?php
/**
 * Tests for Goals\Goal_Recurring class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Goals\Goal_Recurring;
use Progress_Planner\Goals\Goal;

/**
 * Goal Recurring test case.
 */
class Goal_Recurring_Test extends \WP_UnitTestCase {

	/**
	 * Test get_instance returns Goal_Recurring instance.
	 *
	 * @return void
	 */
	public function test_get_instance_returns_instance() {
		$goal_args = [
			'class_name' => Goal::class,
			'id'         => 'test-recurring-goal',
			'title'      => 'Test Recurring Goal',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-1 week' ),
			'end_date'   => new \DateTime( '+1 week' ),
		];

		$goal = Goal_Recurring::get_instance( 'test-recurring-goal', $goal_args, $args );
		$this->assertInstanceOf( Goal_Recurring::class, $goal );
	}

	/**
	 * Test get_instance returns same instance for same ID.
	 *
	 * @return void
	 */
	public function test_get_instance_returns_same_instance() {
		$goal_args = [
			'class_name' => Goal::class,
			'id'         => 'test-recurring-goal-2',
			'title'      => 'Test Recurring Goal 2',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-1 week' ),
			'end_date'   => new \DateTime( '+1 week' ),
		];

		$goal1 = Goal_Recurring::get_instance( 'test-recurring-goal-2', $goal_args, $args );
		$goal2 = Goal_Recurring::get_instance( 'test-recurring-goal-2', $goal_args, $args );

		$this->assertSame( $goal1, $goal2 );
	}

	/**
	 * Test get_instance creates different instances for different IDs.
	 *
	 * @return void
	 */
	public function test_get_instance_creates_different_instances() {
		$goal_args = [
			'class_name' => Goal::class,
			'id'         => 'test-recurring-goal-3',
			'title'      => 'Test Recurring Goal 3',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-1 week' ),
			'end_date'   => new \DateTime( '+1 week' ),
		];

		$goal1 = Goal_Recurring::get_instance( 'test-recurring-goal-3', $goal_args, $args );
		$goal2 = Goal_Recurring::get_instance( 'test-recurring-goal-4', $goal_args, $args );

		$this->assertNotSame( $goal1, $goal2 );
	}

	/**
	 * Build a weekly goal that started $weeks weeks ago. Whether a week was met
	 * is looked up in $missed by "weeks ago" (0 = this week); other weeks are met.
	 *
	 * @param string $id     A unique goal ID.
	 * @param int    $weeks  How many weeks ago the goal started.
	 * @param int[]  $missed The weeks (counted back from this week) that were missed.
	 *
	 * @return Goal_Recurring
	 */
	private function weekly_goal( $id, $weeks, $missed ) {
		$this_monday = new \DateTime( 'monday this week' );

		return Goal_Recurring::get_instance(
			$id,
			[
				'class_name' => \Progress_Planner\Goals\Goal::class,
				'id'         => $id,
				'title'      => 'Test',
				'evaluate'   => function ( $goal ) use ( $this_monday, $missed ) {
					$weeks_ago = (int) \round( ( $this_monday->getTimestamp() - $goal->get_details()['start_date']->getTimestamp() ) / WEEK_IN_SECONDS );
					return ! \in_array( $weeks_ago, $missed, true );
				},
			],
			[
				'frequency'     => 'weekly',
				'start_date'    => new \DateTime( "monday this week -{$weeks} weeks +1 day" ),
				'end_date'      => new \DateTime(),
				'allowed_break' => 1,
			]
		);
	}

	/**
	 * The streak freeze is reported, and a second call gives the same result.
	 *
	 * @return void
	 */
	public function test_streak_freeze_is_reported_and_stable() {
		// Six past weeks; three weeks ago was missed. The current week is met.
		$goal = $this->weekly_goal( 'test-streak-freeze', 6, [ 3 ] );

		$first  = $goal->get_streak();
		$second = $goal->get_streak();

		$this->assertTrue( $first['freeze_used'] );
		// Weeks 6, 5 and 4 ago were met before the miss.
		$this->assertSame( 3, $first['freeze_week'] );
		$this->assertSame( $first, $second, 'Calling get_streak() twice must give the same result' );
		$this->assertSame( $first['max_streak'], $first['current_streak'] );
	}

	/**
	 * A current week without activity yet does not use the freeze or break the streak.
	 *
	 * @return void
	 */
	public function test_current_week_without_activity_is_not_a_miss() {
		// Four past weeks met; nothing yet this week.
		$goal = $this->weekly_goal( 'test-streak-ongoing', 4, [ 0 ] );

		$streak = $goal->get_streak();

		$this->assertFalse( $streak['freeze_used'] );
		$this->assertNull( $streak['freeze_week'] );
		$this->assertSame( 4, $streak['current_streak'] );
	}
}
