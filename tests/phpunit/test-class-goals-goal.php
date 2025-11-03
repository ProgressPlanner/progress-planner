<?php
/**
 * Unit tests for Goals\Goal class.
 *
 * @package Progress_Planner\Tests
 * @group goals
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Goals\Goal;

/**
 * Goals_Goal test case.
 *
 * Tests the Goals\Goal class that represents individual goals.
 *
 * @group goals
 */
class Goals_Goal_Test extends WP_UnitTestCase {

	/**
	 * Test constructor with default values.
	 */
	public function test_constructor_defaults() {
		$goal = new Goal();

		$details = $goal->get_details();

		$this->assertEquals( '', $details['id'] );
		$this->assertEquals( '', $details['title'] );
		$this->assertEquals( '', $details['description'] );
		$this->assertEquals( '', $details['type'] );
		$this->assertEquals( '', $details['start_date'] );
		$this->assertEquals( '', $details['end_date'] );
		$this->assertEquals( '', $details['status'] );
		$this->assertEquals( '', $details['priority'] );
		$this->assertEquals( '', $details['progress'] );
		$this->assertEquals( '__return_false', $details['evaluate'] );
	}

	/**
	 * Test constructor with custom values.
	 */
	public function test_constructor_custom_values() {
		$args = [
			'id'          => 'goal-123',
			'title'       => 'Test Goal',
			'description' => 'Test Description',
			'type'        => 'content',
			'start_date'  => '2025-01-01',
			'end_date'    => '2025-12-31',
			'status'      => 'active',
			'priority'    => 'high',
			'progress'    => '50',
		];

		$goal = new Goal( $args );

		$details = $goal->get_details();

		$this->assertEquals( 'goal-123', $details['id'] );
		$this->assertEquals( 'Test Goal', $details['title'] );
		$this->assertEquals( 'Test Description', $details['description'] );
		$this->assertEquals( 'content', $details['type'] );
		$this->assertEquals( '2025-01-01', $details['start_date'] );
		$this->assertEquals( '2025-12-31', $details['end_date'] );
		$this->assertEquals( 'active', $details['status'] );
		$this->assertEquals( 'high', $details['priority'] );
		$this->assertEquals( '50', $details['progress'] );
	}

	/**
	 * Test get_details() returns array.
	 */
	public function test_get_details_returns_array() {
		$goal = new Goal();

		$details = $goal->get_details();

		$this->assertIsArray( $details );
	}

	/**
	 * Test get_details() contains all expected keys.
	 */
	public function test_get_details_has_all_keys() {
		$goal = new Goal();

		$details = $goal->get_details();

		$expected_keys = [
			'id',
			'title',
			'description',
			'type',
			'start_date',
			'end_date',
			'status',
			'priority',
			'progress',
			'evaluate',
		];

		foreach ( $expected_keys as $key ) {
			$this->assertArrayHasKey( $key, $details, "Details should have $key key" );
		}
	}

	/**
	 * Test set_start_date() updates start date.
	 */
	public function test_set_start_date() {
		$goal = new Goal();

		$goal->set_start_date( '2025-06-01' );

		$details = $goal->get_details();

		$this->assertEquals( '2025-06-01', $details['start_date'] );
	}

	/**
	 * Test set_end_date() updates end date.
	 */
	public function test_set_end_date() {
		$goal = new Goal();

		$goal->set_end_date( '2025-12-31' );

		$details = $goal->get_details();

		$this->assertEquals( '2025-12-31', $details['end_date'] );
	}

	/**
	 * Test set_start_date() with empty string.
	 */
	public function test_set_start_date_empty() {
		$goal = new Goal( [ 'start_date' => '2025-01-01' ] );

		$goal->set_start_date( '' );

		$details = $goal->get_details();

		$this->assertEquals( '', $details['start_date'] );
	}

	/**
	 * Test set_end_date() with empty string.
	 */
	public function test_set_end_date_empty() {
		$goal = new Goal( [ 'end_date' => '2025-12-31' ] );

		$goal->set_end_date( '' );

		$details = $goal->get_details();

		$this->assertEquals( '', $details['end_date'] );
	}

	/**
	 * Test evaluate() with default callback.
	 */
	public function test_evaluate_default_callback() {
		$goal = new Goal();

		$result = $goal->evaluate();

		$this->assertFalse( $result, 'Default __return_false should return false' );
	}

	/**
	 * Test evaluate() with custom callback returning true.
	 */
	public function test_evaluate_custom_callback_true() {
		$goal = new Goal(
			[
				'evaluate' => function ( $goal_obj ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
					return true;
				},
			]
		);

		$result = $goal->evaluate();

		$this->assertTrue( $result );
	}

	/**
	 * Test evaluate() with custom callback returning false.
	 */
	public function test_evaluate_custom_callback_false() {
		$goal = new Goal(
			[
				'evaluate' => function ( $goal_obj ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
					return false;
				},
			]
		);

		$result = $goal->evaluate();

		$this->assertFalse( $result );
	}

