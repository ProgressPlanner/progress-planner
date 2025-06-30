<?php
/**
 * Unit tests for Terms_Without_Description_Data_Collector_Test class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Description;
use WP_UnitTestCase;

/**
 * Class Terms_Without_Description_Data_Collector_Test.
 */
class Terms_Without_Description_Data_Collector_Test extends \WP_UnitTestCase {

	/**
	 * The data collector instance.
	 *
	 * @var Terms_Without_Description
	 */
	private $data_collector;

	/**
	 * Original description of the default category.
	 *
	 * @var string
	 */
	private $default_cat_original_description;

	/**
	 * Set up the test.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->data_collector = new Terms_Without_Description();
		$this->data_collector->init();

		// Get the default category and store its original description.
		$default_cat                            = \get_cat_ID( 'Uncategorized' );
		$default_term                           = \get_term( $default_cat, 'category' );
		$this->default_cat_original_description = $default_term->description;

		// Add a temporary description.
		\wp_update_term( $default_cat, 'category', [ 'description' => 'Temporary Description' ] );
	}

	/**
	 * Clean up after the test.
	 */
	public function tearDown(): void {
		// Restore the original description.
		$default_cat = \get_cat_ID( 'Uncategorized' );
		\wp_update_term( $default_cat, 'category', [ 'description' => $this->default_cat_original_description ] );

		parent::tearDown();
	}

	/**
	 * Test that the data collector returns terms without description.
	 */
	public function test_collect_returns_terms_without_description() {
		// Create a category with description.
		$term_with_desc = \wp_insert_term( 'Category With Description', 'category', [ 'description' => 'Test Description' ] );
		$this->assertNotWPError( $term_with_desc );

		// Create our test category with empty description.
		$term_result = \wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Create two posts and assign the term to them.
		$post_id1 = \wp_insert_post(
			[
				'post_title'   => 'Test Post 1',
				'post_content' => 'Test content 1',
				'post_status'  => 'publish',
				'post_type'    => 'post',
			]
		);
		$this->assertNotWPError( $post_id1 );
		\wp_set_object_terms( $post_id1, $term_id, 'category' );

		$post_id2 = \wp_insert_post(
			[
				'post_title'   => 'Test Post 2',
				'post_content' => 'Test content 2',
				'post_status'  => 'publish',
				'post_type'    => 'post',
			]
		);
		$this->assertNotWPError( $post_id2 );
		\wp_set_object_terms( $post_id2, $term_id, 'category' );

		// Get the data.
		$this->data_collector->update_cache();
		$result = $this->data_collector->collect();

		// Assert that we got our specific test term.
		$this->assertIsArray( $result );
		$this->assertEquals( $term_id, $result['term_id'] );
		$this->assertEquals( 'Test Category', $result['name'] );
		$this->assertEquals( 'category', $result['taxonomy'] );

		// Clean up.
		\wp_delete_post( $post_id1 );
		\wp_delete_post( $post_id2 );
	}

	/**
	 * Test that terms with description are not returned.
	 */
	public function test_collect_ignores_terms_with_description() {
		// Create a category with description.
		$term_result = \wp_insert_term( 'Test Category', 'category', [ 'description' => 'Test Description' ] );
		$this->assertNotWPError( $term_result );

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
		// Create a category with empty description.
		$term_result = \wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Add filter to exclude the term.
		\add_filter(
			'progress_planner_terms_without_description_exclude_term_ids',
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
	 * Test that cache is updated when term is edited.
	 */
	public function test_cache_is_updated_when_term_is_edited() {
		// Create a category with empty description.
		$term_result = \wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Create a post and assign the term to it.
		$post_id1 = \wp_insert_post(
			[
				'post_title'   => 'Test Post 1',
				'post_content' => 'Test content 1',
				'post_status'  => 'publish',
				'post_type'    => 'post',
			]
		);
		$this->assertNotWPError( $post_id1 );
		\wp_set_object_terms( $post_id1, $term_id, 'category' );

		$post_id2 = \wp_insert_post(
			[
				'post_title'   => 'Test Post 2',
				'post_content' => 'Test content 2',
				'post_status'  => 'publish',
				'post_type'    => 'post',
			]
		);
		$this->assertNotWPError( $post_id2 );
		\wp_set_object_terms( $post_id2, $term_id, 'category' );

		// Get initial data.
		$this->data_collector->update_cache();
		$initial_result = $this->data_collector->collect();
		$this->assertIsArray( $initial_result );

		// Edit the term to add description.
		\wp_update_term(
			$term_id,
			'category',
			[
				'description' => 'Test Description',
			]
		);

		// Get data again.
		$this->data_collector->update_cache();
		$updated_result = $this->data_collector->collect();

		// Assert that we got no results after update.
		$this->assertNull( $updated_result );

		// Clean up.
		\wp_delete_post( $post_id1 );
		\wp_delete_post( $post_id2 );
	}

	/**
	 * Test that cache is updated when term is deleted.
	 */
	public function test_cache_is_updated_when_term_is_deleted() {
		// Create a category with empty description.
		$term_result = \wp_insert_term( 'Test Category', 'category' );
		$this->assertNotWPError( $term_result );
		$term_id = $term_result['term_id'];

		// Create a post and assign the term to it.
		$post_id1 = \wp_insert_post(
			[
				'post_title'   => 'Test Post 1',
				'post_content' => 'Test content 1',
				'post_status'  => 'publish',
				'post_type'    => 'post',
			]
		);
		$this->assertNotWPError( $post_id1 );
		\wp_set_object_terms( $post_id1, $term_id, 'category' );

		$post_id2 = \wp_insert_post(
			[
				'post_title'   => 'Test Post 2',
				'post_content' => 'Test content 2',
				'post_status'  => 'publish',
				'post_type'    => 'post',
			]
		);
		$this->assertNotWPError( $post_id2 );
		\wp_set_object_terms( $post_id2, $term_id, 'category' );

		// Get initial data.
		$this->data_collector->update_cache();
		$initial_result = $this->data_collector->collect();
		$this->assertIsArray( $initial_result );

		// Delete the term.
		\wp_delete_term( $term_id, 'category' );

		// Get data again.
		$this->data_collector->update_cache();
		$updated_result = $this->data_collector->collect();

		// Assert that we got no results after deletion.
		$this->assertNull( $updated_result );

		// Clean up.
		\wp_delete_post( $post_id1 );
		\wp_delete_post( $post_id2 );
	}

	/**
	 * Test that non-public taxonomies are ignored.
	 */
	public function test_collect_ignores_non_public_taxonomies() {
		// Register a non-public taxonomy.
		\register_taxonomy(
			'test_taxonomy',
			'post',
			[
				'public' => false,
			]
		);

		// Create a term in the non-public taxonomy.
		$term_result = \wp_insert_term( 'Test Term', 'test_taxonomy' );
		$this->assertNotWPError( $term_result );

		// Get the data.
		$this->data_collector->update_cache();
		$result = $this->data_collector->collect();

		// Assert that we got no results.
		$this->assertNull( $result );

		// Clean up.
		\unregister_taxonomy( 'test_taxonomy' );
	}
}
