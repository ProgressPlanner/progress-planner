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
}

