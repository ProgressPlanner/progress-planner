<?php
/**
 * Test prpl_recommendations custom post type operations.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Class Prpl_Recommendations_CPT_Test
 *
 * Tests all operations related to the prpl_recommendations custom post type.
 */
class Prpl_Recommendations_CPT_Test extends \WP_UnitTestCase {

	/**
	 * The Suggested_Tasks instance.
	 *
	 * @var \Progress_Planner\Suggested_Tasks
	 */
	protected $suggested_tasks;

	/**
	 * The Suggested_Tasks_DB instance.
	 *
	 * @var \Progress_Planner\Suggested_Tasks_DB
	 */
	protected $suggested_tasks_db;

	/**
	 * Set up the test.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->suggested_tasks    = \progress_planner()->get_suggested_tasks();
		$this->suggested_tasks_db = \progress_planner()->get_suggested_tasks_db();
	}

	/**
	 * Test that the prpl_recommendations post type is registered.
	 */
	public function test_post_type_is_registered() {
		$this->assertTrue( \post_type_exists( 'prpl_recommendations' ), 'prpl_recommendations post type should be registered' );
	}

	/**
	 * Test that the prpl_recommendations post type has correct configuration.
	 */
	public function test_post_type_configuration() {
		$post_type_object = \get_post_type_object( 'prpl_recommendations' );

		$this->assertNotNull( $post_type_object, 'Post type object should exist' );
		$this->assertFalse( $post_type_object->public, 'Post type should not be public' );
		$this->assertTrue( $post_type_object->show_in_rest, 'Post type should be available in REST API' );
		$this->assertEquals( \Progress_Planner\Rest\Recommendations_Controller::class, $post_type_object->rest_controller_class, 'Should use custom REST controller' );
		$this->assertTrue( $post_type_object->hierarchical, 'Post type should be hierarchical' );
		$this->assertTrue( $post_type_object->exclude_from_search, 'Post type should be excluded from search' );
	}

	/**
	 * Test that the prpl_recommendations_category taxonomy is registered.
	 */
	public function test_category_taxonomy_is_registered() {
		$this->assertTrue( \taxonomy_exists( 'prpl_recommendations_category' ), 'prpl_recommendations_category taxonomy should be registered' );
	}

	/**
	 * Test that the prpl_recommendations_provider taxonomy is registered.
	 */
	public function test_provider_taxonomy_is_registered() {
		$this->assertTrue( \taxonomy_exists( 'prpl_recommendations_provider' ), 'prpl_recommendations_provider taxonomy should be registered' );
	}

	/**
	 * Test that taxonomies have correct configuration.
	 */
	public function test_taxonomies_configuration() {
		$category_taxonomy = \get_taxonomy( 'prpl_recommendations_category' );
		$provider_taxonomy = \get_taxonomy( 'prpl_recommendations_provider' );

		$this->assertNotNull( $category_taxonomy, 'Category taxonomy should exist' );
		$this->assertNotNull( $provider_taxonomy, 'Provider taxonomy should exist' );

		$this->assertFalse( $category_taxonomy->public, 'Category taxonomy should not be public' );
		$this->assertFalse( $provider_taxonomy->public, 'Provider taxonomy should not be public' );

		$this->assertTrue( $category_taxonomy->show_in_rest, 'Category taxonomy should be available in REST API' );
		$this->assertTrue( $provider_taxonomy->show_in_rest, 'Provider taxonomy should be available in REST API' );

		$this->assertFalse( $category_taxonomy->hierarchical, 'Category taxonomy should not be hierarchical' );
		$this->assertFalse( $provider_taxonomy->hierarchical, 'Provider taxonomy should not be hierarchical' );
	}

	/**
	 * Test that post meta fields work correctly.
	 */
	public function test_post_meta_is_registered() {
		$post_id = $this->create_test_recommendation();

		// Test that meta fields can be set and retrieved.
		$task_id = \get_post_meta( $post_id, 'prpl_task_id', true );
		$this->assertNotEmpty( $task_id, 'prpl_task_id meta should be set' );

		// Test updating meta.
		\update_post_meta( $post_id, 'prpl_url', 'https://example.com/updated' );
		$url = \get_post_meta( $post_id, 'prpl_url', true );
		$this->assertEquals( 'https://example.com/updated', $url, 'prpl_url meta should be updatable' );

		// Test menu_order (this is a post property, not meta).
		$post = \get_post( $post_id );
		$this->assertIsNumeric( $post->menu_order, 'menu_order should be numeric' );
	}