	/**
	 * Test evaluate() callback receives goal object.
	 */
	public function test_evaluate_callback_receives_goal() {
		$received_goal = null;

		$goal = new Goal(
			[
				'id'       => 'test-goal',
				'evaluate' => function ( $goal_obj ) use ( &$received_goal ) {
					$received_goal = $goal_obj;
					return true;
				},
			]
		);

		$goal->evaluate();

		$this->assertInstanceOf( Goal::class, $received_goal );
		$this->assertEquals( 'test-goal', $received_goal->get_details()['id'] );
	}

	/**
	 * Test evaluate() with callback that checks progress.
	 */
	public function test_evaluate_with_progress_check() {
		$goal = new Goal(
			[
				'progress' => '100',
				'evaluate' => function ( $goal_obj ) {
					$details = $goal_obj->get_details();
					return $details['progress'] === '100';
				},
			]
		);

		$result = $goal->evaluate();

		$this->assertTrue( $result, 'Should return true when progress is 100' );
	}

	/**
	 * Test constructor with partial args.
	 */
	public function test_constructor_partial_args() {
		$goal = new Goal(
			[
				'id'    => 'partial-goal',
				'title' => 'Partial Goal',
			]
		);

		$details = $goal->get_details();

		$this->assertEquals( 'partial-goal', $details['id'] );
		$this->assertEquals( 'Partial Goal', $details['title'] );
		$this->assertEquals( '', $details['description'], 'Non-provided args should use defaults' );
		$this->assertEquals( '', $details['type'], 'Non-provided args should use defaults' );
	}

	/**
	 * Test multiple set_start_date() calls.
	 */
	public function test_multiple_set_start_date_calls() {
		$goal = new Goal();

		$goal->set_start_date( '2025-01-01' );
		$this->assertEquals( '2025-01-01', $goal->get_details()['start_date'] );

		$goal->set_start_date( '2025-02-01' );
		$this->assertEquals( '2025-02-01', $goal->get_details()['start_date'], 'Should update to latest value' );
	}

	/**
	 * Test multiple set_end_date() calls.
	 */
	public function test_multiple_set_end_date_calls() {
		$goal = new Goal();

		$goal->set_end_date( '2025-12-31' );
		$this->assertEquals( '2025-12-31', $goal->get_details()['end_date'] );

		$goal->set_end_date( '2025-11-30' );
		$this->assertEquals( '2025-11-30', $goal->get_details()['end_date'], 'Should update to latest value' );
	}

	/**
	 * Test goal with all properties set.
	 */
	public function test_goal_with_all_properties() {
		$args = [
			'id'          => 'complete-goal',
			'title'       => 'Complete Goal',
			'description' => 'A fully populated goal',
			'type'        => 'maintenance',
			'start_date'  => '2025-01-01',
			'end_date'    => '2025-12-31',
			'status'      => 'completed',
			'priority'    => 'high',
			'progress'    => '100',
			'evaluate'    => '__return_true',
		];

		$goal = new Goal( $args );

		$details = $goal->get_details();

		foreach ( $args as $key => $value ) {
			$this->assertEquals( $value, $details[ $key ], "Property $key should match" );
		}
	}

	/**
	 * Test goal type property.
	 */
	public function test_goal_type_property() {
		$goal = new Goal( [ 'type' => 'content' ] );

		$details = $goal->get_details();

		$this->assertEquals( 'content', $details['type'] );
	}

	/**
	 * Test goal status property.
	 */
	public function test_goal_status_property() {
		$goal = new Goal( [ 'status' => 'active' ] );

		$details = $goal->get_details();

		$this->assertEquals( 'active', $details['status'] );
	}

	/**
	 * Test goal priority property.
	 */
	public function test_goal_priority_property() {
		$goal = new Goal( [ 'priority' => 'low' ] );

		$details = $goal->get_details();

		$this->assertEquals( 'low', $details['priority'] );
	}

	/**
	 * Test goal progress property.
	 */
	public function test_goal_progress_property() {
		$goal = new Goal( [ 'progress' => '75' ] );

		$details = $goal->get_details();

		$this->assertEquals( '75', $details['progress'] );
	}

	/**
	 * Test date setters don't affect other properties.
	 */
	public function test_date_setters_isolation() {
		$goal = new Goal(
			[
				'id'         => 'test-id',
				'title'      => 'Test Title',
				'start_date' => '2025-01-01',
				'end_date'   => '2025-12-31',
			]
		);

		$goal->set_start_date( '2025-02-01' );

		$details = $goal->get_details();

		// Check that only start_date changed.
		$this->assertEquals( '2025-02-01', $details['start_date'] );
		$this->assertEquals( '2025-12-31', $details['end_date'] );
		$this->assertEquals( 'test-id', $details['id'] );
		$this->assertEquals( 'Test Title', $details['title'] );
	}

	/**
	 * Test evaluate() with named function.
	 */
	public function test_evaluate_with_named_function() {
		$goal = new Goal( [ 'evaluate' => '__return_true' ] );

		$result = $goal->evaluate();

		$this->assertTrue( $result );
	}

	/**
	 * Test constructor with numeric values.
	 */
	public function test_constructor_with_numeric_values() {
		$goal = new Goal(
			[
				'priority' => 1,
				'progress' => 50,
			]
		);

		$details = $goal->get_details();

		$this->assertEquals( 1, $details['priority'] );
		$this->assertEquals( 50, $details['progress'] );
	}
}
