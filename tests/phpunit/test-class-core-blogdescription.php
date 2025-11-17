<?php
/**
 * Class Core_Blogdescription_Test
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Core blogdescription test case.
 */
class Core_Blogdescription_Test extends \WP_UnitTestCase {

	use Task_Provider_Test_Trait;

	/**
	 * The task provider ID.
	 *
	 * @var string
	 */
	protected $task_provider_id = 'core-blogdescription';

	/**
	 * Complete the task.
	 *
	 * @return void
	 */
	protected function complete_task() {
		// Update blog description.
		\update_option( 'blogdescription', 'Test blog description' );
	}

	/**
	 * Test complete_task updates blogdescription.
	 *
	 * @return void
	 */
	public function test_complete_task_updates_blogdescription() {
		// Set initial value.
		\update_option( 'blogdescription', 'Old Description' );

		$result = $this->task_provider->complete_task( [ 'blogdescription' => 'New Description' ] );

		$this->assertTrue( $result );
		$this->assertEquals( 'New Description', \get_option( 'blogdescription' ) );
	}

	/**
	 * Test complete_task sanitizes input.
	 *
	 * @return void
	 */
	public function test_complete_task_sanitizes_input() {
		// Ensure we have admin user.
		\wp_set_current_user( 1 );

		// Set a different value first.
		\update_option( 'blogdescription', 'Original Value' );

		// Test with potentially malicious input.
		$malicious_input = '<script>alert("xss")</script>Malicious Content';
		$result          = $this->task_provider->complete_task( [ 'blogdescription' => $malicious_input ] );

		$this->assertTrue( $result );
		$saved_value = \get_option( 'blogdescription' );
		// sanitize_text_field strips HTML tags, so the result should be 'Malicious Content'.
		$this->assertEquals( 'Malicious Content', $saved_value );
		// Verify no script tags are present.
		$this->assertStringNotContainsString( '<script>', $saved_value );
	}

	/**
	 * Test complete_task returns true on success.
	 *
	 * @return void
	 */
	public function test_complete_task_returns_true_on_success() {
		// Ensure we have admin user.
		\wp_set_current_user( 1 );

		// Set a different value first to ensure update_option returns true.
		\update_option( 'blogdescription', 'Old Description' );
		$result = $this->task_provider->complete_task( [ 'blogdescription' => 'New Test Description' ] );
		$this->assertTrue( $result );
		// Verify the value was actually updated.
		$this->assertEquals( 'New Test Description', \get_option( 'blogdescription' ) );
	}

	/**
	 * Test complete_task missing arg.
	 *
	 * @return void
	 */
	public function test_complete_task_missing_arg() {
		$result = $this->task_provider->complete_task( [] );
		$this->assertFalse( $result );

		// Verify option was not changed.
		$original = \get_option( 'blogdescription' );
		$this->task_provider->complete_task( [ 'blogdescription' => 'Test' ] );
		\update_option( 'blogdescription', $original );
	}

	/**
	 * Test complete_task without capability.
	 *
	 * @return void
	 */
	public function test_complete_task_without_capability() {
		// Create a user without manage_options capability.
		$user_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $user_id );

		// Get a fresh instance of the provider.
		$provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'core-blogdescription' );

		$result = $provider->complete_task( [ 'blogdescription' => 'Test Description' ] );
		$this->assertFalse( $result );

		// Restore admin user.
		\wp_set_current_user( 1 );
	}
}
