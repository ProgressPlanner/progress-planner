<?php
/**
 * Class Page_Types_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Page_Types;

/**
 * Page types test case.
 */
class Page_Types_Test extends \WP_UnitTestCase {

	/**
	 * The remote API response.
	 *
	 * @see https://progressplanner.com/wp-json/progress-planner-saas/v1/lessons/?site=test.com
	 *
	 * @var string
	 */
	const REMOTE_API_RESPONSE = '[{"id":1619,"name":"Product page","settings":{"show_in_settings":"no","id":"product-page","title":"Product page","description":"Describes a product you sell"},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1317,"name":"Blog post","settings":{"show_in_settings":"no","id":"blog","title":"Blog","description":"A blog post."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating them {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1316,"name":"FAQ page","settings":{"show_in_settings":"yes","id":"faq","title":"FAQ page","description":"Frequently Asked Questions."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1309,"name":"Contact page","settings":{"show_in_settings":"yes","id":"contact","title":"Contact","description":"Create an easy to use contact page."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating <strong>every {update_cycle}<\/strong>. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1307,"name":"About page","settings":{"show_in_settings":"yes","id":"about","title":"About","description":"Who are you and why are you the person they need."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}},{"id":1269,"name":"Home page","settings":{"show_in_settings":"yes","id":"homepage","title":"Home page","description":"Describe your mission and much more."},"content_update_cycle":{"heading":"Content update cycle","update_cycle":"6 months","text":"<p>A {page_type} should be regularly updated. For this type of page, we suggest updating every {update_cycle}. We will remind you {update_cycle} after you&#8217;ve last saved this page.<\/p>\n","video":"","video_button_text":""}}]';

	/**
	 * The ID of a page with the "homepage" slug.
	 *
	 * @var int
	 */
	private static $homepage_post_id;

	/**
	 * Run before the tests.
	 *
	 * @return void
	 */
	public static function setUpBeforeClass(): void {
		self::set_lessons_cache();

		\progress_planner()->get_page_types()->create_taxonomy();
		\progress_planner()->get_page_types()->maybe_add_terms();

		// Insert the homepage post.
		self::$homepage_post_id = \wp_insert_post(
			[
				'post_type'   => 'page',
				'post_name'   => 'homepage',
				'post_title'  => 'Homepage',
				'post_status' => 'publish',
			]
		);
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

		$cache_key = \md5( $url );

		\progress_planner()->get_utils__cache()->set( $cache_key, self::get_lessons(), WEEK_IN_SECONDS );
	}

	/**
	 * Test create_taxonomy.
	 *
	 * @return void
	 */
	public function test_create_taxonomy() {
		$this->assertTrue( \taxonomy_exists( Page_Types::TAXONOMY_NAME ) );
	}

	/**
	 * Test maybe_add_terms.
	 *
	 * @return void
	 */
	public function test_maybe_add_terms() {
		$lessons = self::get_lessons();

		foreach ( $lessons as $lesson ) {
			$this->assertNotNull( \term_exists( $lesson['settings']['id'], Page_Types::TAXONOMY_NAME ) );
		}
	}

	/**
	 * Test maybe_update_terms.
	 *
	 * @return void
	 */
	public function test_maybe_update_terms() {
	}

	/**
	 * Test get_page_types.
	 *
	 * @return void
	 */
	public function test_get_page_types() {
		// Reset the page types, before the test.
		$page_types_object              = \progress_planner()->get_page_types();
		$page_types_object::$page_types = null;

		$page_types = \progress_planner()->get_page_types()->get_page_types();
		$lessons    = self::get_lessons();
		$this->assertCount( \count( $lessons ), $page_types );

		foreach ( $lessons as $lesson ) {
			$this->assertCount(
				1,
				\array_filter(
					$page_types,
					function ( $page_type ) use ( $lesson ) {
						return $page_type['slug'] === $lesson['settings']['id'];
					}
				)
			);
		}
	}

	/**
	 * Test get_posts_by_type.
	 *
	 * @return void
	 */
	public function test_get_posts_by_type() {
		// Assign the post to the "homepage" page type.
		\progress_planner()->get_page_types()->set_page_type_by_id(
			self::$homepage_post_id,
			\get_term_by( 'slug', 'homepage', Page_Types::TAXONOMY_NAME )->term_id
		);

		$posts = \progress_planner()->get_page_types()->get_posts_by_type( 'page', 'homepage' );
		$this->assertEquals( self::$homepage_post_id, $posts[0]->ID );
	}

	/**
	 * Test get_default_page_type.
	 *
	 * @return void
	 */
	public function test_get_default_page_type() {
	}

	/**
	 * Test update_option_page_on_front.
	 *
	 * @return void
	 */
	public function test_update_option_page_on_front() {
	}

	/**
	 * Test post_updated.
	 *
	 * @return void
	 */
	public function test_post_updated() {
	}

	/**
	 * Test assign_child_pages.
	 *
	 * @return void
	 */
	public function test_assign_child_pages() {
	}

	/**
	 * Test if the transition of a page status updates the options.
	 *
	 * @return void
	 */
	public function test_transition_post_status_updates_options() {
		// Check if the options are set to default values.
		$this->assertEquals( 0, \get_option( 'page_on_front' ) );
		$this->assertEquals( 'posts', \get_option( 'show_on_front' ) );

		// Update homepage page to draft.
		\wp_update_post(
			[
				'ID'          => self::$homepage_post_id,
				'post_status' => 'draft',
			]
		);

		$term = \get_term_by( 'slug', 'homepage', \progress_planner()->get_page_types()::TAXONOMY_NAME );

		// Directly assign the term to the page, without using the set_page_type_by_slug method.
		\wp_set_object_terms( self::$homepage_post_id, $term->term_id, \progress_planner()->get_page_types()::TAXONOMY_NAME );

		// Update the page status to publish.
		\wp_update_post(
			[
				'ID'          => self::$homepage_post_id,
				'post_status' => 'publish',
			]
		);

		// Check if the options are updated.
		$this->assertEquals( self::$homepage_post_id, \get_option( 'page_on_front' ) );
		$this->assertEquals( 'page', \get_option( 'show_on_front' ) );
	}
}
