<?php
/**
 * Class Lessons_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Lessons test case.
 */
class Lessons_Test extends \WP_UnitTestCase {

	/**
	 * The Lessons instance.
	 *
	 * @var \Progress_Planner\Lessons
	 */
	private $lessons;

	/**
	 * Set up the test.
	 */
	public function set_up() {
		parent::set_up();
		$this->lessons = new \Progress_Planner\Lessons();
	}

	/**
	 * Clean up after each test.
	 */
	public function tear_down() {
		// Clear the cache after each test.
		\progress_planner()->get_utils__cache()->delete_all();
		parent::tear_down();
	}

	/**
	 * Test get_items returns an array.
	 */
	public function test_get_items_returns_array() {
		$result = $this->lessons->get_items();

		$this->assertIsArray( $result );
	}

	/**
	 * Test get_remote_api_items caches results.
	 */
	public function test_get_remote_api_items_uses_cache() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Mock the remote API response with high priority to override any other filters.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => wp_json_encode(
							[
								[
									'name'     => 'Test Lesson 1',
									'settings' => [ 'id' => 'test-lesson-1' ],
								],
								[
									'name'     => 'Test Lesson 2',
									'settings' => [ 'id' => 'test-lesson-2' ],
								],
							]
						),
					];
				}
				return $preempt;
			},
			1,
			3
		);

		// First call - should make HTTP request.
		$result1 = $this->lessons->get_remote_api_items();

		// Second call - should use cache.
		$result2 = $this->lessons->get_remote_api_items();

		// Both results should be the same.
		$this->assertEquals( $result1, $result2 );

		// Should be an array with items.
		$this->assertIsArray( $result1 );
		$this->assertGreaterThan( 0, count( $result1 ) );

		// If our mock worked, we should have exactly 2 items.
		if ( count( $result1 ) === 2 ) {
			$this->assertEquals( 'Test Lesson 1', $result1[0]['name'] );
			$this->assertEquals( 'Test Lesson 2', $result1[1]['name'] );
		}

		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_remote_api_items handles WP_Error.
	 */
	public function test_get_remote_api_items_handles_wp_error() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Mock a WP_Error response.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return new \WP_Error( 'http_request_failed', 'Connection timeout' );
				}
				return $preempt;
			},
			1,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		// Should return empty array on error.
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );

		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_remote_api_items handles non-200 response.
	 */
	public function test_get_remote_api_items_handles_non_200_response() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Mock a 404 response.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 404 ],
						'body'     => 'Not Found',
					];
				}
				return $preempt;
			},
			1,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		// Should return empty array on non-200 response.
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );

		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_remote_api_items handles invalid JSON.
	 */
	public function test_get_remote_api_items_handles_invalid_json() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Mock an invalid JSON response.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => 'invalid json{',
					];
				}
				return $preempt;
			},
			1,
			3
		);

		$result = $this->lessons->get_remote_api_items();

		// Should return empty array on invalid JSON.
		$this->assertIsArray( $result );
		$this->assertEmpty( $result );

		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_lesson_pagetypes returns array.
	 */
	public function test_get_lesson_pagetypes_returns_array() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Mock the remote API response.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => wp_json_encode(
							[
								[
									'name'     => 'About Page',
									'settings' => [ 'id' => 'about' ],
								],
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
			1,
			3
		);

		$result = $this->lessons->get_lesson_pagetypes();

		$this->assertIsArray( $result );
		$this->assertCount( 2, $result );

		// Check structure.
		$this->assertArrayHasKey( 'label', $result[0] );
		$this->assertArrayHasKey( 'value', $result[0] );
		$this->assertEquals( 'About Page', $result[0]['label'] );
		$this->assertEquals( 'about', $result[0]['value'] );

		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_lesson_pagetypes filters homepage when show_on_front is posts.
	 */
	public function test_get_lesson_pagetypes_filters_homepage_when_show_on_front_posts() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Set show_on_front to 'posts'.
		update_option( 'show_on_front', 'posts' );

		// Mock the remote API response with homepage lesson.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => wp_json_encode(
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
			1,
			3
		);

		$result = $this->lessons->get_lesson_pagetypes();

		// Homepage should be filtered out.
		$this->assertCount( 1, $result );
		$this->assertEquals( 'About Page', $result[0]['label'] );
		$this->assertEquals( 'about', $result[0]['value'] );

		// Clean up.
		delete_option( 'show_on_front' );
		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_lesson_pagetypes includes homepage when show_on_front is page.
	 */
	public function test_get_lesson_pagetypes_includes_homepage_when_show_on_front_page() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Set show_on_front to 'page'.
		update_option( 'show_on_front', 'page' );

		// Mock the remote API response with homepage lesson.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => wp_json_encode(
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
			1,
			3
		);

		$result = $this->lessons->get_lesson_pagetypes();

		// Homepage should be included.
		$this->assertCount( 2, $result );
		$this->assertEquals( 'Homepage', $result[0]['label'] );
		$this->assertEquals( 'homepage', $result[0]['value'] );

		// Clean up.
		delete_option( 'show_on_front' );
		remove_all_filters( 'pre_http_request' );
	}

	/**
	 * Test get_lesson_pagetypes with empty lessons.
	 */
	public function test_get_lesson_pagetypes_empty_lessons() {
		// Clear cache first.
		\progress_planner()->get_utils__cache()->delete_all();

		// Mock empty response.
		add_filter(
			'pre_http_request',
			function ( $preempt, $args, $url ) {
				if ( strpos( $url, '/wp-json/progress-planner-saas/v1/lessons' ) !== false ) {
					return [
						'response' => [ 'code' => 200 ],
						'body'     => wp_json_encode( [] ),
					];
				}
				return $preempt;
			},
			1,
			3
		);

		$result = $this->lessons->get_lesson_pagetypes();

		$this->assertIsArray( $result );
		$this->assertEmpty( $result );

		remove_all_filters( 'pre_http_request' );
	}
}
