<?php
/**
 * Tests for the AI_Tasks_From_Server task provider.
 *
 * Covers the AJAX entry point (capability, nonce, required fields, the cached
 * short-circuit and the missing-license-key path) and task injection, which
 * turns the server payload into recommendation posts and must not create
 * duplicates.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\AI_Tasks_From_Server;

/**
 * AI_Tasks_From_Server test case.
 */
class AI_Tasks_From_Server_Test extends \WP_Ajax_UnitTestCase {

	/**
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();

		$this->_setRole( 'administrator' );
	}

	/**
	 * Clean up.
	 */
	public function tear_down() {
		unset( $_REQUEST['task_id'], $_REQUEST['nonce'] );
		$_POST = [];

		\delete_option( 'progress_planner_license_key' );

		parent::tear_down();
	}

	/**
	 * Populate the request with a signed payload.
	 *
	 * @param mixed $task_id The task ID to submit, or null to omit it.
	 *
	 * @return void
	 */
	protected function set_request( $task_id = null ) {
		if ( null !== $task_id ) {
			$_REQUEST['task_id'] = $task_id;
		}

		$_REQUEST['nonce'] = \wp_create_nonce( 'progress_planner' );

		// The handler reads $_POST; check_ajax_referer reads $_REQUEST.
		$_POST = $_REQUEST; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- nonce verified via check_ajax_referer in the handler.
	}

	/**
	 * Run the AJAX handler and return the decoded JSON response.
	 *
	 * @param AI_Tasks_From_Server $provider The provider.
	 *
	 * @return array|null
	 */
	protected function get_response( $provider ) {
		// WordPress Core's _handleAjax() starts output buffering before calling
		// AJAX actions. We do the same since we call the method directly.
		\ini_set( 'implicit_flush', false ); // phpcs:ignore WordPress.PHP.IniSet.Risky
		\ob_start();

		try {
			$provider->handle_ai_task_execution();
		} catch ( \WPAjaxDieContinueException $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// Expected: wp_send_json_* calls wp_die().
		}

		return \json_decode( $this->_last_response, true );
	}

	/**
	 * A user without manage_options cannot execute AI tasks.
	 *
	 * @return void
	 */
	public function test_execution_requires_the_capability() {
		$this->_setRole( 'editor' );

		$this->set_request( 1 );
		$response = $this->get_response( new AI_Tasks_From_Server() );

		$this->assertFalse( $response['success'], 'An editor should not be able to execute AI tasks.' );
		$this->assertSame(
			'You do not have permission to execute AI tasks.',
			$response['data']['message'],
			'The rejection should come from the capability check.'
		);
	}

	/**
	 * A request without a valid nonce is rejected.
	 *
	 * @return void
	 */
	public function test_execution_requires_a_valid_nonce() {
		$_REQUEST['task_id'] = 1;
		$_REQUEST['nonce']   = 'not-a-valid-nonce';
		$_POST               = $_REQUEST; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- deliberately invalid, asserted below.

		$response = $this->get_response( new AI_Tasks_From_Server() );

		$this->assertFalse( $response['success'], 'An invalid nonce should be rejected.' );
		$this->assertSame( 'Invalid nonce.', $response['data']['message'] );
	}

	/**
	 * A request without a task ID is rejected.
	 *
	 * @return void
	 */
	public function test_execution_requires_a_task_id() {
		$this->set_request();
		$response = $this->get_response( new AI_Tasks_From_Server() );

		$this->assertFalse( $response['success'], 'A missing task ID should be rejected.' );
		$this->assertSame( 'Missing task ID.', $response['data']['message'] );
	}

	/**
	 * A cached response is returned without contacting the server.
	 *
	 * @return void
	 */
	public function test_cached_response_short_circuits_the_request() {
		$task_id = 4242;
		\progress_planner()->get_ai_tasks()->cache_response( $task_id, 'Previously generated answer.' );

		$http_calls = 0;
		$counter    = function ( $preempt ) use ( &$http_calls ) {
			++$http_calls;
			return $preempt;
		};
		\add_filter( 'pre_http_request', $counter );

		$this->set_request( $task_id );
		$response = $this->get_response( new AI_Tasks_From_Server() );

		\remove_filter( 'pre_http_request', $counter );
		\progress_planner()->get_ai_tasks()->clear_cached_response( $task_id );

		$this->assertTrue( $response['success'] );
		$this->assertTrue( $response['data']['cached'], 'The response should be flagged as cached.' );
		$this->assertSame( 'Previously generated answer.', $response['data']['ai_response'] );
		$this->assertSame( 0, $http_calls, 'A cached response must not contact the server.' );
	}

	/**
	 * Without a license key the request fails before any HTTP call.
	 *
	 * @return void
	 */
	public function test_execution_without_a_license_key_fails_before_any_request() {
		\delete_option( 'progress_planner_license_key' );

		$http_calls = 0;
		$counter    = function ( $preempt ) use ( &$http_calls ) {
			++$http_calls;
			return $preempt;
		};
		\add_filter( 'pre_http_request', $counter );

		$this->set_request( 555 );
		$response = $this->get_response( new AI_Tasks_From_Server() );

		\remove_filter( 'pre_http_request', $counter );

		$this->assertFalse( $response['success'] );
		$this->assertSame( 'no_license_key', $response['data']['code'] );
		$this->assertSame( 0, $http_calls, 'A missing license key should short-circuit before the HTTP call.' );
	}

