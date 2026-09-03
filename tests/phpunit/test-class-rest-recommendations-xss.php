<?php
/**
 * Test that recommendation titles created via the REST API are sanitized.
 *
 * Regression test for the stored XSS reported by Patchstack: an Editor (or
 * higher) could POST /wp/v2/prpl_recommendations with a `title` containing an
 * HTML payload (e.g. `<img src=x onerror=alert(1)>`) which was later rendered
 * unescaped in the admin dashboard.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Rest_Recommendations_Xss_Test
 */
class Rest_Recommendations_Xss_Test extends \WP_UnitTestCase {

	/**
	 * Set up the REST server before each test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		global $wp_rest_server;
		$wp_rest_server = new \WP_REST_Server();
		\do_action( 'rest_api_init' );
	}

	/**
	 * Tear down the REST server after each test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		global $wp_rest_server;
		$wp_rest_server = null;
		parent::tearDown();
	}

	/**
	 * Submit a recommendation via the REST API and return the raw response.
	 *
	 * @param string $title The title to submit.
	 * @return \WP_REST_Response The REST response.
	 */
	private function submit_recommendation_via_rest( $title ) {
		$request = new \WP_REST_Request( 'POST', '/wp/v2/prpl_recommendations' );
		$request->set_header( 'Content-Type', 'application/json' );
		$request->set_body(
			(string) \wp_json_encode(
				[
					'title'  => $title,
					'status' => 'publish',
				]
			)
		);

		return \rest_get_server()->dispatch( $request );
	}

	/**
	 * Create a recommendation via the REST API and return the created WP_Post.
	 *
	 * @param string $title The title to submit.
	 * @return \WP_Post The created post.
	 */
	private function create_recommendation_via_rest( $title ) {
		$response = $this->submit_recommendation_via_rest( $title );
		$this->assertSame( 201, $response->get_status(), 'Recommendation should be created.' );

		$data = $response->get_data();
		return \get_post( $data['id'] );
	}

	/**
	 * An Editor submitting a title that is purely an HTML payload must not result
	 * in a stored post that contains the markup.
	 *
	 * Stripping the tags leaves an empty title, so WordPress rejects the request
	 * outright (the malicious post is never created) - an acceptable, even
	 * preferable, outcome. We assert that either nothing was stored, or if it was,
	 * the markup is gone.
	 *
	 * @return void
	 */
	public function test_editor_xss_title_is_stripped() {
		$editor_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );

		$response = $this->submit_recommendation_via_rest( '<img src=x onerror=alert(1)>' );

		if ( 201 === $response->get_status() ) {
			$post = \get_post( $response->get_data()['id'] );
			$this->assertStringNotContainsString( '<img', $post->post_title );
			$this->assertStringNotContainsString( 'onerror', $post->post_title );
			$this->assertStringNotContainsString( '<', $post->post_title );
		} else {
			// An empty title (after stripping) is rejected; no post is created.
			$this->assertSame( 400, $response->get_status() );
		}
	}

	/**
	 * A <script> payload from an Editor should be stripped from the stored title.
	 *
	 * @return void
	 */
	public function test_editor_script_title_is_stripped() {
		$editor_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor_id );

		$post = $this->create_recommendation_via_rest( '<script>alert(document.cookie)</script>Hello' );

		$this->assertStringNotContainsString( '<script', $post->post_title );
		$this->assertStringNotContainsString( '</script', $post->post_title );
		// The plain-text remainder is preserved.
		$this->assertStringContainsString( 'Hello', $post->post_title );
	}

	/**
	 * Even an Administrator (who has the `unfiltered_html` capability) should
	 * have HTML stripped from recommendation titles, since they are rendered as
	 * plain text in JS templates.
	 *
	 * @return void
	 */
	public function test_admin_with_unfiltered_html_title_is_stripped() {
		$admin_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );

		$post = $this->create_recommendation_via_rest( '<img src=x onerror=alert(1)>Title' );

		$this->assertStringNotContainsString( '<img', $post->post_title );
		$this->assertStringNotContainsString( 'onerror', $post->post_title );
		$this->assertStringContainsString( 'Title', $post->post_title );
	}

	/**
	 * Legitimate plain-text titles (including ampersands) must be preserved.
	 *
	 * @return void
	 */
	public function test_plain_text_title_is_preserved() {
		$editor_id = self::factory()->user->create( [ 'role' => 'editor' ] );

		// This test isolates our XSS sanitization: a legitimate plain-text title
		// must survive `wp_strip_all_tags()` + `sanitize_text_field()` unchanged.
		// Core's kses would additionally encode the ampersand, but only for users
		// without `unfiltered_html` — which on multisite excludes editors. Grant
		// the capability *before* switching the current user, because `kses_init()`
		// (hooked on `set_current_user`) decides whether to attach the kses filters
		// at switch time; granting it afterwards would be too late.
		if ( \is_multisite() ) {
			\grant_super_admin( $editor_id );
		} else {
			( new \WP_User( $editor_id ) )->add_cap( 'unfiltered_html' );
		}

		\wp_set_current_user( $editor_id );

		$post = $this->create_recommendation_via_rest( 'Buy milk & eggs' );

		$this->assertSame( 'Buy milk & eggs', $post->post_title );
	}
}
