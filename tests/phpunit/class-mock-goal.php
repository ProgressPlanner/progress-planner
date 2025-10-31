<?php
/**
 * Mock Goal class for testing streak calculation.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Mock Goal class for testing.
 */
class Mock_Goal {
	/**
	 * The evaluation result.
	 *
	 * @var bool
	 */
	private $result;

	/**
	 * Constructor.
	 *
	 * @param bool $result The evaluation result.
	 */
	public function __construct( $result ) {
		$this->result = $result;
	}

	/**
	 * Evaluate the goal.
	 *
	 * @return bool
	 */
	public function evaluate() {
		return $this->result;
	}
}