	/**
	 * Test adding a recommendation.
	 */
	public function test_add_recommendation() {
		$data = [
			'task_id'     => 'test-task-' . \time(),
			'post_title'  => 'Test Recommendation',
			'description' => 'This is a test recommendation.',
			'category'    => 'test-category',
			'provider_id' => 'test-provider',
			'post_status' => 'publish',
			'order'       => 5,
			'url'         => 'https://example.com',
		];

		$post_id = $this->suggested_tasks_db->add( $data );

		$this->assertGreaterThan( 0, $post_id, 'Post ID should be greater than 0' );

		$post = \get_post( $post_id );
		$this->assertNotNull( $post, 'Post should exist' );
		$this->assertEquals( 'prpl_recommendations', $post->post_type, 'Post type should be prpl_recommendations' );
		$this->assertEquals( 'Test Recommendation', $post->post_title, 'Post title should match' );
		$this->assertEquals( 'publish', $post->post_status, 'Post status should be publish' );
		$this->assertEquals( 5, $post->menu_order, 'Menu order should match' );

		// Test meta fields.
		$task_id = \get_post_meta( $post_id, 'prpl_task_id', true );
		$url     = \get_post_meta( $post_id, 'prpl_url', true );

		$this->assertEquals( $data['task_id'], $task_id, 'Task ID meta should match' );
		$this->assertEquals( $data['url'], $url, 'URL meta should match' );

		// Test taxonomies.
		$this->assertTrue( \has_term( 'test-category', 'prpl_recommendations_category', $post_id ), 'Post should have category term' );
		$this->assertTrue( \has_term( 'test-provider', 'prpl_recommendations_provider', $post_id ), 'Post should have provider term' );
	}

