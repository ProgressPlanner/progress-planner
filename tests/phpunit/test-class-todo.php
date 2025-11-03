<?php
/**
 * Tests for the Task List functionality
 *
 * @package Progress_Planner\Tests
 * @group misc
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Todo;

/**
 * Test case for the Task List class.
 */
class Todo_Test extends \WP_UnitTestCase {

	// phpcs:disable Generic.Commenting.Todo.CommentFound
	/**
	 * Instance of the main class for testing.
	 *
	 * @var Todo
	 */
	protected $todo;
	// phpcs:enable Generic.Commenting.Todo.CommentFound

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->todo = new Todo();
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, \has_action( 'init', [ $this->todo, 'maybe_change_first_item_points_on_monday' ] ) );
		$this->assertEquals( 10, \has_action( 'rest_after_insert_prpl_recommendations', [ $this->todo, 'handle_creating_user_task' ] ) );
	}

	/**
	 * Test maybe_change_first_item_points_on_monday is callable.
	 *
	 * @return void
	 */
	public function test_maybe_change_first_item_points_on_monday_callable() {
		$this->assertTrue( \is_callable( [ $this->todo, 'maybe_change_first_item_points_on_monday' ] ) );
	}

	/**
	 * Test handle_creating_user_task is callable.
	 *
	 * @return void
	 */
	public function test_handle_creating_user_task_callable() {
		$this->assertTrue( \is_callable( [ $this->todo, 'handle_creating_user_task' ] ) );
	}
}
