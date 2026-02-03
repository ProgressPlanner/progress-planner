<?php
/**
 * REST API Badge_Stats test case.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Badge_Stats;

/**
 * REST API Badge_Stats test case.
 */
class Rest_Badge_Stats_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Badge_Stats
	 */
	private $rest_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->rest_instance = new Badge_Stats();
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
		$this->assertArrayHasKey( '/progress-planner/v1/badge-stats', $routes );
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
	 * Test get_badge_stats returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_get_badge_stats_returns_rest_response() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/badge-stats' );
		$response = $this->rest_instance->get_badge_stats( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test get_badge_stats returns badges array.
	 *
	 * @return void
	 */
	public function test_get_badge_stats_returns_badges_array() {
		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/badge-stats' );
		$response = $this->rest_instance->get_badge_stats( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'badges', $data );
		$this->assertIsArray( $data['badges'] );
	}

	/**
	 * Test get_badge_stats returns saved badges.
	 *
	 * @return void
	 */
	public function test_get_badge_stats_returns_saved_badges() {
		// Save some badge stats.
		$settings = \progress_planner()->get_settings();
		$badges   = [
			'content-curator' => [
				'progress'  => 50,
				'remaining' => 50,
			],
		];
		$settings->set( 'badges', $badges );

		$request  = new \WP_REST_Request( 'GET', '/progress-planner/v1/badge-stats' );
		$response = $this->rest_instance->get_badge_stats( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey( 'content-curator', $data['badges'] );
		$this->assertEquals( 50, $data['badges']['content-curator']['progress'] );
	}

	/**
	 * Test validate_badge_stats with valid data.
	 *
	 * @return void
	 */
	public function test_validate_badge_stats_valid_data() {
		$badges = [
			'content-curator' => [
				'progress'  => 50,
				'remaining' => 50,
			],
		];

		$this->assertTrue( $this->rest_instance->validate_badge_stats( $badges ) );
	}

	/**
	 * Test validate_badge_stats with invalid data - non-array.
	 *
	 * @return void
	 */
	public function test_validate_badge_stats_invalid_non_array() {
		$this->assertFalse( $this->rest_instance->validate_badge_stats( 'not-an-array' ) );
	}

	/**
	 * Test validate_badge_stats with invalid badge data - non-array value.
	 *
	 * @return void
	 */
	public function test_validate_badge_stats_invalid_badge_value() {
		$badges = [
			'content-curator' => 'not-an-array',
		];

		$this->assertFalse( $this->rest_instance->validate_badge_stats( $badges ) );
	}

	/**
	 * Test validate_badge_stats with missing progress.
	 *
	 * @return void
	 */
	public function test_validate_badge_stats_missing_progress() {
		$badges = [
			'content-curator' => [
				'remaining' => 50,
			],
		];

		$this->assertFalse( $this->rest_instance->validate_badge_stats( $badges ) );
	}

	/**
	 * Test validate_badge_stats with missing remaining.
	 *
	 * @return void
	 */
	public function test_validate_badge_stats_missing_remaining() {
		$badges = [
			'content-curator' => [
				'progress' => 50,
			],
		];

		$this->assertFalse( $this->rest_instance->validate_badge_stats( $badges ) );
	}

	/**
	 * Test validate_badge_stats with non-numeric progress.
	 *
	 * @return void
	 */
	public function test_validate_badge_stats_non_numeric_progress() {
		$badges = [
			'content-curator' => [
				'progress'  => 'fifty',
				'remaining' => 50,
			],
		];

		$this->assertFalse( $this->rest_instance->validate_badge_stats( $badges ) );
	}

	/**
	 * Test save_badge_stats returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_returns_rest_response() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param(
			'badges',
			[
				'content-curator' => [
					'progress'  => 50,
					'remaining' => 50,
				],
			]
		);

		$response = $this->rest_instance->save_badge_stats( $request );

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test save_badge_stats saves badge data.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_saves_data() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param(
			'badges',
			[
				'content-curator' => [
					'progress'  => 75,
					'remaining' => 25,
				],
			]
		);

		$this->rest_instance->save_badge_stats( $request );

		$settings = \progress_planner()->get_settings();
		$badges   = $settings->get( 'badges', [] );

		$this->assertArrayHasKey( 'content-curator', $badges );
		$this->assertEquals( 75, $badges['content-curator']['progress'] );
	}

	/**
	 * Test save_badge_stats returns success response.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_success_response() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param(
			'badges',
			[
				'content-curator' => [
					'progress'  => 50,
					'remaining' => 50,
				],
			]
		);

		$response = $this->rest_instance->save_badge_stats( $request );
		$data     = $response->get_data();

		$this->assertTrue( $data['success'] );
		$this->assertArrayHasKey( 'badges', $data );
	}

	/**
	 * Test save_badge_stats sets completion date for 100% progress.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_sets_completion_date() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param(
			'badges',
			[
				'content-curator' => [
					'progress'  => 100,
					'remaining' => 0,
				],
			]
		);

		$this->rest_instance->save_badge_stats( $request );

		$settings = \progress_planner()->get_settings();
		$badges   = $settings->get( 'badges', [] );

		$this->assertArrayHasKey( 'date', $badges['content-curator'] );
	}

	/**
	 * Test save_badge_stats preserves existing completion date.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_preserves_completion_date() {
		$old_date = '2024-01-15 10:00:00';

		// Set up existing completed badge.
		$settings = \progress_planner()->get_settings();
		$settings->set(
			'badges',
			[
				'content-curator' => [
					'progress'  => 100,
					'remaining' => 0,
					'date'      => $old_date,
				],
			]
		);

		// Save again with same progress.
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param(
			'badges',
			[
				'content-curator' => [
					'progress'  => 100,
					'remaining' => 0,
				],
			]
		);

		$this->rest_instance->save_badge_stats( $request );

		$badges = $settings->get( 'badges', [] );

		// Date should be preserved.
		$this->assertEquals( $old_date, $badges['content-curator']['date'] );
	}

	/**
	 * Test save_badge_stats merges with existing badges.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_merges_badges() {
		// Set up existing badge.
		$settings = \progress_planner()->get_settings();
		$settings->set(
			'badges',
			[
				'revision-ranger' => [
					'progress'  => 30,
					'remaining' => 70,
				],
			]
		);

		// Save a different badge.
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param(
			'badges',
			[
				'content-curator' => [
					'progress'  => 50,
					'remaining' => 50,
				],
			]
		);

		$this->rest_instance->save_badge_stats( $request );

		$badges = $settings->get( 'badges', [] );

		// Both badges should exist.
		$this->assertArrayHasKey( 'revision-ranger', $badges );
		$this->assertArrayHasKey( 'content-curator', $badges );
	}

	/**
	 * Test save_badge_stats with invalid data returns error.
	 *
	 * @return void
	 */
	public function test_save_badge_stats_invalid_data_returns_error() {
		$request = new \WP_REST_Request( 'POST', '/progress-planner/v1/badge-stats' );
		$request->set_param( 'badges', 'not-an-array' );

		$response = $this->rest_instance->save_badge_stats( $request );

		$this->assertInstanceOf( \WP_Error::class, $response );
	}
}