	/**
	 * A server error is surfaced as a failure, and nothing is cached.
	 *
	 * @return void
	 */
	public function test_server_error_is_reported_and_not_cached() {
		\update_option( 'progress_planner_license_key', 'test-license-key' );

		$stub = function () {
			return [
				'headers'  => [],
				'body'     => (string) \wp_json_encode( [ 'message' => 'Quota exceeded.' ] ),
				'response' => [
					'code'    => 429,
					'message' => 'Too Many Requests',
				],
				'cookies'  => [],
				'filename' => null,
			];
		};
		\add_filter( 'pre_http_request', $stub );

		$this->set_request( 777 );
		$response = $this->get_response( new AI_Tasks_From_Server() );

		\remove_filter( 'pre_http_request', $stub );

		$this->assertFalse( $response['success'] );
		$this->assertSame( 'ai_execution_failed', $response['data']['code'] );
		$this->assertSame( 'Quota exceeded.', $response['data']['message'], 'The server message should be surfaced.' );
		$this->assertFalse(
			\progress_planner()->get_ai_tasks()->get_cached_response( 777 ),
			'A failed execution must not be cached.'
		);
	}

	/**
	 * A successful execution is returned and its response cached.
	 *
	 * @return void
	 */
	public function test_successful_execution_is_cached() {
		\update_option( 'progress_planner_license_key', 'test-license-key' );

		$stub = function () {
			return [
				'headers'  => [],
				'body'     => (string) \wp_json_encode( [ 'ai_response' => 'Here is your analysis.' ] ),
				'response' => [
					'code'    => 200,
					'message' => 'OK',
				],
				'cookies'  => [],
				'filename' => null,
			];
		};
		\add_filter( 'pre_http_request', $stub );

		$this->set_request( 888 );
		$response = $this->get_response( new AI_Tasks_From_Server() );

		\remove_filter( 'pre_http_request', $stub );

		$this->assertTrue( $response['success'] );
		$this->assertSame( 'Here is your analysis.', $response['data']['ai_response'] );
		$this->assertSame(
			'Here is your analysis.',
			\progress_planner()->get_ai_tasks()->get_cached_response( 888 ),
			'A successful response should be cached for reuse.'
		);

		\progress_planner()->get_ai_tasks()->clear_cached_response( 888 );
	}

	/**
	 * With no tasks from the server, nothing is injected.
	 *
	 * @return void
	 */
	public function test_no_tasks_are_injected_without_server_tasks() {
		$provider = new AI_Tasks_From_Server();

		$this->assertFalse( $provider->should_add_task(), 'Without server tasks there is nothing to add.' );
		$this->assertSame( [], $provider->get_tasks_to_inject() );
	}

	/**
	 * Server tasks are injected once, and re-running does not duplicate them.
	 *
	 * @return void
	 */
	public function test_server_tasks_are_injected_once() {
		$provider = new AI_Tasks_From_Server();
		$this->set_ai_tasks(
			$provider,
			[
				[
					'task_id'            => 31,
					'title'              => 'Write an about page',
					'ai_prompt_template' => 'Draft copy for {site_url}',
				],
			]
		);

		$this->assertTrue( $provider->should_add_task(), 'Server tasks should be addable.' );

		$first = $provider->get_tasks_to_inject();
		$this->assertCount( 1, $first, 'The server task should be injected.' );

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( 'ai-task-31' );
		$this->assertNotEmpty( $task, 'The injected task should be retrievable by its slug.' );
		$this->assertSame( 'Write an about page', $task->post_title );

		$second = $provider->get_tasks_to_inject();
		$this->assertSame( [], $second, 'Re-running injection must not duplicate an existing task.' );
	}

	/**
	 * A server task without a title falls back to a default.
	 *
	 * @return void
	 */
	public function test_injected_task_falls_back_to_a_default_title() {
		$provider = new AI_Tasks_From_Server();
		$this->set_ai_tasks( $provider, [ [ 'task_id' => 32 ] ] );

		$provider->get_tasks_to_inject();

		$task = \progress_planner()->get_suggested_tasks_db()->get_post( 'ai-task-32' );
		$this->assertNotEmpty( $task );
		$this->assertSame( 'AI Task', $task->post_title, 'A task without a title should use the default.' );
	}

	/**
	 * Set the provider's server tasks, which init() would normally fetch.
	 *
	 * @param AI_Tasks_From_Server $provider The provider.
	 * @param array                $tasks    The tasks to set.
	 *
	 * @return void
	 */
	protected function set_ai_tasks( $provider, $tasks ) {
		$reflection = new \ReflectionProperty( $provider, 'ai_tasks' );
		$reflection->setAccessible( true );
		$reflection->setValue( $provider, $tasks );
	}
}
