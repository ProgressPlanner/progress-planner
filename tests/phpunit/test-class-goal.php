<?php
/**
 * Tests for Goals\Goal class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Goals\Goal;

/**
 * Goal test case.
 */
class Goal_Test extends \WP_UnitTestCase {

	/**
	 * Test constructor sets default values.
	 *
	 * @return void
	 */
	public function test_constructor_sets_defaults() {
		$goal    = new Goal();
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
	 * Test constructor sets provided values.
	 *
	 * @return void
	 */
	public function test_constructor_sets_provided_values() {
		$args = [
			'id'          => 'test-goal',
			'title'       => 'Test Goal',
			'description' => 'Test Description',
			'type'        => 'test-type',
			'start_date'  => '2024-01-01',
			'end_date'    => '2024-12-31',
			'status'      => 'active',
			'priority'    => 'high',
			'progress'    => '50%',
			'evaluate'    => '__return_true',
		];

		$goal    = new Goal( $args );
		$details = $goal->get_details();

		$this->assertEquals( 'test-goal', $details['id'] );
		$this->assertEquals( 'Test Goal', $details['title'] );
		$this->assertEquals( 'Test Description', $details['description'] );
		$this->assertEquals( 'test-type', $details['type'] );
		$this->assertEquals( '2024-01-01', $details['start_date'] );
		$this->assertEquals( '2024-12-31', $details['end_date'] );
		$this->assertEquals( 'active', $details['status'] );
		$this->assertEquals( 'high', $details['priority'] );
		$this->assertEquals( '50%', $details['progress'] );
		$this->assertEquals( '__return_true', $details['evaluate'] );
	}

	/**
	 * Test get_details returns all goal properties.
	 *
	 * @return void
	 */
	public function test_get_details_returns_all_properties() {
		$goal = new Goal(
			[
				'id'          => 'test-goal',
				'title'       => 'Test Goal',
				'description' => 'Test Description',
			]
		);

		$details = $goal->get_details();

		$this->assertArrayHasKey( 'id', $details );
		$this->assertArrayHasKey( 'title', $details );
		$this->assertArrayHasKey( 'description', $details );
		$this->assertArrayHasKey( 'type', $details );
		$this->assertArrayHasKey( 'start_date', $details );
		$this->assertArrayHasKey( 'end_date', $details );
		$this->assertArrayHasKey( 'status', $details );
		$this->assertArrayHasKey( 'priority', $details );
		$this->assertArrayHasKey( 'progress', $details );
		$this->assertArrayHasKey( 'evaluate', $details );
	}

	/**
	 * Test set_start_date updates start date.
	 *
	 * @return void
	 */
	public function test_set_start_date() {
		$goal = new Goal();
		$goal->set_start_date( '2024-01-01' );

		$details = $goal->get_details();
		$this->assertEquals( '2024-01-01', $details['start_date'] );
	}

	/**
	 * Test set_end_date updates end date.
	 *
	 * @return void
	 */
	public function test_set_end_date() {
		$goal = new Goal();
		$goal->set_end_date( '2024-12-31' );

		$details = $goal->get_details();
		$this->assertEquals( '2024-12-31', $details['end_date'] );
	}

	/**
	 * Test evaluate calls the evaluate callback.
	 *
	 * @return void
	 */
	public function test_evaluate_calls_callback() {
		$goal = new Goal(
			[
				'evaluate' => '__return_true',
			]
		);

		$this->assertTrue( $goal->evaluate() );
	}

	/**
	 * Test evaluate with custom callback.
	 *
	 * @return void
	 */
	public function test_evaluate_with_custom_callback() {
		$goal = new Goal(
			[
				'evaluate' => function ( $goal ) {
					return $goal->get_details()['id'] === 'test-goal';
				},
				'id'       => 'test-goal',
			]
		);

		$this->assertTrue( $goal->evaluate() );
	}

	/**
	 * Test evaluate returns false for default callback.
	 *
	 * @return void
	 */
	public function test_evaluate_returns_false_for_default() {
		$goal = new Goal();
		$this->assertFalse( $goal->evaluate() );
	}
}
