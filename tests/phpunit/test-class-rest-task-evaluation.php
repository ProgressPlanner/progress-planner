<?php
/**
 * REST API Task_Evaluation test case.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Task_Evaluation;

/**
 * REST API Task_Evaluation test case.
 */
class Rest_Task_Evaluation_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Task_Evaluation
	 */
	private $rest_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->rest_instance = new Task_Evaluation();
	}

	/**
	 * Test REST endpoint registration.
	 *
	 * @return void
	 */
	public function test_register_rest_endpoint() {
		global $wp_rest_server;

		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );

		$routes = $wp_rest_server->get_routes();
		$this->assertArrayHasKey( '/progress-planner/v1/tasks/evaluate', $routes );
	}

	/**
	 * Test permission callback.
	 *
	 * @return void
	 */
	public function test_permission_callback_requires_edit_others_posts() {
		// Test without logged in user.
		\wp_set_current_user( 0 );
		$this->assertFalse( $this->rest_instance->permission_callback() );

		// Test with author (no edit_others_posts).
		$author_id = $this->factory->user->create( [ 'role' => 'author' ] );
		\wp_set_current_user( $author_id );
		$this->assertFalse( $this->rest_instance->permission_callback() );

		// Test with editor (has edit_others_posts).
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );
		$this->assertTrue( $this->rest_instance->permission_callback() );
	}

	/**
	 * Test validate_task_details with valid data.
	 *
	 * @return void
	 */
	public function test_validate_task_details_valid_data() {
		$task_details = [
			'task_id'     => 'test-task-1',
			'provider_id' => 'test-provider',
			'post_title'  => 'Test Task',
		];

		$request = new \WP_REST_Request();
		$this->assertTrue( $this->rest_instance->validate_task_details( $task_details, $request, 'task_details' ) );
	}

	/**
	 * Test validate_task_details with invalid data - non-array.
	 *
	 * @return void
	 */
	public function test_validate_task_details_invalid_non_array() {
		$request = new \WP_REST_Request();
		$this->assertFalse( $this->rest_instance->validate_task_details( 'not-an-array', $request, 'task_details' ) );
	}

	/**
	 * Test validate_task_details with missing task_id.
	 *
	 * @return void
	 */
	public function test_validate_task_details_missing_task_id() {
		$task_details = [
			'provider_id' => 'test-provider',
			'post_title'  => 'Test Task',
		];

		$request = new \WP_REST_Request();
		$this->assertFalse( $this->rest_instance->validate_task_details( $task_details, $request, 'task_details' ) );
	}

	/**
	 * Test validate_task_details with missing provider_id.
	 *
	 * @return void
	 */
	public function test_validate_task_details_missing_provider_id() {
		$task_details = [
			'task_id'    => 'test-task-1',
			'post_title' => 'Test Task',
		];

		$request = new \WP_REST_Request();
		$this->assertFalse( $this->rest_instance->validate_task_details( $task_details, $request, 'task_details' ) );
	}

	/**
	 * Test validate_task_details with missing post_title.
	 *
	 * @return void
	 */
	public function test_validate_task_details_missing_post_title() {
		$task_details = [
			'task_id'     => 'test-task-1',
			'provider_id' => 'test-provider',
		];

		$request = new \WP_REST_Request();
		$this->assertFalse( $this->rest_instance->validate_task_details( $task_details, $request, 'task_details' ) );
	}

	/**
	 * Test validate_task_details with empty required fields.
	 *
	 * @return void
	 */
	public function test_validate_task_details_empty_fields() {
		$task_details = [
			'task_id'     => '',
			'provider_id' => 'test-provider',
			'post_title'  => 'Test Task',
		];

		$request = new \WP_REST_Request();
		$this->assertFalse( $this->rest_instance->validate_task_details( $task_details, $request, 'task_details' ) );
	}

	/**
	 * Test sanitize_task_details sanitizes string fields.
	 *
	 * @return void
	 */
	public function test_sanitize_task_details_string_fields() {
		$task_details = [
			'task_id'     => '<script>alert("xss")</script>test-task',
			'provider_id' => 'test-provider',
			'post_title'  => '<b>Test Task</b>',
		];

		$request   = new \WP_REST_Request();
		$sanitized = $this->rest_instance->sanitize_task_details( $task_details, $request, 'task_details' );

		$this->assertStringNotContainsString( '<script>', $sanitized['task_id'] );
		$this->assertStringNotContainsString( '<b>', $sanitized['post_title'] );
	}

	/**
	 * Test sanitize_task_details sanitizes integer fields.
	 *
	 * @return void
	 */
	public function test_sanitize_task_details_integer_fields() {
		$task_details = [
			'task_id'     => 'test-task',
			'provider_id' => 'test-provider',
			'post_title'  => 'Test Task',
			'priority'    => '50',
			'points'      => '5',
			'parent'      => '123',
			'order'       => '10',
		];

		$request   = new \WP_REST_Request();
		$sanitized = $this->rest_instance->sanitize_task_details( $task_details, $request, 'task_details' );

		$this->assertIsInt( $sanitized['priority'] );
		$this->assertIsInt( $sanitized['points'] );
		$this->assertIsInt( $sanitized['parent'] );
		$this->assertIsInt( $sanitized['order'] );
	}

	/**
	 * Test sanitize_task_details sanitizes boolean fields.
	 *
	 * @return void
	 */
	public function test_sanitize_task_details_boolean_fields() {
		$task_details = [
			'task_id'     => 'test-task',
			'provider_id' => 'test-provider',
			'post_title'  => 'Test Task',
			'dismissable' => 'true',
		];

		$request   = new \WP_REST_Request();
		$sanitized = $this->rest_instance->sanitize_task_details( $task_details, $request, 'task_details' );

		$this->assertIsBool( $sanitized['dismissable'] );
	}

	/**
	 * Test sanitize_task_details preserves array fields.
	 *
	 * @return void
	 */
	public function test_sanitize_task_details_array_fields() {
		$task_details = [
			'task_id'      => 'test-task',
			'provider_id'  => 'test-provider',
			'post_title'   => 'Test Task',
			'link_setting' => [
				'key' => 'value',
			],
		];

		$request   = new \WP_REST_Request();
		$sanitized = $this->rest_instance->sanitize_task_details( $task_details, $request, 'task_details' );

		$this->assertArrayHasKey( 'link_setting', $sanitized );
		$this->assertEquals( [ 'key' => 'value' ], $sanitized['link_setting'] );
	}

	/**
	 * Test create_task creates a task successfully.
	 *
	 * @return void
	 */
	public function test_create_task_success() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/tasks/evaluate' );
		$request->set_param(
			'task_details',
			[
				'task_id'     => 'test-create-task-' . \time(),
				'provider_id' => 'test-provider',
				'post_title'  => 'Test Create Task',
			]
		);

		$response = $this->rest_instance->create_task( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
		$data = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertArrayHasKey( 'post_id', $data );
		$this->assertGreaterThan( 0, $data['post_id'] );
	}

	/**
	 * Test create_task returns existing task if already exists.
	 *
	 * @return void
	 */
	public function test_create_task_returns_existing() {
		$task_id = 'test-existing-task-' . \time();

		// Create the task first.
		\progress_planner()->get_suggested_tasks_db()->add(
			[
				'task_id'     => $task_id,
				'provider_id' => 'test-provider',
				'post_title'  => 'Existing Task',
			]
		);

		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/tasks/evaluate' );
		$request->set_param(
			'task_details',
			[
				'task_id'     => $task_id,
				'provider_id' => 'test-provider',
				'post_title'  => 'Test Task',
			]
		);

		$response = $this->rest_instance->create_task( $request );
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertStringContainsString( 'already exists', $data['message'] );
	}

	/**
	 * Test create_task returns success response with message.
	 *
	 * @return void
	 */
	public function test_create_task_success_has_message() {
		$task_id = 'test-message-task-' . \time();

		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/tasks/evaluate' );
		$request->set_param(
			'task_details',
			[
				'task_id'     => $task_id,
				'provider_id' => 'test-provider',
				'post_title'  => 'Test Task',
			]
		);

		$response = $this->rest_instance->create_task( $request );
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertArrayHasKey( 'message', $data );
		$this->assertNotEmpty( $data['message'] );
	}

	/**
	 * Test create_task sets default values.
	 *
	 * @return void
	 */
	public function test_create_task_default_values() {
		$task_id = 'test-defaults-task-' . \time();

		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/tasks/evaluate' );
		$request->set_param(
			'task_details',
			[
				'task_id'     => $task_id,
				'provider_id' => 'test-provider',
				'post_title'  => 'Test Task',
			]
		);

		$response = $this->rest_instance->create_task( $request );
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );

		// Verify the task was created with defaults.
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );
		$this->assertNotNull( $task );
	}

	/**
	 * Test create_task returns 201 status on success.
	 *
	 * @return void
	 */
	public function test_create_task_returns_201_status() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/tasks/evaluate' );
		$request->set_param(
			'task_details',
			[
				'task_id'     => 'test-status-task-' . \time(),
				'provider_id' => 'test-provider',
				'post_title'  => 'Test Task',
			]
		);

		$response = $this->rest_instance->create_task( $request );

		$this->assertEquals( 201, $response->get_status() );
	}

	/**
	 * Test create_task with all optional fields.
	 *
	 * @return void
	 */
	public function test_create_task_with_all_fields() {
		$task_id = 'test-all-fields-' . \time();

		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/tasks/evaluate' );
		$request->set_param(
			'task_details',
			[
				'task_id'           => $task_id,
				'provider_id'       => 'test-provider',
				'post_title'        => 'Test Task',
				'description'       => 'A test description',
				'priority'          => 75,
				'points'            => 10,
				'url'               => '/wp-admin/options.php',
				'url_target'        => '_blank',
				'external_link_url' => 'https://example.com',
				'dismissable'       => true,
				'link_setting'      => [ 'key' => 'value' ],
			]
		);

		$response = $this->rest_instance->create_task( $request );
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );
	}
}
