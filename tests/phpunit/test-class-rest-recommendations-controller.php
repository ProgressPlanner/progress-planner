<?php
/**
 * Class Rest_Recommendations_Controller_Test
 *
 * @package Progress_Planner\Tests
 * @group rest-api
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Rest\Recommendations_Controller;
use WP_REST_Request;

/**
 * Rest_Recommendations_Controller_Test test case.
 *
 * @group rest-api
 */
class Rest_Recommendations_Controller_Test extends \WP_UnitTestCase {

	/**
	 * Controller instance.
	 *
	 * @var Recommendations_Controller
	 */
	protected $controller;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		// Register the prpl_recommendations post type if not already registered.
		if ( ! \post_type_exists( 'prpl_recommendations' ) ) {
			\register_post_type(
				'prpl_recommendations',
				[
					'public'       => true,
					'show_in_rest' => true,
					'supports'     => [ 'title', 'editor', 'custom-fields' ],
				]
			);
		}

		$this->controller = new Recommendations_Controller( 'prpl_recommendations' );
	}

	/**
	 * Test get_item_schema includes trash in status enum.
	 *
	 * @return void
	 */
	public function test_get_item_schema_includes_trash() {
		$schema = $this->controller->get_item_schema();

		$this->assertArrayHasKey( 'properties', $schema );
		$this->assertArrayHasKey( 'status', $schema['properties'] );
		$this->assertArrayHasKey( 'enum', $schema['properties']['status'] );
		$this->assertContains( 'trash', $schema['properties']['status']['enum'] );
	}

	/**
	 * Test get_item_schema maintains other default statuses.
	 *
	 * @return void
	 */
	public function test_get_item_schema_maintains_default_statuses() {
		$schema = $this->controller->get_item_schema();

		$expected_statuses = [ 'publish', 'future', 'draft', 'pending', 'private' ];

		foreach ( $expected_statuses as $status ) {
			$this->assertContains( $status, $schema['properties']['status']['enum'], "Status '{$status}' should be in enum" );
		}
	}

	/**
	 * Test prepare_items_query method exists and is callable.
	 *
	 * @return void
	 */
	public function test_prepare_items_query_method_exists() {
		$this->assertTrue( \method_exists( $this->controller, 'prepare_items_query' ) );
	}

	/**
	 * Test prepare_items_query applies filter.
	 *
	 * @return void
	 */
	public function test_prepare_items_query_applies_filter() {
		$test_args = [
			'post_type'   => 'prpl_recommendations',
			'post_status' => 'publish',
		];

		$request = new WP_REST_Request( 'GET', '/wp/v2/prpl_recommendations' );

		// Add a filter to modify the query args.
		$filter_applied = false;
		\add_filter(
			'rest_prpl_recommendations_query',
			function ( $args, $req ) use ( &$filter_applied, $request ) {
				if ( $req === $request ) {
					$filter_applied     = true;
					$args['custom_arg'] = 'custom_value';
				}
				return $args;
			},
			10,
			2
		);

		// Use reflection to access protected method.
		$reflection = new \ReflectionClass( $this->controller );
		$method     = $reflection->getMethod( 'prepare_items_query' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->controller, $test_args, $request );

		$this->assertTrue( $filter_applied, 'Filter should have been applied' );
		$this->assertArrayHasKey( 'custom_arg', $result, 'Filter should have added custom_arg' );
		$this->assertEquals( 'custom_value', $result['custom_arg'] );

		// Clean up filter.
		\remove_all_filters( 'rest_prpl_recommendations_query' );
	}

	/**
	 * Test prepare_items_query calls parent method.
	 *
	 * @return void
	 */
	public function test_prepare_items_query_calls_parent() {
		$test_args = [
			'post_type' => 'prpl_recommendations',
		];

		$request = new WP_REST_Request( 'GET', '/wp/v2/prpl_recommendations' );

		// Use reflection to access protected method.
		$reflection = new \ReflectionClass( $this->controller );
		$method     = $reflection->getMethod( 'prepare_items_query' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->controller, $test_args, $request );

		// Result should still have the post_type from parent processing.
		$this->assertIsArray( $result );
		$this->assertArrayHasKey( 'post_type', $result );
	}

	/**
	 * Test controller extends WP_REST_Posts_Controller.
	 *
	 * @return void
	 */
	public function test_controller_extends_wp_rest_posts_controller() {
		$this->assertInstanceOf( \WP_REST_Posts_Controller::class, $this->controller );
	}

	/**
	 * Test schema is valid JSON schema.
	 *
	 * @return void
	 */
	public function test_schema_is_valid() {
		$schema = $this->controller->get_item_schema();

		// Basic schema validation.
		$this->assertIsArray( $schema );
		$this->assertArrayHasKey( '$schema', $schema );
		$this->assertArrayHasKey( 'title', $schema );
		$this->assertArrayHasKey( 'type', $schema );
		$this->assertArrayHasKey( 'properties', $schema );
	}
}
