<?php
/**
 * Unit tests for Terms_Without_Posts_Data_Collector_Test class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Posts;
use WP_UnitTestCase;

/**
 * Class Terms_Without_Posts_Data_Collector_Test.
 */
class Terms_Without_Posts_Data_Collector_Test extends \WP_UnitTestCase {

	/**
	 * The data collector instance.
	 *
	 * @var Terms_Without_Posts
	 */
	private $data_collector;

	/**
	 * Set up the test.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->data_collector = new Terms_Without_Posts();
		$this->data_collector->init();
	}

	/**
	 * Test that the data collector returns terms without posts.
	 */
	public function test_collect_returns_terms_without_posts() {
		// Create a category.
		$term_result = wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Get the data.
		$this->data_collector->update_cache();
		$result = $this->data_collector->collect();

		// Assert that we got our specific test term.
		$this->assertIsArray( $result );
		$this->assertEquals( $term_id, $result['term_id'] );
		$this->assertEquals( 'Test Category', $result['name'] );
		$this->assertEquals( 'category', $result['taxonomy'] );
	}

	/**
	 * Test that terms with posts are not returned.
	 */
	public function test_collect_ignores_terms_with_posts() {
		// Create a category.
		$term_result = wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );

		// Create two posts and assign them to the category.
		$post_id1 = wp_insert_post(
			[
				'post_title'  => 'Test Post 1',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->assertNotWPError( $post_id1 );

		$post_id2 = wp_insert_post(
			[
				'post_title'  => 'Test Post 2',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->assertNotWPError( $post_id2 );

		$set_terms = wp_set_object_terms( $post_id1, $term_result['term_id'], 'category' );
		$this->assertNotWPError( $set_terms );

		$set_terms = wp_set_object_terms( $post_id2, $term_result['term_id'], 'category' );
		$this->assertNotWPError( $set_terms );

		// Get the data.
		$this->data_collector->update_cache();
		$result = $this->data_collector->collect();

		// Assert that we got no results.
		$this->assertNull( $result );
	}

	/**
	 * Test that excluded terms are not returned.
	 */
	public function test_collect_respects_excluded_terms() {
		// Create a category.
		$term_result = wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Add filter to exclude the term.
		add_filter(
			'progress_planner_terms_without_posts_exclude_term_ids',
			function () use ( $term_id ) {
				return [ $term_id ];
			}
		);

		// Get the data.
		$this->data_collector->update_cache();
		$result = $this->data_collector->collect();

		// Assert that we got no results.
		$this->assertNull( $result );
	}

	/**
	 * Test that cache is updated when term is deleted.
	 */
	public function test_cache_is_updated_when_term_is_deleted() {
		// Create a category.
		$term_result = wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Get initial data.
		$this->data_collector->update_cache();
		$initial_result = $this->data_collector->collect();
		$this->assertIsArray( $initial_result );

		// Delete the term.
		wp_delete_term( $term_id, 'category' );

		// Get data again.
		$this->data_collector->update_cache();
		$updated_result = $this->data_collector->collect();

		// Assert that we got no results after deletion.
		$this->assertNull( $updated_result );
	}

	/**
	 * Test that non-public taxonomies are ignored.
	 */
	public function test_collect_ignores_non_public_taxonomies() {
		// Register a non-public taxonomy.
		register_taxonomy(
			'test_taxonomy',
			'post',
			[
				'public' => false,
			]
		);

		// Create a term in the non-public taxonomy.
		$term_result = wp_insert_term( 'Test Term', 'test_taxonomy' );
		$this->assertNotWPError( $term_result );

		// Get the data.
		$this->data_collector->update_cache();
		$result = $this->data_collector->collect();

		// Assert that we got no results.
		$this->assertNull( $result );

		// Clean up.
		unregister_taxonomy( 'test_taxonomy' );
	}

	/**
	 * Test that cache is updated when terms are changed.
	 */
	public function test_cache_is_updated_when_terms_are_changed() {
		// Create a category.
		$term_result = wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Create two posts.
		$post_id1 = wp_insert_post(
			[
				'post_title'  => 'Test Post 1',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->assertNotWPError( $post_id1 );

		$post_id2 = wp_insert_post(
			[
				'post_title'  => 'Test Post 2',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->assertNotWPError( $post_id2 );

		// Get initial data.
		$this->data_collector->update_cache();
		$initial_result = $this->data_collector->collect();
		$this->assertIsArray( $initial_result );

		// Assign both terms to the posts.
		$set_terms = wp_set_object_terms( $post_id1, $term_id, 'category' );
		$this->assertNotWPError( $set_terms );

		$set_terms = wp_set_object_terms( $post_id2, $term_id, 'category' );
		$this->assertNotWPError( $set_terms );

		// Get data again.
		$this->data_collector->update_cache();
		$updated_result = $this->data_collector->collect();

		// Assert that we got no results after term assignment.
		$this->assertNull( $updated_result );
	}
}
