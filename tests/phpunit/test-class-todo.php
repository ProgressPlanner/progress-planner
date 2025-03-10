<?php // phpcs:disable Generic.Commenting.Todo
/**
 * Class Todo_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Todo;

/**
 * Todo test case.
 */
class Todo_Test extends \WP_UnitTestCase {

	/**
	 * Test get_items method.
	 *
	 * @return void
	 */
	public function test_get_items() {
		$items = \progress_planner()->get_todo()->get_items();
		$this->assertIsArray( $items );
		$this->assertEmpty( $items );
	}
}
// phpcs:enable Generic.Commenting.Todo
