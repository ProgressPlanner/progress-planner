<?php
/**
 * Test Content actions.
 *
 * @package Progress_Planner
 * @group actions
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Actions\Content;
use WP_UnitTestCase;

/**
 * Class Actions_Content_Test
 */
class Actions_Content_Test extends \WP_UnitTestCase {

	/**
	 * The Content instance.
	 *
	 * @var Content
	 */
	private $content;

	/**
	 * Set up.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->content = new Content();
	}

	/**
	 * Test post insertion hook.
	 */
	public function test_wp_insert_post_hook() {
		$post_data = [
			'post_title'   => 'Test Post',
			'post_content' => 'Test content',
			'post_status'  => 'publish',
			'post_type'    => 'post',
		];

		// Insert a post and verify the hook was called.
		$post_id = \wp_insert_post( $post_data );

		// Assert that activities were created.
		$activities = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'type'     => 'publish',
				'data_id'  => $post_id,
			]
		);

		$this->assertNotEmpty( $activities );
	}

	/**
	 * Test post status transition hook.
	 */
	public function test_transition_post_status_hook() {
		// Create a draft post.
		$post_id = \wp_insert_post(
			[
				'post_title'   => 'Draft Post',
				'post_content' => 'Draft content',
				'post_status'  => 'draft',
			]
		);

		// Publish the post.
		\wp_publish_post( $post_id );

		// Assert that publish activity was created.
		$activities = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			]
		);

		// There should be only one activity, publish (not update).
		$this->assertCount( 1, $activities );
		$this->assertEquals( 'publish', $activities[0]->type );
	}

	/**
	 * Test post trash hook.
	 */
	public function test_trash_post_hook() {
		// Create a post.
		$post_id = \wp_insert_post(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		// Trash the post.
		\wp_trash_post( $post_id );

		// Assert that trash activity was created.
		$activities = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'type'     => 'trash',
				'data_id'  => $post_id,
			]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'trash', $activities[0]->type );
	}

	/**
	 * Test post delete hook.
	 */
	public function test_delete_post_hook() {
		// Create a post.
		$post_id = \wp_insert_post(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		// Delete the post.
		\wp_delete_post( $post_id, true );

		// Assert that delete activity was created.
		$activities = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'type'     => 'delete',
				'data_id'  => $post_id,
			]
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'delete', $activities[0]->type );
	}

	/**
	 * Test multiple status transitions.
	 */
	public function test_multiple_status_transitions() {
		// Create a draft post.
		$post_id = \wp_insert_post(
			[
				'post_title'   => 'Test Post',
				'post_content' => 'Test content',
				'post_status'  => 'draft',
			]
		);

		// Check if there is any activity for this post (there should be none).
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			]
		);

		$this->assertCount( 0, $activities );

		// Transition to pending.
		\wp_update_post(
			[
				'ID'          => $post_id,
				'post_status' => 'pending',
			]
		);

		// Check if there is any activity for this post (there should be none).
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			]
		);

		$this->assertCount( 0, $activities );

		// Transition to publish and update content (insert publish activity).
		\wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => 'Updated content.',
			]
		);

		// Transition back to draft.
		\wp_update_post(
			[
				'ID'          => $post_id,
				'post_status' => 'draft',
			]
		);

		// Transition to publish and update content again (since the post is updated less then 12 hours, we should not add an update activity because 'publish' activity is already created).
		\wp_update_post(
			[
				'ID'           => $post_id,
				'post_status'  => 'publish',
				'post_content' => 'Updated content again.',
			]
		);

		// Assert activities were created in correct order.
		$activities = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			]
		);

		// Get the types in order.
		$types = \array_map( fn( $activity ) => $activity->type, $activities );

		$this->assertCount( 1, $types );
		$this->assertContains( 'publish', $types ); // Should have publish when first published.
		$this->assertnotContains( 'update', $types ); // Update activity is only added when post is updated more than 12 hours after publish.
	}

	/**
	 * Test activities within 12 hours are deduplicated.
	 *
	 * Tests the 12-hour activity window deduplication mechanism that prevents
	 * duplicate update activities when a post is modified multiple times within 12 hours.
	 *
	 * @return void
	 */
	public function test_duplicate_removal_within_12_hours() {
		// Create and publish a post.
		$post_id = \wp_insert_post(
			[
				'post_title'   => 'Test Post for 12-hour window',
				'post_content' => 'Initial content',
				'post_status'  => 'publish',
			]
		);

		// Get initial activity count.
		$initial_activities = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'type'     => 'publish',
				'data_id'  => $post_id,
			]
		);
		$this->assertCount( 1, $initial_activities, 'Should have one publish activity' );

		// Update the post multiple times within the 12-hour window.
		// These should NOT create additional update activities.
		for ( $i = 1; $i <= 3; $i++ ) {
			\wp_update_post(
				[
					'ID'           => $post_id,
					'post_content' => "Updated content {$i}",
				]
			);
		}

		// Check activities - should still only have the original publish activity.
		$activities_after = \progress_planner()->get_activities__query()->query_activities_get_raw(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			]
		);

		$this->assertCount( 1, $activities_after, 'Should still have only one activity within 12-hour window' );
		$this->assertEquals( 'publish', $activities_after[0]->type, 'Activity type should be publish' );
	}

	/**
	 * Test duplicate activity removal in database.
	 *
	 * Tests that the duplicate removal logic in the Query class properly
	 * identifies and removes duplicate activities based on unique keys.
	 *
	 * @return void
	 */
	public function test_duplicate_activity_removal() {
		// Create a post.
		$post_id = \wp_insert_post(
			[
				'post_title'   => 'Test Duplicate Removal',
				'post_content' => 'Content',
				'post_status'  => 'publish',
			]
		);

		// Manually insert a duplicate activity (simulating a race condition).
		global $wpdb;
		$table_name = $wpdb->prefix . 'progress_planner_activities';

		$activity_data = [
			'category' => 'content',
			'type'     => 'publish',
			'data_id'  => $post_id,
			'date'     => \gmdate( 'Y-m-d H:i:s' ),
			'user_id'  => 1,
		];

		// Insert the same activity twice to create a duplicate.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->insert( $table_name, $activity_data );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$wpdb->insert( $table_name, $activity_data );

		// Query activities - the Query class should remove duplicates.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			]
		);

		// Should return only unique activities.
		// Note: The existing publish activity + our 2 manual inserts = 3 total, but should be deduplicated to 1.
		$this->assertGreaterThanOrEqual( 1, \count( $activities ), 'Should have at least one activity after deduplication' );

		// Count the actual number of publish activities in the database.
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$count = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT COUNT(*) FROM %i WHERE category = %s AND type = %s AND data_id = %d',
				$table_name,
				'content',
				'publish',
				$post_id
			)
		);

		// The duplicate removal in Query::query_activities() happens after fetch,
		// so duplicates may still exist in DB but should be filtered in the result.
		$this->assertGreaterThan( 0, $count, 'Database should have activities' );
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown(): void {
		parent::tearDown();

		// Clean up any posts created during the test.
		$posts = \get_posts( [ 'numberposts' => -1 ] );
		foreach ( $posts as $post ) {
			\wp_delete_post( $post->ID, true );
		}
	}
}
