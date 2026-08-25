<?php
/**
 * Class Rest_Stats_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Stats;

/**
 * REST API Stats test case.
 */
class Rest_Stats_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Stats
	 */
	private $rest_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->rest_instance = new Stats();
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
		$this->assertArrayHasKey( '/progress-planner/v1/get-stats/(?P<token>\S+)', $routes );
	}

	/**
	 * Test get_stats returns WP_REST_Response.
	 *
	 * @return void
	 */
	public function test_get_stats_returns_rest_response() {
		$response = $this->rest_instance->get_stats();

		$this->assertInstanceOf( \WP_REST_Response::class, $response );
	}

	/**
	 * Test get_stats returns array structure.
	 *
	 * @return void
	 */
	public function test_get_stats_returns_array() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsArray( $data );
	}

	/**
	 * Test get_stats includes required keys.
	 *
	 * @return void
	 */
	public function test_get_stats_includes_required_keys() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		// Verify required keys exist.
		$this->assertArrayHasKey( 'pending_updates', $data );
		$this->assertArrayHasKey( 'weekly_posts', $data );
		$this->assertArrayHasKey( 'activities', $data );
		$this->assertArrayHasKey( 'website_activity', $data );
		$this->assertArrayHasKey( 'badges', $data );
		$this->assertArrayHasKey( 'scores', $data );
		$this->assertArrayHasKey( 'website', $data );
		$this->assertArrayHasKey( 'timezone_offset', $data );
		$this->assertArrayHasKey( 'recommendations', $data );
		$this->assertArrayHasKey( 'plugin_url', $data );
		$this->assertArrayHasKey( 'plugins', $data );
		$this->assertArrayHasKey( 'branding_id', $data );
	}

	/**
	 * Test get_stats website_activity structure.
	 *
	 * @return void
	 */
	public function test_get_stats_website_activity_structure() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsArray( $data['website_activity'] );
		$this->assertArrayHasKey( 'score', $data['website_activity'] );
		$this->assertArrayHasKey( 'checklist', $data['website_activity'] );
	}

	/**
	 * Test get_stats badges contains actual badge data.
	 *
	 * @return void
	 */
	public function test_get_stats_badges_contains_data() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsArray( $data['badges'] );
		// Badges should be an associative array with badge IDs as keys.
		// Even if empty, the structure should be correct.
		foreach ( $data['badges'] as $badge_id => $badge_data ) {
			$this->assertIsString( $badge_id );
			$this->assertIsArray( $badge_data );
			$this->assertArrayHasKey( 'id', $badge_data );
			$this->assertArrayHasKey( 'name', $badge_data );
		}
	}

	/**
	 * Test get_stats scores contains chart data structure.
	 *
	 * @return void
	 */
	public function test_get_stats_scores_structure() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsArray( $data['scores'] );
		// Scores should be an array of score objects with label and value.
		foreach ( $data['scores'] as $score ) {
			$this->assertIsArray( $score );
			$this->assertArrayHasKey( 'label', $score );
			$this->assertArrayHasKey( 'value', $score );
			$this->assertIsNumeric( $score['value'] );
		}
	}

	/**
	 * Test get_stats recommendations contains task data.
	 *
	 * @return void
	 */
	public function test_get_stats_recommendations_structure() {
		// Create a recommendation task.
		$task_id = $this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'publish',
				'post_title'  => 'Test Recommendation',
			]
		);

		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsArray( $data['recommendations'] );
		// If recommendations exist, verify structure.
		if ( ! empty( $data['recommendations'] ) ) {
			$recommendation = $data['recommendations'][0];
			$this->assertArrayHasKey( 'id', $recommendation );
			$this->assertArrayHasKey( 'title', $recommendation );
			$this->assertArrayHasKey( 'provider_id', $recommendation );
		}
	}

	/**
	 * Test get_stats plugins contains active plugin data.
	 *
	 * @return void
	 */
	public function test_get_stats_plugins_structure() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsArray( $data['plugins'] );
		// Plugins array should contain active plugins.
		foreach ( $data['plugins'] as $plugin ) {
			$this->assertIsArray( $plugin );
			$this->assertArrayHasKey( 'plugin', $plugin );
			$this->assertArrayHasKey( 'name', $plugin );
			$this->assertArrayHasKey( 'version', $plugin );
		}
	}

	/**
	 * Test get_stats website URL is valid.
	 *
	 * @return void
	 */
	public function test_get_stats_website_url() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertNotEmpty( $data['website'] );
		$this->assertIsString( $data['website'] );
	}

	/**
	 * Test get_stats timezone_offset is numeric.
	 *
	 * @return void
	 */
	public function test_get_stats_timezone_offset() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsNumeric( $data['timezone_offset'] );
	}

	/**
	 * Test get_stats branding_id is integer.
	 *
	 * @return void
	 */
	public function test_get_stats_branding_id() {
		$response = $this->rest_instance->get_stats();
		$data     = $response->get_data();

		$this->assertIsInt( $data['branding_id'] );
	}
}
