<?php
/**
 * Class Suggested_Tasks_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks;

/**
 * Suggested_Tasks_Test test case.
 */
class Suggested_Tasks_Test extends \WP_UnitTestCase {

	/**
	 * Suggested_Tasks instance.
	 *
	 * @var Suggested_Tasks
	 */
	protected $suggested_tasks;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->suggested_tasks = new Suggested_Tasks();
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$this->assertEquals( 10, \has_action( 'wp_ajax_progress_planner_suggested_task_action', [ $this->suggested_tasks, 'suggested_task_action' ] ) );
		$this->assertEquals( 10, \has_action( 'automatic_updates_complete', [ $this->suggested_tasks, 'on_automatic_updates_complete' ] ) );
		$this->assertEquals( 0, \has_action( 'init', [ $this->suggested_tasks, 'register_post_type' ] ) );
		$this->assertEquals( 0, \has_action( 'init', [ $this->suggested_tasks, 'register_taxonomy' ] ) );
	}

	/**
	 * Test STATUS_MAP constant exists and has expected values.
	 *
	 * @return void
	 */
	public function test_status_map_constant() {
		$this->assertIsArray( Suggested_Tasks::STATUS_MAP );
		$this->assertArrayHasKey( 'completed', Suggested_Tasks::STATUS_MAP );
		$this->assertArrayHasKey( 'pending', Suggested_Tasks::STATUS_MAP );
		$this->assertArrayHasKey( 'snoozed', Suggested_Tasks::STATUS_MAP );
		$this->assertEquals( 'trash', Suggested_Tasks::STATUS_MAP['completed'] );
		$this->assertEquals( 'publish', Suggested_Tasks::STATUS_MAP['pending'] );
		$this->assertEquals( 'future', Suggested_Tasks::STATUS_MAP['snoozed'] );
	}

	/**
	 * Test insert_activity method.
	 *
	 * @return void
	 */
	public function test_insert_activity() {
		$user_id = $this->factory->user->create();
		\wp_set_current_user( $user_id );

		$this->suggested_tasks->insert_activity( 'test-task-id' );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => 'test-task-id',
				'type'    => 'completed',
			]
		);

		$this->assertNotEmpty( $activities );
		$this->assertEquals( 'test-task-id', $activities[0]->data_id );
		$this->assertEquals( 'completed', $activities[0]->type );
	}

	/**
	 * Test delete_activity method.
	 *
	 * @return void
	 */
	public function test_delete_activity() {
		$user_id = $this->factory->user->create();
		\wp_set_current_user( $user_id );

		$this->suggested_tasks->insert_activity( 'test-task-to-delete' );
		$this->suggested_tasks->delete_activity( 'test-task-to-delete' );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id' => 'test-task-to-delete',
				'type'    => 'completed',
			]
		);

		$this->assertEmpty( $activities );
	}
}
