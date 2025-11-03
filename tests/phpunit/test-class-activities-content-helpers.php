<?php
/**
 * Unit tests for Activities\Content_Helpers class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Activities\Content_Helpers;
use Progress_Planner\Activities\Content as Activities_Content;

/**
 * Activities_Content_Helpers test case.
 *
 * Tests the Activities\Content_Helpers class helper methods.
 */
class Activities_Content_Helpers_Test extends WP_UnitTestCase {

	/**
	 * Content_Helpers instance.
	 *
	 * @var Content_Helpers
	 */
	private $helpers;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->helpers = new Content_Helpers();

		// Set up admin user.
		$admin_id = $this->factory->user->create( [ 'role' => 'administrator' ] );
		\wp_set_current_user( $admin_id );
	}

	/**
	 * Tear down test environment.
	 *
	 * phpcs:disable Generic.CodeAnalysis.UselessOverridingMethod.Found -- Reserved for future test cleanup
	 */
	public function tearDown(): void {
		parent::tearDown();
	}
	// phpcs:enable Generic.CodeAnalysis.UselessOverridingMethod.Found

	/**
	 * Test get_post_types_names() returns default types.
	 */
	public function test_get_post_types_names_default() {
		$post_types = $this->helpers->get_post_types_names();

		$this->assertIsArray( $post_types );
		$this->assertContains( 'post', $post_types );
		$this->assertContains( 'page', $post_types );
	}

	/**
	 * Test get_post_types_names() returns array.
	 */
	public function test_get_post_types_names_is_array() {
		$post_types = $this->helpers->get_post_types_names();

		$this->assertIsArray( $post_types );
		$this->assertNotEmpty( $post_types );
	}

	/**
	 * Test get_post_types_names() caches results.
	 */
	public function test_get_post_types_names_caches() {
		$result1 = $this->helpers->get_post_types_names();
		$result2 = $this->helpers->get_post_types_names();

		$this->assertEquals( $result1, $result2, 'Should return cached results' );
	}

	/**
	 * Test get_post_types_names() filters non-existent types.
	 */
	public function test_get_post_types_names_filters_non_existent() {
		// Set a custom post type that doesn't exist.
		\progress_planner()->get_settings()->set(
			'include_post_types',
			[ 'post', 'page', 'non_existent_type_xyz' ]
		);

		// Create new helper instance to bypass static cache.
		$helpers = new Content_Helpers();

		$post_types = $helpers->get_post_types_names();

		$this->assertNotContains( 'non_existent_type_xyz', $post_types, 'Should filter out non-existent types' );
	}

	/**
	 * Test get_post_types_names() only includes viewable types.
	 */
	public function test_get_post_types_names_viewable_only() {
		$post_types = $this->helpers->get_post_types_names();

		foreach ( $post_types as $post_type ) {
			$this->assertTrue(
				\is_post_type_viewable( $post_type ),
				"$post_type should be viewable"
			);
		}
	}

	/**
	 * Test get_activity_from_post() returns Content activity.
	 */
	public function test_get_activity_from_post() {
		$post_id = $this->factory->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_author' => \get_current_user_id(),
			]
		);

		$post     = \get_post( $post_id );
		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertInstanceOf( Activities_Content::class, $activity );
	}

	/**
	 * Test get_activity_from_post() sets correct category.
	 */
	public function test_get_activity_from_post_category() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertEquals( 'content', $activity->category );
	}

	/**
	 * Test get_activity_from_post() sets default activity type.
	 */
	public function test_get_activity_from_post_default_type() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertEquals( 'publish', $activity->type );
	}

	/**
	 * Test get_activity_from_post() with custom activity type.
	 */
	public function test_get_activity_from_post_custom_type() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post, 'update' );

		$this->assertEquals( 'update', $activity->type );
	}

	/**
	 * Test get_activity_from_post() sets data_id from post ID.
	 */
	public function test_get_activity_from_post_data_id() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertEquals( (string) $post_id, $activity->data_id );
	}

	/**
	 * Test get_activity_from_post() sets user_id from post author.
	 */
	public function test_get_activity_from_post_user_id() {
		$author_id = $this->factory->user->create();
		$post_id   = $this->factory->post->create( [ 'post_author' => $author_id ] );
		$post      = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertEquals( $author_id, $activity->user_id );
	}

	/**
	 * Test get_activity_from_post() sets date from post_modified.
	 */
	public function test_get_activity_from_post_date() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertInstanceOf( \DateTime::class, $activity->date );
	}

	/**
	 * Test get_activity_from_post() with page post type.
	 */
	public function test_get_activity_from_post_page_type() {
		$page_id = $this->factory->post->create( [ 'post_type' => 'page' ] );
		$page    = \get_post( $page_id );

		$activity = $this->helpers->get_activity_from_post( $page );

		$this->assertInstanceOf( Activities_Content::class, $activity );
		$this->assertEquals( (string) $page_id, $activity->data_id );
	}

	/**
	 * Test get_activity_from_post() with different activity types.
	 */
	public function test_get_activity_from_post_various_types() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$types = [ 'publish', 'update', 'delete', 'custom' ];

		foreach ( $types as $type ) {
			$activity = $this->helpers->get_activity_from_post( $post, $type );
			$this->assertEquals( $type, $activity->type, "Should handle $type activity type" );
		}
	}

	/**
	 * Test get_post_types_names() returns indexed array.
	 */
	public function test_get_post_types_names_indexed_array() {
		$post_types = $this->helpers->get_post_types_names();

		$this->assertIsArray( $post_types );
		// Should have numeric keys starting from 0.
		$this->assertArrayHasKey( 0, $post_types );
	}

	/**
	 * Test get_post_types_names() caching and filtering behavior.
	 *
	 * Tests that the method properly filters post types and returns a valid array structure.
	 * Note: Custom post type registration testing is limited due to static caching in the method.
	 * The static cache persists across test methods, making it difficult to test dynamic post type registration.
	 *
	 * @group post-types
	 */
	public function test_get_post_types_names_filtering() {
		// Test that the method returns an array.
		$post_types = $this->helpers->get_post_types_names();
		$this->assertIsArray( $post_types, 'Should return an array' );

		// Test that it contains at least the default types.
		$this->assertContains( 'post', $post_types, 'Should contain post type' );
		$this->assertContains( 'page', $post_types, 'Should contain page type' );

		// Test that all returned types exist and are viewable.
		foreach ( $post_types as $post_type ) {
			$this->assertTrue(
				\post_type_exists( $post_type ),
				"Post type '{$post_type}' should exist"
			);
			$this->assertTrue(
				\is_post_type_viewable( $post_type ),
				"Post type '{$post_type}' should be viewable"
			);
		}
	}

	/**
	 * Test get_activity_from_post() data_id is string.
	 */
	public function test_get_activity_from_post_data_id_is_string() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertIsString( $activity->data_id );
	}

	/**
	 * Test get_activity_from_post() user_id is integer.
	 */
	public function test_get_activity_from_post_user_id_is_integer() {
		$post_id = $this->factory->post->create();
		$post    = \get_post( $post_id );

		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertIsInt( $activity->user_id );
	}

	/**
	 * Test get_post_types_names() with empty settings.
	 */
	public function test_get_post_types_names_empty_settings() {
		\progress_planner()->get_settings()->set( 'include_post_types', [] );

		// Create new helper to bypass cache.
		$helpers = new Content_Helpers();

		$post_types = $helpers->get_post_types_names();

		// Should return defaults when empty.
		$this->assertContains( 'post', $post_types );
		$this->assertContains( 'page', $post_types );
	}

	/**
	 * Test get_activity_from_post() with recently modified post.
	 */
	public function test_get_activity_from_post_modified_date() {
		$post_id = $this->factory->post->create();

		// Update the post to change modified date.
		\wp_update_post(
			[
				'ID'         => $post_id,
				'post_title' => 'Updated Title',
			]
		);

		$post     = \get_post( $post_id );
		$activity = $this->helpers->get_activity_from_post( $post );

		$this->assertInstanceOf( \DateTime::class, $activity->date );
	}
}
