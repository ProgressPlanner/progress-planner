<?php
/**
 * Class WP_CLI_Task_Command_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * WP-CLI Task Command test case.
 *
 * Tests the WP-CLI task commands by executing actual shell commands.
 */
class WP_CLI_Task_Command_Test extends \WP_UnitTestCase {

	/**
	 * Test task ID used for create/get/update/delete tests.
	 *
	 * @var string
	 */
	private $test_task_id = 'phpunit-cli-test-task';

	/**
	 * Run a WP-CLI command.
	 *
	 * @param string $command The WP-CLI command to run (without 'wp' prefix).
	 * @return array{output: string, code: int}
	 */
	private function run_wp_cli( $command ) {
		// Calculate WordPress root from plugin directory (wp-content/plugins/progress-planner).
		$wp_path = \dirname( PROGRESS_PLANNER_DIR, 3 );

		$full_command = \sprintf( 'cd %s && wp %s 2>&1', \escapeshellarg( $wp_path ), $command );

		\exec( $full_command, $output, $return_code ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.system_calls_exec -- Required for WP-CLI integration tests.

		return [
			'output' => \implode( "\n", $output ),
			'code'   => $return_code,
		];
	}

	/**
	 * Clean up test task after tests.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up test task if it exists.
		$this->run_wp_cli( 'prpl task delete ' . \escapeshellarg( $this->test_task_id ) );
		parent::tearDown();
	}

	/**
	 * Test that task list command works.
	 *
	 * @return void
	 */
	public function test_task_list() {
		$result = $this->run_wp_cli( 'prpl task list --format=json' );

		$this->assertEquals( 0, $result['code'], 'Command should succeed. Output: ' . $result['output'] );

		$tasks = \json_decode( $result['output'], true );
		$this->assertIsArray( $tasks, 'Output should be valid JSON array' );
	}

	/**
	 * Test that task list with table format works.
	 *
	 * @return void
	 */
	public function test_task_list_table_format() {
		$result = $this->run_wp_cli( 'prpl task list --format=table' );

		$this->assertEquals( 0, $result['code'], 'Command should succeed. Output: ' . $result['output'] );
		$this->assertStringContainsString( 'task_id', $result['output'], 'Table should contain task_id header' );
	}

	/**
	 * Test task create command.
	 *
	 * @return void
	 */
	public function test_task_create() {
		$result = $this->run_wp_cli(
			\sprintf(
				'prpl task create --task_id=%s --title=%s',
				\escapeshellarg( $this->test_task_id ),
				\escapeshellarg( 'PHPUnit CLI Test Task' )
			)
		);

		$this->assertEquals( 0, $result['code'], 'Command should succeed. Output: ' . $result['output'] );
		$this->assertStringContainsString( 'Success', $result['output'] );
	}

	/**
	 * Test task create without required fields fails.
	 *
	 * @return void
	 */
	public function test_task_create_without_required_fields() {
		$result = $this->run_wp_cli( 'prpl task create' );

		$this->assertNotEquals( 0, $result['code'], 'Command should fail without required fields' );
		$this->assertStringContainsString( 'task_id and title are required', $result['output'] );
	}

	/**
	 * Test task get command.
	 *
	 * @return void
	 */
	public function test_task_get() {
		// First create a task.
		$this->run_wp_cli(
			\sprintf(
				'prpl task create --task_id=%s --title=%s',
				\escapeshellarg( $this->test_task_id ),
				\escapeshellarg( 'PHPUnit CLI Test Task' )
			)
		);

		// Now get it.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task get %s --format=json', \escapeshellarg( $this->test_task_id ) )
		);

		$this->assertEquals( 0, $result['code'], 'Command should succeed. Output: ' . $result['output'] );

		$tasks = \json_decode( $result['output'], true );
		$this->assertIsArray( $tasks, 'Output should be valid JSON array' );
		$this->assertNotEmpty( $tasks, 'Should return at least one task' );
		$this->assertEquals( $this->test_task_id, $tasks[0]['task_id'] ?? '', 'Task ID should match' );
	}

	/**
	 * Test task get with non-existent task.
	 *
	 * @return void
	 */
	public function test_task_get_not_found() {
		$result = $this->run_wp_cli( 'prpl task get non-existent-task-12345' );

		$this->assertNotEquals( 0, $result['code'], 'Command should fail for non-existent task' );
		$this->assertStringContainsString( 'not found', $result['output'] );
	}

	/**
	 * Test task update command.
	 *
	 * @return void
	 */
	public function test_task_update() {
		// First create a task.
		$this->run_wp_cli(
			\sprintf(
				'prpl task create --task_id=%s --title=%s',
				\escapeshellarg( $this->test_task_id ),
				\escapeshellarg( 'PHPUnit CLI Test Task' )
			)
		);

		// Now update it.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task update %s --post_status=draft', \escapeshellarg( $this->test_task_id ) )
		);

		$this->assertEquals( 0, $result['code'], 'Command should succeed. Output: ' . $result['output'] );
		$this->assertStringContainsString( 'Success', $result['output'] );
	}

	/**
	 * Test task delete command.
	 *
	 * @return void
	 */
	public function test_task_delete() {
		// First create a task.
		$this->run_wp_cli(
			\sprintf(
				'prpl task create --task_id=%s --title=%s',
				\escapeshellarg( $this->test_task_id ),
				\escapeshellarg( 'PHPUnit CLI Test Task' )
			)
		);

		// Now delete it.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task delete %s', \escapeshellarg( $this->test_task_id ) )
		);

		$this->assertEquals( 0, $result['code'], 'Command should succeed. Output: ' . $result['output'] );
		$this->assertStringContainsString( 'Success', $result['output'] );

		// Verify it's deleted.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task get %s', \escapeshellarg( $this->test_task_id ) )
		);
		$this->assertStringContainsString( 'not found', $result['output'] );
	}

	/**
	 * Test full CRUD cycle.
	 *
	 * @return void
	 */
	public function test_full_crud_cycle() {
		$task_id = 'phpunit-crud-test-' . \time();

		// Create.
		$result = $this->run_wp_cli(
			\sprintf(
				'prpl task create --task_id=%s --title=%s --description=%s',
				\escapeshellarg( $task_id ),
				\escapeshellarg( 'CRUD Test Task' ),
				\escapeshellarg( 'Testing full CRUD cycle' )
			)
		);
		$this->assertEquals( 0, $result['code'], 'Create should succeed' );

		// Read.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task get %s --format=json', \escapeshellarg( $task_id ) )
		);
		$this->assertEquals( 0, $result['code'], 'Get should succeed' );

		// Update.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task update %s --post_status=draft', \escapeshellarg( $task_id ) )
		);
		$this->assertEquals( 0, $result['code'], 'Update should succeed' );

		// Delete.
		$result = $this->run_wp_cli(
			\sprintf( 'prpl task delete %s', \escapeshellarg( $task_id ) )
		);
		$this->assertEquals( 0, $result['code'], 'Delete should succeed' );
	}
}
