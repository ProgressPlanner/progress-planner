<?php
/**
 * Unit tests for Lessons class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Lessons;

/**
 * Lessons test case.
 *
 * Tests the Lessons class that fetches lesson data from remote API
 * with caching and error handling.
 */
class Lessons_Test extends WP_UnitTestCase {

	/**
	 * Lessons instance.
	 *
	 * @var Lessons
	 */
	private $lessons;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->lessons = new Lessons();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );

		// Clear cache before each test.
		$this->clear_lessons_cache();
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		$this->clear_lessons_cache();
		parent::tearDown();
	}

	/**
	 * Clear lessons cache.
	 */
	private function clear_lessons_cache() {
		$url       = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/lessons';
		$url       = \add_query_arg(
			[
				'site'        => \get_site_url(),
				'license_key' => \get_option( 'progress_planner_license_key' ),
			],
			$url
		);
		$cache_key = \md5( $url );
		\progress_planner()->get_utils__cache()->delete( $cache_key );
	}

	/**
	 * Test get_items() calls get_remote_api_items().
	 */
	public function test_get_items() {
		// Mock the HTTP response.
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode(
							[
								[
									'name'     => 'Test Lesson',
									'settings' => [ 'id' => 'test-lesson' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$items = $this->lessons->get_items();

		$this->assertIsArray( $items );
		$this->assertNotEmpty( $items );
	}

	/**
	 * Test get_remote_api_items() returns array on success.
	 */
	public function test_get_remote_api_items_success() {
		$test_data = [
			[
				'name'     => 'Homepage',
				'settings' => [ 'id' => 'homepage' ],
			],
			[
				'name'     => 'About Page',
				'settings' => [ 'id' => 'about' ],
			],
		];

		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) use ( $test_data ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode( $test_data ),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );
		$this->assertEquals( 'Homepage', $result[0]['name'] );
	}

	/**
	 * Test get_remote_api_items() returns empty array on WP_Error.
	 */
	public function test_get_remote_api_items_wp_error() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return new \WP_Error( 'http_request_failed', 'A network error occurred' );
				}
				return $preempt;
			},
			10,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Should return empty array on WP_Error' );
	}

	/**
	 * Test get_remote_api_items() returns empty array on 404 error.
	 */
	public function test_get_remote_api_items_404_error() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 404 ],
						'body'     => 'Not Found',
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Should return empty array on 404' );
	}

	/**
	 * Test get_remote_api_items() returns empty array on 500 error.
	 */
	public function test_get_remote_api_items_500_error() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 500 ],
						'body'     => 'Internal Server Error',
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Should return empty array on 500' );
	}

	/**
	 * Test get_remote_api_items() returns empty array on invalid JSON.
	 */
	public function test_get_remote_api_items_invalid_json() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => 'This is not valid JSON{',
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result, 'Should return empty array on invalid JSON' );
	}

	/**
	 * Test get_remote_api_items() caches successful response.
	 */
	public function test_get_remote_api_items_caches_success() {
		$call_count = 0;

		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) use ( &$call_count ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					$call_count++;
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode(
							[
								[
									'name'     => 'Lesson',
									'settings' => [ 'id' => 'test' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		// First call.
		$this->lessons->get_remote_api_items();

		// Second call should use cache.
		$this->lessons->get_remote_api_items();

		$this->assertEquals( 1, $call_count, 'Should only make one HTTP request due to caching' );
	}

	/**
	 * Test get_remote_api_items() caches errors.
	 */
	public function test_get_remote_api_items_caches_errors() {
		$call_count = 0;

		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) use ( &$call_count ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					$call_count++;
					return new \WP_Error( 'http_request_failed', 'Network error' );
				}
				return $preempt;
			},
			10,
			3
		);

		// First call.
		$this->lessons->get_remote_api_items();

		// Second call should use cached empty array.
		$this->lessons->get_remote_api_items();

		$this->assertEquals( 1, $call_count, 'Should cache error responses to prevent hammering' );
	}

	/**
	 * Test get_lesson_pagetypes() returns formatted array.
	 */
	public function test_get_lesson_pagetypes() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode(
							[
								[
									'name'     => 'Homepage',
									'settings' => [ 'id' => 'homepage' ],
								],
								[
									'name'     => 'About Page',
									'settings' => [ 'id' => 'about' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$pagetypes = $this->lessons->get_lesson_pagetypes();

		$this->assertIsArray( $pagetypes );
		$this->assertNotEmpty( $pagetypes );
		$this->assertArrayHasKey( 'label', $pagetypes[0] );
		$this->assertArrayHasKey( 'value', $pagetypes[0] );
	}

	/**
	 * Test get_lesson_pagetypes() excludes homepage when show_on_front is posts.
	 */
	public function test_get_lesson_pagetypes_excludes_homepage_for_posts() {
		// Set show_on_front to 'posts'.
		\update_option( 'show_on_front', 'posts' );

		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode(
							[
								[
									'name'     => 'Homepage',
									'settings' => [ 'id' => 'homepage' ],
								],
								[
									'name'     => 'About Page',
									'settings' => [ 'id' => 'about' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$pagetypes = $this->lessons->get_lesson_pagetypes();

		// Should not include homepage.
		$values = \array_column( $pagetypes, 'value' );
		$this->assertNotContains( 'homepage', $values, 'Should exclude homepage when show_on_front is posts' );
		$this->assertContains( 'about', $values, 'Should include other lessons' );
	}

	/**
	 * Test get_lesson_pagetypes() includes homepage when show_on_front is page.
	 */
	public function test_get_lesson_pagetypes_includes_homepage_for_page() {
		// Set show_on_front to 'page'.
		\update_option( 'show_on_front', 'page' );

		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode(
							[
								[
									'name'     => 'Homepage',
									'settings' => [ 'id' => 'homepage' ],
								],
								[
									'name'     => 'About Page',
									'settings' => [ 'id' => 'about' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$pagetypes = $this->lessons->get_lesson_pagetypes();

		// Should include homepage.
		$values = \array_column( $pagetypes, 'value' );
		$this->assertContains( 'homepage', $values, 'Should include homepage when show_on_front is page' );
	}

	/**
	 * Test get_lesson_pagetypes() returns empty array on API error.
	 */
	public function test_get_lesson_pagetypes_empty_on_error() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return new \WP_Error( 'http_request_failed', 'Network error' );
				}
				return $preempt;
			},
			10,
			3
		);

		$pagetypes = $this->lessons->get_lesson_pagetypes();

		$this->assertIsArray( $pagetypes );
		$this->assertEmpty( $pagetypes, 'Should return empty array when API fails' );
	}

	/**
	 * Test get_lesson_pagetypes() label and value structure.
	 */
	public function test_get_lesson_pagetypes_structure() {
		\add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( false !== \strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => \wp_json_encode(
							[
								[
									'name'     => 'Contact Page',
									'settings' => [ 'id' => 'contact' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			10,
			3
		);

		$pagetypes = $this->lessons->get_lesson_pagetypes();

		$this->assertEquals( 'Contact Page', $pagetypes[0]['label'] );
		$this->assertEquals( 'contact', $pagetypes[0]['value'] );
	}

	/**
	 * Test $id property is set correctly.
	 */
	public function test_id_property() {
		$reflection = new \ReflectionClass( $this->lessons );
		$property   = $reflection->getProperty( 'id' );
		$property->setAccessible( true );

		$this->assertEquals( 'lessons', $property->getValue( $this->lessons ) );
	}
}
