<?php
/**
 * Class Suggested_Tasks_DB_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks_DB;

/**
 * Suggested_Tasks_DB_Test test case.
 */
class Suggested_Tasks_DB_Test extends \WP_UnitTestCase {

	/**
	 * Suggested_Tasks_DB instance.
	 *
	 * @var Suggested_Tasks_DB
	 */
	protected $db;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->db = new Suggested_Tasks_DB();
	}

	/**
	 * Test add method creates a task.
	 *
	 * @return void
	 */
	public function test_add_creates_task() {
		$task_data = [
			'task_id'     => 'test-task',
			'post_title'  => 'Test Task',
			'provider_id' => 'test-provider',
			'description' => 'Test description',
			'priority'    => 10,
		];

		$post_id = $this->db->add( $task_data );

		$this->assertGreaterThan( 0, $post_id );

		\wp_delete_post( $post_id, true );
	}

	/**
	 * Test add method returns 0 when post_title is missing.
	 *
	 * @return void
	 */
	public function test_add_returns_zero_without_title() {
		$task_data = [
			'task_id'     => 'test-task-no-title',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db->add( $task_data );

		$this->assertEquals( 0, $post_id );
	}

	/**
	 * Test add method prevents duplicate tasks.
	 *
	 * @return void
	 */
	public function test_add_prevents_duplicates() {
		$task_data = [
			'task_id'     => 'duplicate-test',
			'post_title'  => 'Duplicate Test',
			'provider_id' => 'test-provider',
		];

		$post_id1 = $this->db->add( $task_data );
		$post_id2 = $this->db->add( $task_data );

		$this->assertGreaterThan( 0, $post_id1 );
		$this->assertEquals( 0, $post_id2 );

		\wp_delete_post( $post_id1, true );
	}

	/**
	 * Test get_post method retrieves a task.
	 *
	 * @return void
	 */
	public function test_get_post() {
		$task_data = [
			'task_id'     => 'get-test',
			'post_title'  => 'Get Test',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db->add( $task_data );
		$task    = $this->db->get_post( 'get-test' );

		$this->assertNotNull( $task );
		$this->assertEquals( 'Get Test', $task->post_title );

		\wp_delete_post( $post_id, true );
	}

	/**
	 * Test get_tasks_by method.
	 *
	 * @return void
	 */
	public function test_get_tasks_by() {
		$task_data = [
			'task_id'     => 'query-test',
			'post_title'  => 'Query Test',
			'provider_id' => 'test-provider',
		];

		$post_id = $this->db->add( $task_data );
		$tasks   = $this->db->get_tasks_by( [ 'provider_id' => 'test-provider' ] );

		$this->assertIsArray( $tasks );
		$this->assertNotEmpty( $tasks );

		\wp_delete_post( $post_id, true );
	}
}
