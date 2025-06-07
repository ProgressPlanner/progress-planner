<?php
/**
 * Test Content actions.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use DateTime;
use Progress_Planner\Actions\Content;
use WP_UnitTestCase;

/**
 * Class Content_Actions_Test
 */
class Content_Actions_Test extends \WP_UnitTestCase {

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
		$post_id = wp_insert_post( $post_data );

		// Assert that activities were created.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'type'     => 'publish',
				'data_id'  => $post_id,
			],
			'RAW'
		);

		$this->assertNotEmpty( $activities );
	}

	/**
	 * Test post status transition hook.
	 */
	public function test_transition_post_status_hook() {
		// Create a draft post.
		$post_id = wp_insert_post(
			[
				'post_title'   => 'Draft Post',
				'post_content' => 'Draft content',
				'post_status'  => 'draft',
			]
		);

		// Publish the post.
		wp_publish_post( $post_id );

		// Assert that publish activity was created.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			],
			'RAW'
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
		$post_id = wp_insert_post(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		// Trash the post.
		wp_trash_post( $post_id );

		// Assert that trash activity was created.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'type'     => 'trash',
				'data_id'  => $post_id,
			],
			'RAW'
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'trash', $activities[0]->type );
	}

	/**
	 * Test post delete hook.
	 */
	public function test_delete_post_hook() {
		// Create a post.
		$post_id = wp_insert_post(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		// Delete the post.
		wp_delete_post( $post_id, true );

		// Assert that delete activity was created.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'type'     => 'delete',
				'data_id'  => $post_id,
			],
			'RAW'
		);

		$this->assertCount( 1, $activities );
		$this->assertEquals( 'delete', $activities[0]->type );
	}

	/**
	 * Test multiple status transitions.
	 */
	public function test_multiple_status_transitions() {
		// Create a draft post.
		$post_id = wp_insert_post(
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
			],
			'ACTIVITIES'
		);

		$this->assertCount( 0, $activities );

		// Transition to pending.
		wp_update_post(
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
			],
			'ACTIVITIES'
		);

		$this->assertCount( 0, $activities );

		// Transition to publish and update content (insert publish activity).
		wp_update_post(
			[
				'ID'           => $post_id,
				'post_content' => 'Updated content.',
			]
		);

		// Transition back to draft.
		wp_update_post(
			[
				'ID'          => $post_id,
				'post_status' => 'draft',
			]
		);

		// Transition to publish and update content again (since the post is updated less then 12 hours, we should not add an update activity because 'publish' activity is already created).
		wp_update_post(
			[
				'ID'           => $post_id,
				'post_status'  => 'publish',
				'post_content' => 'Updated content again.',
			]
		);

		// Assert activities were created in correct order.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'content',
				'data_id'  => $post_id,
			],
			'RAW'
		);

		// Get the types in order.
		$types = array_map(
			function ( $activity ) {
				return $activity->type;
			},
			$activities
		);

		$this->assertCount( 1, $types );
		$this->assertContains( 'publish', $types ); // Should have publish when first published.
		$this->assertnotContains( 'update', $types ); // Update activity is only added when post is updated more than 12 hours after publish.
	}

	/**
	 * Clean up after each test.
	 */
	public function tearDown(): void {
		parent::tearDown();

		// Clean up any posts created during the test.
		$posts = get_posts( [ 'numberposts' => -1 ] );
		foreach ( $posts as $post ) {
			wp_delete_post( $post->ID, true );
		}
	}
}