	/**
	 * Test that duplicate recommendations are not created.
	 */
	public function test_duplicate_recommendations_prevented() {
		$task_id = 'test-duplicate-task-' . \time();
		$data    = [
			'task_id'     => $task_id,
			'post_title'  => 'Duplicate Test',
			'category'    => 'test-category',
			'provider_id' => 'test-provider',
		];

		$post_id_1 = $this->suggested_tasks_db->add( $data );
		$post_id_2 = $this->suggested_tasks_db->add( $data );

		$this->assertEquals( $post_id_1, $post_id_2, 'Duplicate recommendations should return the same post ID' );

		// Verify only one post exists.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'any',
				'meta_query'  => [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					[
						'key'   => 'prpl_task_id',
						'value' => $task_id,
					],
				],
			]
		);

		$this->assertCount( 1, $posts, 'Only one post should exist for duplicate task_id' );
	}

	/**
	 * Test updating a recommendation.
	 */
	public function test_update_recommendation() {
		$post_id = $this->create_test_recommendation();

		$result = $this->suggested_tasks_db->update_recommendation(
			$post_id,
			[
				'post_status' => 'trash',
				'post_title'  => 'Updated Title',
			]
		);

		$this->assertTrue( $result, 'Update should return true' );

		$post = \get_post( $post_id );
		$this->assertEquals( 'trash', $post->post_status, 'Post status should be updated' );
		$this->assertEquals( 'Updated Title', $post->post_title, 'Post title should be updated' );
	}

	/**
	 * Test updating recommendation taxonomies.
	 */
	public function test_update_recommendation_taxonomies() {
		$post_id = $this->create_test_recommendation();

		$new_category = \get_term_by( 'slug', 'new-category', 'prpl_recommendations_category' );
		if ( ! $new_category ) {
			$new_category = \wp_insert_term( 'new-category', 'prpl_recommendations_category' );
			$new_category = \get_term( $new_category['term_id'], 'prpl_recommendations_category' );
		}

		$result = $this->suggested_tasks_db->update_recommendation(
			$post_id,
			[
				'category' => $new_category,
			]
		);

		$this->assertTrue( $result, 'Update should return true' );
		$this->assertTrue( \has_term( 'new-category', 'prpl_recommendations_category', $post_id ), 'Post should have new category term' );
	}

	/**
	 * Test deleting a recommendation.
	 */
	public function test_delete_recommendation() {
		$post_id = $this->create_test_recommendation();

		$result = $this->suggested_tasks_db->delete_recommendation( $post_id );

		$this->assertTrue( $result, 'Delete should return true' );

		$post = \get_post( $post_id );
		$this->assertNull( $post, 'Post should not exist after deletion' );
	}

	/**
	 * Test deleting all recommendations.
	 */
	public function test_delete_all_recommendations() {
		// Create multiple recommendations.
		$this->create_test_recommendation();
		$this->create_test_recommendation();
		$this->create_test_recommendation();

		$this->suggested_tasks_db->delete_all_recommendations();

		$posts = $this->suggested_tasks_db->get();
		$this->assertEmpty( $posts, 'No recommendations should exist after delete all' );
	}

	/**
	 * Test getting recommendations.
	 */
	public function test_get_recommendations() {
		// Create test recommendations.
		$post_id_1 = $this->create_test_recommendation( [ 'order' => 1 ] );
		$post_id_2 = $this->create_test_recommendation( [ 'order' => 2 ] );

		$recommendations = $this->suggested_tasks_db->get();

		$this->assertIsArray( $recommendations, 'Should return an array' );
		$this->assertGreaterThanOrEqual( 2, \count( $recommendations ), 'Should return at least 2 recommendations' );
		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $recommendations[0], 'Should return Task objects' );

		// Verify ordering.
		$found_1 = false;
		$found_2 = false;
		foreach ( $recommendations as $rec ) {
			if ( $rec->ID === $post_id_1 ) {
				$found_1 = true;
			}
			if ( $rec->ID === $post_id_2 ) {
				$found_2 = true;
				$this->assertTrue( $found_1, 'Recommendations should be ordered by menu_order' );
			}
		}
	}

	/**
	 * Test getting recommendations by task_id.
	 */
	public function test_get_tasks_by_task_id() {
		$task_id = 'unique-task-' . \time();
		$this->create_test_recommendation( [ 'task_id' => $task_id ] );

		$tasks = $this->suggested_tasks_db->get_tasks_by( [ 'task_id' => $task_id ] );

		$this->assertCount( 1, $tasks, 'Should return exactly one task' );
		$this->assertEquals( $task_id, $tasks[0]->task_id, 'Task ID should match' );
	}

	/**
	 * Test getting recommendations by provider.
	 */
	public function test_get_tasks_by_provider() {
		$provider = 'unique-provider-' . \time();
		$this->create_test_recommendation( [ 'provider_id' => $provider ] );

		$tasks = $this->suggested_tasks_db->get_tasks_by( [ 'provider' => $provider ] );

		$this->assertGreaterThanOrEqual( 1, \count( $tasks ), 'Should return at least one task' );
	}

	/**
	 * Test getting recommendations by category.
	 */
	public function test_get_tasks_by_category() {
		$category = 'unique-category-' . \time();
		$this->create_test_recommendation( [ 'category' => $category ] );

		$tasks = $this->suggested_tasks_db->get_tasks_by( [ 'category' => $category ] );

		$this->assertGreaterThanOrEqual( 1, \count( $tasks ), 'Should return at least one task' );
	}

	/**
	 * Test getting a recommendation post.
	 */
	public function test_get_post() {
		$task_id = 'test-get-post-' . \time();
		$post_id = $this->create_test_recommendation( [ 'task_id' => $task_id ] );

		// Test by post ID.
		$task = $this->suggested_tasks_db->get_post( $post_id );
		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task, 'Should return a Task object' );
		$this->assertEquals( $post_id, $task->ID, 'Post ID should match' );

		// Test by task ID.
		$task = $this->suggested_tasks_db->get_post( $task_id );
		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task, 'Should return a Task object' );
		$this->assertEquals( $task_id, $task->task_id, 'Task ID should match' );
	}

	/**
	 * Test recommendation status transitions.
	 */
	public function test_status_transitions() {
		$post_id = $this->create_test_recommendation( [ 'post_status' => 'publish' ] );

		// Test publish to trash.
		$this->suggested_tasks_db->update_recommendation( $post_id, [ 'post_status' => 'trash' ] );
		$post = \get_post( $post_id );
		$this->assertEquals( 'trash', $post->post_status, 'Status should transition to trash' );

		// Restore from trash.
		$this->suggested_tasks_db->update_recommendation( $post_id, [ 'post_status' => 'publish' ] );
		$post = \get_post( $post_id );
		$this->assertEquals( 'publish', $post->post_status, 'Status should transition back to publish' );

		// Test publish to pending.
		$this->suggested_tasks_db->update_recommendation( $post_id, [ 'post_status' => 'pending' ] );
		$post = \get_post( $post_id );
		$this->assertEquals( 'pending', $post->post_status, 'Status should transition to pending' );

		// Restore to publish before testing future transition.
		$this->suggested_tasks_db->update_recommendation( $post_id, [ 'post_status' => 'publish' ] );

		// Test publish to future (snoozed) - need to update post_date and post_date_gmt as well.
		$future_date = \gmdate( 'Y-m-d H:i:s', \strtotime( '+1 day' ) );
		$this->suggested_tasks_db->update_recommendation(
			$post_id,
			[
				'post_status'   => 'future',
				'post_date'     => $future_date,
				'post_date_gmt' => $future_date,
			]
		);
		$post = \get_post( $post_id );
		$this->assertEquals( 'future', $post->post_status, 'Status should transition to future' );
	}

	/**
	 * Test creating a snoozed recommendation.
	 */
	public function test_create_snoozed_recommendation() {
		$future_time = \time() + 86400; // 1 day from now.
		$data        = [
			'task_id'     => 'snoozed-task-' . \time(),
			'post_title'  => 'Snoozed Task',
			'category'    => 'test-category',
			'provider_id' => 'test-provider',
			'post_status' => 'snoozed',
			'time'        => $future_time,
		];

		$post_id = $this->suggested_tasks_db->add( $data );

		$post = \get_post( $post_id );
		$this->assertEquals( 'future', $post->post_status, 'Snoozed tasks should have future status' );

		$task = $this->suggested_tasks_db->get_post( $post_id );
		$this->assertTrue( $task->is_snoozed(), 'Task should be marked as snoozed' );

		$snoozed_until = $task->snoozed_until();
		$this->assertInstanceOf( \DateTime::class, $snoozed_until, 'Snoozed until should be a DateTime object' );
	}

	/**
	 * Test Task object is_completed method.
	 */
	public function test_task_is_completed() {
		// Test completed (trash status).
		$post_id = $this->create_test_recommendation( [ 'post_status' => 'trash' ] );
		$task    = $this->suggested_tasks_db->get_post( $post_id );
		$this->assertTrue( $task->is_completed(), 'Task with trash status should be marked as completed' );

		// Test completed (pending status).
		$post_id = $this->create_test_recommendation( [ 'post_status' => 'pending' ] );
		$task    = $this->suggested_tasks_db->get_post( $post_id );
		$this->assertTrue( $task->is_completed(), 'Task with pending status should be marked as completed' );

		// Test not completed (publish status).
		$post_id = $this->create_test_recommendation( [ 'post_status' => 'publish' ] );
		$task    = $this->suggested_tasks_db->get_post( $post_id );
		$this->assertFalse( $task->is_completed(), 'Task with publish status should not be marked as completed' );
	}

	/**
	 * Test Task object celebrate method.
	 */
	public function test_task_celebrate() {
		$post_id = $this->create_test_recommendation( [ 'post_status' => 'publish' ] );
		$task    = $this->suggested_tasks_db->get_post( $post_id );

		$result = $task->celebrate();
		$this->assertTrue( $result, 'Celebrate should return true' );

		$post = \get_post( $post_id );
		$this->assertEquals( 'pending', $post->post_status, 'Post status should be pending after celebrate' );
	}

	/**
	 * Test Task object delete method.
	 */
	public function test_task_delete() {
		$post_id = $this->create_test_recommendation();
		$task    = $this->suggested_tasks_db->get_post( $post_id );

		$task->delete();

		$post = \get_post( $post_id );
		$this->assertNull( $post, 'Post should not exist after task delete' );
	}

	/**
	 * Test custom trash lifetime for prpl_recommendations.
	 */
	public function test_trash_lifetime() {
		$post = new \WP_Post( (object) [ 'post_type' => 'prpl_recommendations' ] );
		$days = $this->suggested_tasks->change_trashed_posts_lifetime( 30, $post );

		$this->assertEquals( 60, $days, 'prpl_recommendations should have 60-day trash lifetime' );

		// Test other post types are not affected.
		$post = new \WP_Post( (object) [ 'post_type' => 'post' ] );
		$days = $this->suggested_tasks->change_trashed_posts_lifetime( 30, $post );

		$this->assertEquals( 30, $days, 'Other post types should keep default trash lifetime' );
	}

	/**
	 * Test REST API tax query filtering.
	 */
	public function test_rest_api_tax_query() {
		$request = new \WP_REST_Request();
		$request->set_param( 'provider', 'test-provider,another-provider' );
		$request->set_param( 'exclude_provider', 'excluded-provider' );

		$args = $this->suggested_tasks->rest_api_tax_query( [], $request );

		$this->assertArrayHasKey( 'tax_query', $args, 'Tax query should be set' );
		$this->assertIsArray( $args['tax_query'], 'Tax query should be an array' );
		$this->assertCount( 2, $args['tax_query'], 'Should have 2 tax query conditions' );

		// Check include provider.
		$this->assertEquals( 'prpl_recommendations_provider', $args['tax_query'][0]['taxonomy'] );
		$this->assertEquals( 'IN', $args['tax_query'][0]['operator'] );
		$this->assertContains( 'test-provider', $args['tax_query'][0]['terms'] );

		// Check exclude provider.
		$this->assertEquals( 'prpl_recommendations_provider', $args['tax_query'][1]['taxonomy'] );
		$this->assertEquals( 'NOT IN', $args['tax_query'][1]['operator'] );
		$this->assertContains( 'excluded-provider', $args['tax_query'][1]['terms'] );
	}

	/**
	 * Test REST API sorting parameters.
	 */
	public function test_rest_api_sorting() {
		$request = new \WP_REST_Request();
		$request->set_param(
			'filter',
			[
				'orderby' => 'title',
				'order'   => 'DESC',
			]
		);

		$args = $this->suggested_tasks->rest_api_tax_query( [], $request );

		$this->assertEquals( 'title', $args['orderby'], 'Orderby should be set' );
		$this->assertEquals( 'DESC', $args['order'], 'Order should be set' );
	}

	/**
	 * Test format_recommendation method.
	 */
	public function test_format_recommendation() {
		$post_id = $this->create_test_recommendation();
		$post    = \get_post( $post_id );

		$task = $this->suggested_tasks_db->format_recommendation( $post );

		$this->assertInstanceOf( \Progress_Planner\Suggested_Tasks\Task::class, $task, 'Should return a Task object' );
		$this->assertEquals( $post_id, $task->ID, 'Task ID should match post ID' );
	}

	/**
	 * Test get_rest_formatted_data method.
	 */
	public function test_get_rest_formatted_data() {
		$post_id = $this->create_test_recommendation();
		$task    = $this->suggested_tasks_db->get_post( $post_id );

		$rest_data = $task->get_rest_formatted_data();

		$this->assertIsArray( $rest_data, 'Should return an array' );
		$this->assertArrayHasKey( 'id', $rest_data, 'Should have id field' );
		$this->assertArrayHasKey( 'title', $rest_data, 'Should have title field' );
		$this->assertArrayHasKey( 'status', $rest_data, 'Should have status field' );
		$this->assertEquals( $post_id, $rest_data['id'], 'ID should match' );
	}

	/**
	 * Test hierarchical post support (parent/child relationships).
	 */
	public function test_hierarchical_posts() {
		$parent_id = $this->create_test_recommendation();
		$child_id  = $this->create_test_recommendation( [ 'parent' => $parent_id ] );

		$child_post = \get_post( $child_id );
		$this->assertEquals( $parent_id, $child_post->post_parent, 'Child post should have correct parent' );
	}

	/**
	 * Test caching of get() method.
	 */
	public function test_get_recommendations_caching() {
		// Clear cache.
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );

		$this->create_test_recommendation();

		// First call - should populate cache.
		$results_1 = $this->suggested_tasks_db->get();

		// Second call - should use cache.
		$results_2 = $this->suggested_tasks_db->get();

		$this->assertEquals( $results_1, $results_2, 'Cached results should match' );
	}

	/**
	 * Test cache is flushed on delete.
	 */
	public function test_cache_flush_on_delete() {
		$post_id = $this->create_test_recommendation();

		// Populate cache.
		$this->suggested_tasks_db->get();

		// Delete should flush cache.
		$this->suggested_tasks_db->delete_recommendation( $post_id );

		// Verify cache was flushed by checking the post is not in results.
		$results = $this->suggested_tasks_db->get();
		foreach ( $results as $task ) {
			$this->assertNotEquals( $post_id, $task->ID, 'Deleted post should not be in cached results' );
		}
	}

	/**
	 * Helper method to create a test recommendation.
	 *
	 * @param array $overrides Data to override defaults.
	 * @return int The post ID.
	 */
	protected function create_test_recommendation( array $overrides = [] ): int {
		static $counter = 0;
		++$counter;

		$defaults = [
			'task_id'     => 'test-task-' . \time() . '-' . $counter,
			'post_title'  => 'Test Recommendation ' . $counter,
			'description' => 'Test description',
			'category'    => 'test-category',
			'provider_id' => 'test-provider',
			'post_status' => 'publish',
			'order'       => $counter,
		];

		$data = \wp_parse_args( $overrides, $defaults );

		return $this->suggested_tasks_db->add( $data );
	}

	/**
	 * Clean up after tests.
	 */
	public function tearDown(): void {
		// Clean up all prpl_recommendations posts.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'any',
				'numberposts' => -1,
			]
		);

		foreach ( $posts as $post ) {
			\wp_delete_post( $post->ID, true );
		}

		// Flush cache.
		\wp_cache_flush_group( \Progress_Planner\Suggested_Tasks_DB::GET_TASKS_CACHE_GROUP );

		parent::tearDown();
	}
}
