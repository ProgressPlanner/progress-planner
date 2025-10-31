<?php
/**
 * Unit tests for recurring goal streak calculation.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Goals\Goal_Recurring;
use Progress_Planner\Goals\Goal;

require_once __DIR__ . '/class-mock-goal.php';
require_once __DIR__ . '/class-testable-goal-recurring.php';
require_once __DIR__ . '/class-mock-goal-object.php';

/**
 * Goals_Goal_Recurring test case.
 *
 * Tests the streak calculation algorithm with allowed breaks feature
 * that provides flexibility when users miss occasional goals.
 */
class Goals_Goal_Recurring_Test extends WP_UnitTestCase {

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// Set current user to admin.
		\wp_set_current_user( 1 );
	}

	/**
	 * Test basic streak calculation without breaks.
	 *
	 * @return void
	 */
	public function test_streak_without_breaks() {
		// Create a mock goal that evaluates to true/false based on a sequence.
		$sequence = [ true, true, true, false, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 0 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 1 (only the last goal is met).
		$this->assertEquals( 1, $streak['current_streak'], 'Current streak should be 1' );

		// Max streak should be 3 (first three goals were met consecutively).
		$this->assertEquals( 3, $streak['max_streak'], 'Max streak should be 3' );
	}

	/**
	 * Test streak survives one missed goal with 1 allowed break.
	 *
	 * @return void
	 */
	public function test_streak_with_one_allowed_break() {
		// Sequence: Met, Met, Missed, Met, Met.
		// With 1 allowed break, the streak should continue through the miss.
		$sequence = [ true, true, false, true, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 1 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 4 (entire sequence forms one continuous streak using the break).
		$this->assertEquals( 4, $streak['current_streak'], 'Current streak should be 4' );

		// Max streak should be 4 (same as current since it's all one streak).
		$this->assertEquals( 4, $streak['max_streak'], 'Max streak should be 4 using allowed break' );
	}

	/**
	 * Test streak resets after exceeding allowed breaks.
	 *
	 * @return void
	 */
	public function test_streak_resets_after_max_breaks() {
		// Sequence: Met, Met, Missed, Missed, Met.
		// With 1 allowed break, only the first miss is forgiven.
		// The second miss should reset the streak.
		$sequence = [ true, true, false, false, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 1 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 1 (only last goal met after reset).
		$this->assertEquals( 1, $streak['current_streak'], 'Current streak should be 1 after reset' );

		// Max streak should be 2 (first two met, then break used, then reset on second miss).
		$this->assertEquals( 2, $streak['max_streak'], 'Max streak should be 2' );
	}

	/**
	 * Test max streak calculation across break periods.
	 *
	 * @return void
	 */
	public function test_max_streak_with_multiple_runs() {
		// Sequence: Met, Met, Missed, Met, Met, Met, Met, Missed, Met.
		// With 1 allowed break, we have:
		// - First run: 2 met, break used on first miss, then 4 more met = streak of 6.
		// - Second miss: No breaks left, reset to 0.
		// - Final: 1 met.
		$sequence = [ true, true, false, true, true, true, true, false, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 1 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 1 (only last goal after second reset).
		$this->assertEquals( 1, $streak['current_streak'], 'Current streak should be 1' );

		// Max streak should be 6 (longest run: 2 met + break + 4 met).
		$this->assertEquals( 6, $streak['max_streak'], 'Max streak should be 6' );
	}

	/**
	 * Test perfect streak (no misses).
	 *
	 * @return void
	 */
	public function test_perfect_streak() {
		// All goals met.
		$sequence = [ true, true, true, true, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 1 );
		$streak         = $goal_recurring->get_streak();

		// Both streaks should be 5 (all goals met).
		$this->assertEquals( 5, $streak['current_streak'], 'Current streak should be 5' );
		$this->assertEquals( 5, $streak['max_streak'], 'Max streak should be 5' );
	}

	/**
	 * Test empty goal history.
	 *
	 * @return void
	 */
	public function test_empty_goal_history() {
		$sequence = [];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 0 );
		$streak         = $goal_recurring->get_streak();

		// Both streaks should be 0 (no goals).
		$this->assertEquals( 0, $streak['current_streak'], 'Current streak should be 0 for empty history' );
		$this->assertEquals( 0, $streak['max_streak'], 'Max streak should be 0 for empty history' );
	}

	/**
	 * Test all goals missed.
	 *
	 * @return void
	 */
	public function test_all_goals_missed() {
		$sequence = [ false, false, false, false ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 0 );
		$streak         = $goal_recurring->get_streak();

		// Both streaks should be 0 (all goals missed).
		$this->assertEquals( 0, $streak['current_streak'], 'Current streak should be 0 when all missed' );
		$this->assertEquals( 0, $streak['max_streak'], 'Max streak should be 0 when all missed' );
	}

	/**
	 * Test multiple allowed breaks.
	 *
	 * @return void
	 */
	public function test_multiple_allowed_breaks() {
		// Sequence: Met, Missed, Met, Missed, Met, Met.
		// With 2 allowed breaks, the entire sequence should be one streak.
		$sequence = [ true, false, true, false, true, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 2 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 4 (1 met + break + 1 met + break + 2 met = 4 goals met total).
		$this->assertEquals( 4, $streak['current_streak'], 'Current streak should be 4' );

		// Max streak should be 4 (same as current).
		$this->assertEquals( 4, $streak['max_streak'], 'Max streak should be 4 with 2 allowed breaks' );
	}

	/**
	 * Test allowed breaks are consumed in order.
	 *
	 * @return void
	 */
	public function test_allowed_breaks_consumed_in_order() {
		// Sequence: Met, Met, Missed, Met, Missed, Missed, Met.
		// With 2 allowed breaks:
		// - First miss: Use break 1, streak continues (2 goals met so far).
		// - Second miss: Use break 2, streak continues (3 goals met so far).
		// - Third miss: No breaks left, reset to 0.
		// - Final: 1 met.
		$sequence = [ true, true, false, true, false, false, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 2 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 1 (only last goal after reset).
		$this->assertEquals( 1, $streak['current_streak'], 'Current streak should be 1 after using all breaks' );

		// Max streak should be 3 (2 met + break + 1 met + break = 3 goals met before reset).
		$this->assertEquals( 3, $streak['max_streak'], 'Max streak should be 3' );
	}

	/**
	 * Test current streak at the end of sequence.
	 *
	 * @return void
	 */
	public function test_current_streak_at_end() {
		// Sequence: Missed, Met, Met, Met.
		// Current streak should be 3 (last three goals).
		$sequence = [ false, true, true, true ];

		$goal_recurring = $this->create_mock_recurring_goal( $sequence, 0 );
		$streak         = $goal_recurring->get_streak();

		// Current streak should be 3.
		$this->assertEquals( 3, $streak['current_streak'], 'Current streak should be 3' );

		// Max streak should also be 3.
		$this->assertEquals( 3, $streak['max_streak'], 'Max streak should be 3' );
	}

	/**
	 * Create a mock recurring goal with a predefined evaluation sequence.
	 *
	 * @param array $evaluation_sequence Array of boolean values representing goal evaluation results.
	 * @param int   $allowed_breaks      Number of allowed breaks in the streak.
	 *
	 * @return Goal_Recurring Mock recurring goal instance.
	 */
	protected function create_mock_recurring_goal( $evaluation_sequence, $allowed_breaks ) {
		// Create mock goal occurrences.
		$occurrences = [];
		foreach ( $evaluation_sequence as $result ) {
			$occurrences[] = new Mock_Goal( $result );
		}

		// Create a testable goal instance.
		$goal = new Testable_Goal_Recurring( $occurrences, $allowed_breaks );

		return $goal;
	}
}
