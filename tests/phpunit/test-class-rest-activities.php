<?php
/**
 * REST API Activities test case.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Activities;

/**
 * REST API Activities test case.
 */
class Rest_Activities_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Activities
	 */
	private $rest_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->rest_instance = new Activities();
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
		$this->assertArrayHasKey( '/progress-planner/v1/activities', $routes );
	}

	/**
	 * Test permission callback.
	 *
	 * @return void
	 */
	public function test_check_permissions_requires_edit_posts() {
		// Test without logged in user.
		\wp_set_current_user( 0 );
		$this->assertFalse( $this->rest_instance->check_permissions() );

		// Test with subscriber (no edit_posts).
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );
		$this->assertFalse( $this->rest_instance->check_permissions() );

		// Test with editor (has edit_posts).
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );
		$this->assertTrue( $this->rest_instance->check_permissions() );
	}

	/**
	 * Test get_activities returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_get_activities_returns_rest_response() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test get_activities returns correct data structure.
	 *
	 * @return void
	 */
	public function test_get_activities_data_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'activities', $data );
		$this->assertArrayHasKey( 'totalPostsCount', $data );
		$this->assertArrayHasKey( 'activationDate', $data );
		$this->assertArrayHasKey( 'config', $data );
	}

	/**
	 * Test get_activities config structure.
	 *
	 * @return void
	 */
	public function test_get_activities_config_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'config', $data );
		$this->assertArrayHasKey( 'brandingId', $data['config'] );
		$this->assertArrayHasKey( 'remoteServerUrl', $data['config'] );
		$this->assertArrayHasKey( 'placeholderUrl', $data['config'] );
	}

	/**
	 * Test get_activities returns activities array.
	 *
	 * @return void
	 */
	public function test_get_activities_returns_activities_array() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['activities'] );
	}

	/**
	 * Test get_activities includes activity data structure.
	 *
	 * @return void
	 */
	public function test_get_activities_activity_structure() {
		// Create a test activity.
		$activity          = new \Progress_Planner\Activities\Suggested_Task();
		$activity->type    = 'completed';
		$activity->data_id = 'test-activity-structure';
		$activity->date    = new \DateTime();
		$activity->save();

		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		$this->assertNotEmpty( $data['activities'] );

		// Find the test activity.
		$test_activity = null;
		foreach ( $data['activities'] as $act ) {
			if ( 'test-activity-structure' === $act['data_id'] ) {
				$test_activity = $act;
				break;
			}
		}

		$this->assertNotNull( $test_activity );
		$this->assertArrayHasKey( 'id', $test_activity );
		$this->assertArrayHasKey( 'date', $test_activity );
		$this->assertArrayHasKey( 'category', $test_activity );
		$this->assertArrayHasKey( 'type', $test_activity );
		$this->assertArrayHasKey( 'data_id', $test_activity );
	}

	/**
	 * Test get_activities includes points for suggested_task activities.
	 *
	 * @return void
	 */
	public function test_get_activities_includes_points_for_suggested_tasks() {
		// Create a suggested_task activity.
		$activity          = new \Progress_Planner\Activities\Suggested_Task();
		$activity->type    = 'completed';
		$activity->data_id = 'test-activity-points';
		$activity->date    = new \DateTime();
		$activity->save();

		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		// Find the suggested_task activity.
		$suggested_task = null;
		foreach ( $data['activities'] as $act ) {
			if ( 'test-activity-points' === $act['data_id'] ) {
				$suggested_task = $act;
				break;
			}
		}

		$this->assertNotNull( $suggested_task );
		$this->assertArrayHasKey( 'points', $suggested_task );
	}

	/**
	 * Test get_activities returns valid totalPostsCount.
	 *
	 * @return void
	 */
	public function test_get_activities_total_posts_count() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		$this->assertIsInt( $data['totalPostsCount'] );
		$this->assertGreaterThanOrEqual( 0, $data['totalPostsCount'] );
	}

	/**
	 * Test get_activities returns valid activationDate.
	 *
	 * @return void
	 */
	public function test_get_activities_activation_date() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/activities' );
		$response = $this->rest_instance->get_activities( $request );
		$data     = $response->get_data();

		$this->assertIsString( $data['activationDate'] );
		// Verify it's a valid date format (Y-m-d).
		$date = \DateTime::createFromFormat( 'Y-m-d', $data['activationDate'] );
		$this->assertNotFalse( $date );
	}
}
