<?php
/**
 * Test that the `provider` / `exclude_provider` REST params accept both string
 * and array input without throwing.
 *
 * Regression test for the 1.10.0 release audit finding S7.1: passing an array
 * (`?provider[]=a`) to `explode()` raised a PHP 8 TypeError (HTTP 500). The
 * param is now normalised via `parse_provider_param()`.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Rest_Recommendations_Provider_Param_Test
 */
class Rest_Recommendations_Provider_Param_Test extends \WP_UnitTestCase {

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
	 * Query the collection with the given query params as an authorised user.
	 *
	 * @param array<string,mixed> $query_params The query params.
	 *
	 * @return \WP_REST_Response
	 */
	private function query_as_editor( $query_params ) {
		$editor = self::factory()->user->create( [ 'role' => 'editor' ] );
		\wp_set_current_user( $editor );

		$request = new \WP_REST_Request( 'GET', '/wp/v2/prpl_recommendations' );
		$request->set_query_params( $query_params );
		return \rest_do_request( $request );
	}

	/**
	 * An array `provider[]` param must not throw a TypeError (was HTTP 500).
	 *
	 * @return void
	 */
	public function test_provider_array_does_not_error() {
		$response = $this->query_as_editor( [ 'provider' => [ 'content-update', 'core-update' ] ] );
		$this->assertNotSame( 500, $response->get_status(), 'array provider param must not 500' );
		$this->assertSame( 200, $response->get_status() );
	}

	/**
	 * An array `exclude_provider[]` param must not throw a TypeError.
	 *
	 * @return void
	 */
	public function test_exclude_provider_array_does_not_error() {
		$response = $this->query_as_editor( [ 'exclude_provider' => [ 'content-update' ] ] );
		$this->assertNotSame( 500, $response->get_status(), 'array exclude_provider param must not 500' );
		$this->assertSame( 200, $response->get_status() );
	}

	/**
	 * The string form (`?provider=a,b`) still works.
	 *
	 * @return void
	 */
	public function test_provider_string_still_works() {
		$response = $this->query_as_editor( [ 'provider' => 'content-update,core-update' ] );
		$this->assertSame( 200, $response->get_status() );
	}
}
