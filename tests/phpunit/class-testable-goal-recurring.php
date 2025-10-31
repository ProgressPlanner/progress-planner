<?php
/**
 * Testable Goal_Recurring subclass for testing streak calculation.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Goals\Goal_Recurring;

/**
 * Testable Goal_Recurring subclass for testing.
 *
 * This class extends Goal_Recurring to allow injection of mock data
 * for testing the streak calculation algorithm without requiring
 * real goal instances and database operations.
 */
class Testable_Goal_Recurring extends Goal_Recurring {
	/**
	 * Mock occurrences.
	 *
	 * @var array
	 */
	private $mock_occurrences = [];

	/**
	 * Mock goal.
	 *
	 * @var Mock_Goal_Object
	 */
	private $mock_goal;

	/**
	 * Constructor.
	 *
	 * @param array $occurrences    Mock goal occurrences.
	 * @param int   $allowed_breaks Number of allowed breaks.
	 */
	public function __construct( $occurrences, $allowed_breaks ) {
		$this->mock_occurrences = $occurrences;
		$this->mock_goal        = new Mock_Goal_Object();

		// Use reflection to set properties from parent.
		$reflection = new \ReflectionClass( parent::class );

		$property = $reflection->getProperty( 'allowed_break' );
		$property->setAccessible( true );
		$property->setValue( $this, $allowed_breaks );

		$property = $reflection->getProperty( 'goal' );
		$property->setAccessible( true );
		$property->setValue( $this, $this->mock_goal );
	}

	/**
	 * Override get_occurences to return mock data.
	 *
	 * @return array
	 */
	public function get_occurences() {
		return $this->mock_occurrences;
	}

	/**
	 * Override get_goal to return mock goal.
	 *
	 * @return Mock_Goal_Object
	 */
	public function get_goal() {
		return $this->mock_goal;
	}
}
