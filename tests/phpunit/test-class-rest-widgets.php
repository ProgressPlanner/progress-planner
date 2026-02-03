<?php
/**
 * REST API Widgets test case.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Widgets\Activity_Scores;
use Progress_Planner\Rest\Widgets\Content_Activity;
use Progress_Planner\Rest\Widgets\Whats_New;

/**
 * REST API Widgets test case.
 */
class Rest_Widgets_Test extends \WP_UnitTestCase {

	/**
	 * Activity_Scores instance.
	 *
	 * @var Activity_Scores
	 */
	private $activity_scores;

	/**
	 * Content_Activity instance.
	 *
	 * @var Content_Activity
	 */
	private $content_activity;

	/**
	 * Whats_New instance.
	 *
	 * @var Whats_New
	 */
	private $whats_new;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->activity_scores  = new Activity_Scores();
		$this->content_activity = new Content_Activity();
		$this->whats_new        = new Whats_New();
	}

	// =========================================================================
	// Activity Scores Tests
	// =========================================================================

	/**
	 * Test Activity Scores REST endpoint registration.
	 *
	 * @return void
	 */
	public function test_activity_scores_endpoint_registered() {
		global $wp_rest_server;

		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );

		$routes = $wp_rest_server->get_routes();
		$this->assertArrayHasKey( '/progress-planner/v1/widgets/activity-scores', $routes );
	}

	/**
	 * Test Activity Scores permission callback.
	 *
	 * @return void
	 */
	public function test_activity_scores_check_permissions_requires_edit_posts() {
		// Test without logged in user.
		\wp_set_current_user( 0 );
		$this->assertFalse( $this->activity_scores->check_permissions() );

		// Test with subscriber (no edit_posts).
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );
		$this->assertFalse( $this->activity_scores->check_permissions() );

		// Test with editor (has edit_posts).
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );
		$this->assertTrue( $this->activity_scores->check_permissions() );
	}

	/**
	 * Test Activity Scores returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_activity_scores_returns_rest_response() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/activity-scores' );
		$response = $this->activity_scores->get_activity_scores( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test Activity Scores response data structure.
	 *
	 * @return void
	 */
	public function test_activity_scores_data_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/activity-scores' );
		$response = $this->activity_scores->get_activity_scores( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'score', $data );
		$this->assertArrayHasKey( 'chartData', $data );
		$this->assertArrayHasKey( 'personalRecord', $data );
		$this->assertArrayHasKey( 'checklist', $data );
	}

	/**
	 * Test Activity Scores score is integer.
	 *
	 * @return void
	 */
	public function test_activity_scores_score_is_integer() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/activity-scores' );
		$response = $this->activity_scores->get_activity_scores( $request );
		$data     = $response->get_data();

		$this->assertIsInt( $data['score'] );
		$this->assertGreaterThanOrEqual( 0, $data['score'] );
		$this->assertLessThanOrEqual( 100, $data['score'] );
	}

	/**
	 * Test Activity Scores personal record structure.
	 *
	 * @return void
	 */
	public function test_activity_scores_personal_record_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/activity-scores' );
		$response = $this->activity_scores->get_activity_scores( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['personalRecord'] );
		$this->assertArrayHasKey( 'maxStreak', $data['personalRecord'] );
		$this->assertArrayHasKey( 'currentStreak', $data['personalRecord'] );
		$this->assertIsInt( $data['personalRecord']['maxStreak'] );
		$this->assertIsInt( $data['personalRecord']['currentStreak'] );
	}

	/**
	 * Test Activity Scores checklist is array.
	 *
	 * @return void
	 */
	public function test_activity_scores_checklist_is_array() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/activity-scores' );
		$response = $this->activity_scores->get_activity_scores( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['checklist'] );
	}

	/**
	 * Test Activity Scores with custom range parameter.
	 *
	 * @return void
	 */
	public function test_activity_scores_with_custom_range() {
		$request = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/activity-scores' );
		$request->set_param( 'range', '-3 months' );
		$request->set_param( 'frequency', 'weekly' );

		$response = $this->activity_scores->get_activity_scores( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'chartData', $data );
	}

	// =========================================================================
	// Content Activity Tests
	// =========================================================================

	/**
	 * Test Content Activity REST endpoint registration.
	 *
	 * @return void
	 */
	public function test_content_activity_endpoint_registered() {
		global $wp_rest_server;

		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );

		$routes = $wp_rest_server->get_routes();
		$this->assertArrayHasKey( '/progress-planner/v1/widgets/content-activity', $routes );
	}

	/**
	 * Test Content Activity permission callback.
	 *
	 * @return void
	 */
	public function test_content_activity_check_permissions_requires_edit_posts() {
		// Test without logged in user.
		\wp_set_current_user( 0 );
		$this->assertFalse( $this->content_activity->check_permissions() );

		// Test with subscriber (no edit_posts).
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );
		$this->assertFalse( $this->content_activity->check_permissions() );

		// Test with editor (has edit_posts).
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );
		$this->assertTrue( $this->content_activity->check_permissions() );
	}

	/**
	 * Test Content Activity returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_content_activity_returns_rest_response() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/content-activity' );
		$response = $this->content_activity->get_content_activity( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test Content Activity response data structure.
	 *
	 * @return void
	 */
	public function test_content_activity_data_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/content-activity' );
		$response = $this->content_activity->get_content_activity( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'chartData', $data );
		$this->assertArrayHasKey( 'chartOptions', $data );
		$this->assertArrayHasKey( 'activityTypes', $data );
		$this->assertArrayHasKey( 'weeklyActivity', $data );
		$this->assertArrayHasKey( 'weeklyTotalCount', $data );
		$this->assertArrayHasKey( 'totalCount', $data );
		$this->assertArrayHasKey( 'i18n', $data );
	}

	/**
	 * Test Content Activity activity types structure.
	 *
	 * @return void
	 */
	public function test_content_activity_activity_types_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/content-activity' );
		$response = $this->content_activity->get_content_activity( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['activityTypes'] );
		$this->assertArrayHasKey( 'publish', $data['activityTypes'] );
		$this->assertArrayHasKey( 'update', $data['activityTypes'] );
		$this->assertArrayHasKey( 'delete', $data['activityTypes'] );

		// Each type should have label and color.
		foreach ( $data['activityTypes'] as $type ) {
			$this->assertArrayHasKey( 'label', $type );
			$this->assertArrayHasKey( 'color', $type );
		}
	}

	/**
	 * Test Content Activity weekly activity structure.
	 *
	 * @return void
	 */
	public function test_content_activity_weekly_activity_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/content-activity' );
		$response = $this->content_activity->get_content_activity( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['weeklyActivity'] );
		$this->assertArrayHasKey( 'publish', $data['weeklyActivity'] );
		$this->assertArrayHasKey( 'update', $data['weeklyActivity'] );
		$this->assertArrayHasKey( 'delete', $data['weeklyActivity'] );
	}

	/**
	 * Test Content Activity i18n strings.
	 *
	 * @return void
	 */
	public function test_content_activity_i18n_strings() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/content-activity' );
		$response = $this->content_activity->get_content_activity( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['i18n'] );
		$this->assertArrayHasKey( 'title', $data['i18n'] );
		$this->assertArrayHasKey( 'description', $data['i18n'] );
	}

	/**
	 * Test Content Activity chart data has all activity types.
	 *
	 * @return void
	 */
	public function test_content_activity_chart_data_has_all_types() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/content-activity' );
		$response = $this->content_activity->get_content_activity( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['chartData'] );
		$this->assertArrayHasKey( 'publish', $data['chartData'] );
		$this->assertArrayHasKey( 'update', $data['chartData'] );
		$this->assertArrayHasKey( 'delete', $data['chartData'] );
	}

	// =========================================================================
	// What's New Tests
	// =========================================================================

	/**
	 * Test What's New REST endpoint registration.
	 *
	 * @return void
	 */
	public function test_whats_new_endpoint_registered() {
		global $wp_rest_server;

		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );

		$routes = $wp_rest_server->get_routes();
		$this->assertArrayHasKey( '/progress-planner/v1/widgets/whats-new', $routes );
	}

	/**
	 * Test What's New permission callback.
	 *
	 * @return void
	 */
	public function test_whats_new_check_permissions_requires_edit_posts() {
		// Test without logged in user.
		\wp_set_current_user( 0 );
		$this->assertFalse( $this->whats_new->check_permissions() );

		// Test with subscriber (no edit_posts).
		$subscriber_id = $this->factory->user->create( [ 'role' => 'subscriber' ] );
		\wp_set_current_user( $subscriber_id );
		$this->assertFalse( $this->whats_new->check_permissions() );

		// Test with editor (has edit_posts).
		$editor_id = $this->factory->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );
		$this->assertTrue( $this->whats_new->check_permissions() );
	}

	/**
	 * Test What's New returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_whats_new_returns_rest_response() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/whats-new' );
		$response = $this->whats_new->get_whats_new( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test What's New response data structure.
	 *
	 * @return void
	 */
	public function test_whats_new_data_structure() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/whats-new' );
		$response = $this->whats_new->get_whats_new( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data );
		$this->assertArrayHasKey( 'posts', $data );
		$this->assertArrayHasKey( 'blogUrl', $data );
	}

	/**
	 * Test What's New posts is array.
	 *
	 * @return void
	 */
	public function test_whats_new_posts_is_array() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/whats-new' );
		$response = $this->whats_new->get_whats_new( $request );
		$data     = $response->get_data();

		$this->assertIsArray( $data['posts'] );
	}

	/**
	 * Test What's New blogUrl is string.
	 *
	 * @return void
	 */
	public function test_whats_new_blog_url_is_string() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/widgets/whats-new' );
		$response = $this->whats_new->get_whats_new( $request );
		$data     = $response->get_data();

		$this->assertIsString( $data['blogUrl'] );
	}
}
