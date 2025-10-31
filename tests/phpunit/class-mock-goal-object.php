<?php
/**
 * Mock Goal object for testing.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Mock Goal object with details.
 *
 * This class provides a minimal implementation of a goal object
 * that can be used in testing without requiring a full goal instance.
 */
class Mock_Goal_Object {
	/**
	 * Get goal details.
	 *
	 * @return array
	 */
	public function get_details() {
		return [
			'title'       => 'Test Goal',
			'description' => 'Test Description',
		];
	}
}
