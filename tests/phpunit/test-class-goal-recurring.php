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
	 * Test get_streak returns correct structure with all required keys.
	 *
	 * @return void
	 */
	public function test_get_streak_returns_correct_structure() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-structure',
			'title'       => 'Test Streak Structure',
			'description' => 'Testing structure',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-3 weeks' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-structure', $goal_args, $args );
		$streak = $goal->get_streak();

		$this->assertIsArray( $streak );
		$this->assertArrayHasKey( 'max_streak', $streak );
		$this->assertArrayHasKey( 'current_streak', $streak );
		$this->assertArrayHasKey( 'title', $streak );
		$this->assertArrayHasKey( 'description', $streak );
	}

	/**
	 * Test get_streak when all occurrences are met.
	 *
	 * @return void
	 */
	public function test_get_streak_all_occurrences_met() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-all-met',
			'title'       => 'Test Streak All Met',
			'description' => 'A test goal for streaks',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-4 weeks' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-all-met', $goal_args, $args );
		$streak = $goal->get_streak();

		// When all goals are met, max_streak equals current_streak.
		$this->assertGreaterThanOrEqual( 1, $streak['max_streak'] );
		$this->assertEquals( $streak['max_streak'], $streak['current_streak'] );
		$this->assertEquals( 'Test Streak All Met', $streak['title'] );
		$this->assertEquals( 'A test goal for streaks', $streak['description'] );
	}

	/**
	 * Test get_streak with all goals failing.
	 *
	 * @return void
	 */
	public function test_get_streak_all_failed() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-all-failed',
			'title'       => 'Test All Failed',
			'description' => 'A test goal',
			'evaluate'    => '__return_false',
		];

		$args = [
			'frequency'     => 'weekly',
			'start_date'    => new \DateTime( '-4 weeks' ),
			'end_date'      => new \DateTime( '-1 day' ),
			'allowed_break' => 0,
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-all-failed', $goal_args, $args );
		$streak = $goal->get_streak();

		// When all goals fail, both streaks are 0.
		$this->assertEquals( 0, $streak['max_streak'] );
		$this->assertEquals( 0, $streak['current_streak'] );
	}

	/**
	 * Test get_streak returns title and description from goal.
	 *
	 * @return void
	 */
	public function test_get_streak_returns_goal_details() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-details',
			'title'       => 'My Goal Title',
			'description' => 'My goal description here',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-2 weeks' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-details', $goal_args, $args );
		$streak = $goal->get_streak();

		$this->assertEquals( 'My Goal Title', $streak['title'] );
		$this->assertEquals( 'My goal description here', $streak['description'] );
	}

	/**
	 * Test get_occurences returns Goal instances.
	 *
	 * @return void
	 */
	public function test_get_occurences_returns_goals() {
		$goal_args = [
			'class_name' => Goal::class,
			'id'         => 'test-occurences',
			'title'      => 'Test Occurences',
			'evaluate'   => '__return_true',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-3 weeks' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal       = Goal_Recurring::get_instance( 'test-occurences', $goal_args, $args );
		$occurences = $goal->get_occurences();

		$this->assertIsArray( $occurences );
		$this->assertNotEmpty( $occurences );
		// Each occurrence should be a Goal instance.
		foreach ( $occurences as $occurence ) {
			$this->assertInstanceOf( Goal::class, $occurence );
		}
	}

	/**
	 * Test get_streak with different frequencies.
	 *
	 * @return void
	 */
	public function test_get_streak_with_daily_frequency() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-daily',
			'title'       => 'Test Daily',
			'description' => 'A test goal',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'daily',
			'start_date' => new \DateTime( '-7 days' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-daily', $goal_args, $args );
		$streak = $goal->get_streak();

		// Daily goals over 7 days should have streak >= 6.
		$this->assertGreaterThanOrEqual( 6, $streak['max_streak'] );
		$this->assertEquals( $streak['max_streak'], $streak['current_streak'] );
	}

	/**
	 * Test get_streak with monthly frequency.
	 *
	 * @return void
	 */
	public function test_get_streak_with_monthly_frequency() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-monthly',
			'title'       => 'Test Monthly',
			'description' => 'A test goal',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'monthly',
			'start_date' => new \DateTime( '-3 months' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-monthly', $goal_args, $args );
		$streak = $goal->get_streak();

		// Monthly goals over 3 months should have streak of 2-3.
		$this->assertGreaterThanOrEqual( 2, $streak['max_streak'] );
		$this->assertEquals( $streak['max_streak'], $streak['current_streak'] );
	}

	/**
	 * Test get_streak streak is 0 when using allowed_break but all fail.
	 *
	 * @return void
	 */
	public function test_get_streak_allowed_break_all_fail() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-streak-break-fail',
			'title'       => 'Test Break Fail',
			'description' => 'A test goal',
			'evaluate'    => '__return_false',
		];

		$args = [
			'frequency'     => 'weekly',
			'start_date'    => new \DateTime( '-4 weeks' ),
			'end_date'      => new \DateTime( '-1 day' ),
			'allowed_break' => 2,
		];

		$goal   = Goal_Recurring::get_instance( 'test-streak-break-fail', $goal_args, $args );
		$streak = $goal->get_streak();

		// With allowed_break, streak should still be 0 if all fail (breaks just delay reset).
		$this->assertEquals( 0, $streak['max_streak'] );
		$this->assertEquals( 0, $streak['current_streak'] );
	}

	/**
	 * Test get_goal returns the Goal instance.
	 *
	 * @return void
	 */
	public function test_get_goal_returns_goal_instance() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-get-goal',
			'title'       => 'Test Get Goal',
			'description' => 'A test goal',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-2 weeks' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$recurring_goal = Goal_Recurring::get_instance( 'test-get-goal', $goal_args, $args );
		$goal           = $recurring_goal->get_goal();

		$this->assertInstanceOf( Goal::class, $goal );
		$this->assertEquals( 'Test Get Goal', $goal->get_details()['title'] );
	}

	/**
	 * Test get_streak calculates current_streak correctly.
	 *
	 * @return void
	 */
	public function test_get_streak_current_streak_calculation() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-current-streak',
			'title'       => 'Test Current Streak',
			'description' => 'A test goal',
			'evaluate'    => '__return_true',
		];

		$args = [
			'frequency'  => 'weekly',
			'start_date' => new \DateTime( '-5 weeks' ),
			'end_date'   => new \DateTime( '-1 day' ),
		];

		$goal       = Goal_Recurring::get_instance( 'test-current-streak', $goal_args, $args );
		$occurences = $goal->get_occurences();
		$streak     = $goal->get_streak();

		// Current streak should equal number of occurrences when all pass.
		$this->assertCount( $streak['current_streak'], $occurences );
	}

	/**
	 * Test get_streak is idempotent (calling twice returns same result).
	 *
	 * @return void
	 */
	public function test_get_streak_is_idempotent() {
		$goal_args = [
			'class_name'  => Goal::class,
			'id'          => 'test-idempotent',
			'title'       => 'Test Idempotent',
			'description' => 'A test goal',
			'evaluate'    => '__return_false',
		];

		$args = [
			'frequency'     => 'weekly',
			'start_date'    => new \DateTime( '-4 weeks' ),
			'end_date'      => new \DateTime( '-1 day' ),
			'allowed_break' => 2,
		];

		$goal = Goal_Recurring::get_instance( 'test-idempotent', $goal_args, $args );

		// Call get_streak twice and verify results are identical.
		$streak1 = $goal->get_streak();
		$streak2 = $goal->get_streak();

		$this->assertEquals( $streak1['max_streak'], $streak2['max_streak'] );
		$this->assertEquals( $streak1['current_streak'], $streak2['current_streak'] );
	}
}
