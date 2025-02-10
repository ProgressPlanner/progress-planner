<?php
/**
 * Class Test_API_Get_Stats
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use WP_REST_Server;
use WP_REST_Request;

/**
 * Test_API_Get_Stats test case.
 */
class Test_API_Get_Stats extends \WP_UnitTestCase {

	/**
	 * Holds the WP REST Server object.
	 *
	 * @var WP_REST_Server
	 */
	private $server;

	/**
	 * The token for the test.
	 *
	 * @var string
	 */
	private $token;

		/**
	 * The remote API response.
	 *
	 * @see https://progressplanner.com/wp-json/progress-planner-saas/v1/lessons/?site=test.com
	 *
	 * @var string
	 */
	const REMOTE_API_RESPONSE = '[{"id":1619,"name":"Product page","settings":{"show_in_settings":"no","id":"product-page","title":"Product page","description":"Describes a product you sell"},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1317,"name":"Blog post","settings":{"show_in_settings":"no","id":"blog","title":"Blog","description":"A blog post."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating them {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1316,"name":"FAQ page","settings":{"show_in_settings":"yes","id":"faq","title":"FAQ page","description":"Frequently Asked Questions."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1309,"name":"Contact page","settings":{"show_in_settings":"yes","id":"contact","title":"Contact","description":"Create an easy to use contact page."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating <strong>every {update_cycle}<\/strong>. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1307,"name":"About page","settings":{"show_in_settings":"yes","id":"about","title":"About","description":"Who are you and why are you the person they need."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1269,"name":"Home page","settings":{"show_in_settings":"yes","id":"homepage","title":"Home page","description":"Describe your mission and much more."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}}]';


	/**
	 * Run before the tests.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void {

		self::set_lessons_cache();

		\progress_planner()->get_page_types()->create_taxonomy();
		\progress_planner()->get_page_types()->maybe_add_terms();
	}

	/**
	 * Get the lessons.
	 *
	 * @return array
	 */
	public static function get_lessons() {
		return \json_decode( self::REMOTE_API_RESPONSE, true );
	}

	/**
	 * Set the lessons cache.
	 *
	 * @return void
	 */
	public static function set_lessons_cache() {
		// Mimic the URL building and caching of the lessons, see Progress_Planner\Lessons::get_remote_api_items .
		$url = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/lessons';

		$url = ( \progress_planner()->is_pro_site() )
			? \add_query_arg(
				[
					'site'        => \get_site_url(),
					'license_key' => \get_option( 'progress_planner_pro_license_key' ),
				],
				$url
			)
			: \add_query_arg( [ 'site' => \get_site_url() ], $url );

		$cache_key = md5( $url );

		\progress_planner()->get_cache()->set( $cache_key, self::get_lessons(), WEEK_IN_SECONDS );
	}

	/**
	 * Create a item for our test and initiate REST API.
	 */
	public function setUp(): void {
		parent::setUp();

		$this->token = '123456789';

		// Add a fake license key.
		update_option( 'progress_planner_license_key', $this->token );

		// Initiating the REST API.
		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		$this->server   = $wp_rest_server;
		do_action( 'rest_api_init' );
	}

	/**
	 * Delete the item after the test.
	 */
	public function tearDown(): void {
		parent::tearDown();

		// Delete the fake license key.
		delete_option( 'progress_planner_license_key' );

		global $wp_rest_server;
		$wp_rest_server = null;
	}

	/**
	 * Test the endpoint for Person CPT.
	 *
	 * @return void.
	 */
	public function testEndpoint() {

		$request  = new WP_REST_Request( 'GET', '/progress-planner/v1/get-stats/' . $this->token );
		$response = $this->server->dispatch( $request );

		// Check if the response is successful.
		$this->assertEquals( 200, $response->get_status() );

		// Get the data.
		$data = $response->get_data();

		// Check if the data has the expected keys.
		$data_to_check = [
			'pending_updates',
			'weekly_posts',
			'activities',
			'website_activity',
			'badges',
			'latest_badge',
			'scores',
			'website',
			'timezone_offset',
			'todo',
			'plugin_url',
		];

		foreach ( $data_to_check as $key ) {
			$this->assertArrayHasKey( $key, $data );
		}
	}
}
