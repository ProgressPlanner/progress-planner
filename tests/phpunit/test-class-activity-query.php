<?php
/**
 * Tests for the Activities Query class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activities\Query;
use Progress_Planner\Activities\Activity;
use WP_UnitTestCase;

/**
 * Test the Activities Query class.
 */
class Test_Activity_Query extends WP_UnitTestCase {

	/**
	 * The Query instance.
	 *
	 * @var Query
	 */
	private $query;

	/**
	 * Set up before each test.
	 */
	public function set_up() {
		parent::set_up();
		$this->query = new Query();

		// Clean up any existing activities.
		global $wpdb;
		$wpdb->query( 'TRUNCATE TABLE ' . $wpdb->prefix . Query::TABLE_NAME );
		wp_cache_flush_group( Query::CACHE_GROUP );
	}

	/**
	 * Tear down after each test.
	 */
	public function tear_down() {
		global $wpdb;
		$wpdb->query( 'TRUNCATE TABLE ' . $wpdb->prefix . Query::TABLE_NAME );
		wp_cache_flush_group( Query::CACHE_GROUP );
		parent::tear_down();
	}

	/**
	 * Test that the database table is created.
	 */
	public function test_create_tables() {
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;

		// Table should exist after constructor.
		$this->assertEquals( $table_name, $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) );
	}

	/**
	 * Test inserting an activity.
	 */
	public function test_insert_activity() {
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;

		$id = $this->query->insert_activity( $activity );

		$this->assertIsInt( $id );
		$this->assertGreaterThan( 0, $id );
	}

	/**
	 * Test inserting multiple activities.
	 */
	public function test_insert_activities() {
		$activities = [];
		for ( $i = 0; $i < 3; $i++ ) {
			$activity           = new Activity();
			$activity->date     = new \DateTime( '2024-01-' . ( 15 + $i ) );
			$activity->category = 'content';
			$activity->type     = 'post_published';
			$activity->data_id  = (string) ( 100 + $i );
			$activity->user_id  = 1;
			$activities[]       = $activity;
		}

		$ids = $this->query->insert_activities( $activities );

		$this->assertIsArray( $ids );
		$this->assertCount( 3, $ids );
		foreach ( $ids as $id ) {
			$this->assertIsInt( $id );
			$this->assertGreaterThan( 0, $id );
		}
	}

	/**
	 * Test querying activities with no filters.
	 */
	public function test_query_activities_no_filters() {
		// Insert test data.
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-16' );
		$activity2->category = 'maintenance';
		$activity2->type     = 'plugin_updated';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		$results = $this->query->query_activities( [] );

		$this->assertIsArray( $results );
		$this->assertCount( 2, $results );
		$this->assertInstanceOf( Activity::class, $results[0] );
	}

	/**
	 * Test querying activities by date range.
	 */
	public function test_query_activities_by_date_range() {
		// Insert test data across multiple dates.
		for ( $i = 10; $i <= 20; $i++ ) {
			$activity           = new Activity();
			$activity->date     = new \DateTime( "2024-01-$i" );
			$activity->category = 'content';
			$activity->type     = 'post_published';
			$activity->data_id  = (string) $i;
			$activity->user_id  = 1;
			$this->query->insert_activity( $activity );
		}

		// Query for activities between Jan 15 and Jan 17.
		$results = $this->query->query_activities(
			[
				'start_date' => '2024-01-15',
				'end_date'   => '2024-01-17',
			]
		);

		$this->assertCount( 3, $results );
		foreach ( $results as $result ) {
			$this->assertGreaterThanOrEqual( '2024-01-15', $result->date->format( 'Y-m-d' ) );
			$this->assertLessThanOrEqual( '2024-01-17', $result->date->format( 'Y-m-d' ) );
		}
	}

	/**
	 * Test querying activities by date range with DateTime objects.
	 */
	public function test_query_activities_by_date_range_datetime() {
		// Insert test data.
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$this->query->insert_activity( $activity );

		// Query with DateTime objects.
		$results = $this->query->query_activities(
			[
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-31' ),
			]
		);

		$this->assertCount( 1, $results );
	}

	/**
	 * Test querying activities by category.
	 */
	public function test_query_activities_by_category() {
		// Insert content activity.
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		// Insert maintenance activity.
		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-15' );
		$activity2->category = 'maintenance';
		$activity2->type     = 'plugin_updated';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		// Query for content activities.
		$results = $this->query->query_activities( [ 'category' => 'content' ] );

		$this->assertCount( 1, $results );
		$this->assertEquals( 'content', $results[0]->category );
	}

	/**
	 * Test querying activities by type.
	 */
	public function test_query_activities_by_type() {
		// Insert different types.
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-15' );
		$activity2->category = 'content';
		$activity2->type     = 'post_updated';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		// Query for post_published type.
		$results = $this->query->query_activities( [ 'type' => 'post_published' ] );

		$this->assertCount( 1, $results );
		$this->assertEquals( 'post_published', $results[0]->type );
	}

	/**
	 * Test querying activities by data_id.
	 */
	public function test_query_activities_by_data_id() {
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$this->query->insert_activity( $activity );

		$results = $this->query->query_activities( [ 'data_id' => '123' ] );

		$this->assertCount( 1, $results );
		$this->assertEquals( '123', $results[0]->data_id );
	}

	/**
	 * Test querying activities by user_id.
	 */
	public function test_query_activities_by_user_id() {
		// Insert activities for different users.
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-15' );
		$activity2->category = 'content';
		$activity2->type     = 'post_published';
		$activity2->data_id  = '456';
		$activity2->user_id  = 2;
		$this->query->insert_activity( $activity2 );

		// Query for user 1.
		$results = $this->query->query_activities( [ 'user_id' => 1 ] );

		$this->assertCount( 1, $results );
		$this->assertEquals( 1, $results[0]->user_id );
	}

	/**
	 * Test querying activities with multiple filters.
	 */
	public function test_query_activities_multiple_filters() {
		// Insert test data.
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$this->query->insert_activity( $activity );

		// Insert another that should not match.
		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-15' );
		$activity2->category = 'maintenance';
		$activity2->type     = 'plugin_updated';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		$results = $this->query->query_activities(
			[
				'category'   => 'content',
				'type'       => 'post_published',
				'start_date' => '2024-01-01',
				'end_date'   => '2024-01-31',
			]
		);

		$this->assertCount( 1, $results );
		$this->assertEquals( 'content', $results[0]->category );
		$this->assertEquals( 'post_published', $results[0]->type );
	}

	/**
	 * Test updating an activity.
	 */
	public function test_update_activity() {
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$id                 = $this->query->insert_activity( $activity );

		// Update the activity.
		$updated_activity           = new Activity();
		$updated_activity->date     = new \DateTime( '2024-01-16' );
		$updated_activity->category = 'maintenance';
		$updated_activity->type     = 'plugin_updated';
		$updated_activity->data_id  = '456';
		$updated_activity->user_id  = 2;
		$this->query->update_activity( $id, $updated_activity );

		// Query and verify.
		$results = $this->query->query_activities( [ 'id' => $id ] );
		$this->assertCount( 1, $results );
		$this->assertEquals( 'maintenance', $results[0]->category );
		$this->assertEquals( 'plugin_updated', $results[0]->type );
		$this->assertEquals( '456', $results[0]->data_id );
		$this->assertEquals( 2, $results[0]->user_id );
	}

	/**
	 * Test deleting an activity.
	 */
	public function test_delete_activity() {
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$id                 = $this->query->insert_activity( $activity );

		// Verify it exists.
		$results = $this->query->query_activities( [ 'id' => $id ] );
		$this->assertCount( 1, $results );

		// Delete it.
		$activity->id = $id;
		$this->query->delete_activity( $activity );

		// Verify it's gone.
		$results = $this->query->query_activities( [ 'id' => $id ] );
		$this->assertCount( 0, $results );
	}

	/**
	 * Test deleting an activity by ID.
	 */
	public function test_delete_activity_by_id() {
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$id                 = $this->query->insert_activity( $activity );

		$this->query->delete_activity_by_id( $id );

		$results = $this->query->query_activities( [ 'id' => $id ] );
		$this->assertCount( 0, $results );
	}

	/**
	 * Test deleting multiple activities.
	 */
	public function test_delete_activities() {
		$activities = [];
		$ids        = [];
		for ( $i = 0; $i < 3; $i++ ) {
			$activity           = new Activity();
			$activity->date     = new \DateTime( '2024-01-15' );
			$activity->category = 'content';
			$activity->type     = 'post_published';
			$activity->data_id  = (string) ( 100 + $i );
			$activity->user_id  = 1;
			$id                 = $this->query->insert_activity( $activity );
			$activity->id       = $id;
			$activities[]       = $activity;
			$ids[]              = $id;
		}

		// Verify they exist.
		$all_results = $this->query->query_activities( [] );
		$this->assertCount( 3, $all_results );

		// Delete them.
		$this->query->delete_activities( $activities );

		// Verify they're gone.
		$results = $this->query->query_activities( [] );
		$this->assertCount( 0, $results );
	}

	/**
	 * Test deleting activities by category.
	 */
	public function test_delete_category_activities() {
		// Insert content activities.
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		// Insert maintenance activity.
		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-15' );
		$activity2->category = 'maintenance';
		$activity2->type     = 'plugin_updated';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		// Delete content category.
		$this->query->delete_category_activities( 'content' );

		// Verify only maintenance remains.
		$results = $this->query->query_activities( [] );
		$this->assertCount( 1, $results );
		$this->assertEquals( 'maintenance', $results[0]->category );
	}

	/**
	 * Test getting latest activities.
	 */
	public function test_get_latest_activities() {
		// Insert activities with different dates.
		for ( $i = 1; $i <= 10; $i++ ) {
			$activity           = new Activity();
			$activity->date     = new \DateTime( "2024-01-$i" );
			$activity->category = 'content';
			$activity->type     = 'post_published';
			$activity->data_id  = (string) $i;
			$activity->user_id  = 1;
			$this->query->insert_activity( $activity );
		}

		// Get latest 5.
		$results = $this->query->get_latest_activities( 5 );

		$this->assertCount( 5, $results );
		// Should be in descending order (latest first).
		$this->assertEquals( '2024-01-10', $results[0]->date->format( 'Y-m-d' ) );
		$this->assertEquals( '2024-01-06', $results[4]->date->format( 'Y-m-d' ) );
	}

	/**
	 * Test getting latest activities when there are none.
	 */
	public function test_get_latest_activities_empty() {
		$results = $this->query->get_latest_activities( 5 );
		$this->assertNull( $results );
	}

	/**
	 * Test getting oldest activity.
	 */
	public function test_get_oldest_activity() {
		// Insert activities.
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-10' );
		$activity2->category = 'content';
		$activity2->type     = 'post_published';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		$oldest = $this->query->get_oldest_activity();

		$this->assertInstanceOf( Activity::class, $oldest );
		$this->assertEquals( '2024-01-10', $oldest->date->format( 'Y-m-d' ) );
		$this->assertEquals( '456', $oldest->data_id );
	}

	/**
	 * Test getting oldest activity when there are none.
	 */
	public function test_get_oldest_activity_empty() {
		$oldest = $this->query->get_oldest_activity();
		$this->assertNull( $oldest );
	}

	/**
	 * Test caching of query results.
	 */
	public function test_query_caching() {
		$activity           = new Activity();
		$activity->date     = new \DateTime( '2024-01-15' );
		$activity->category = 'content';
		$activity->type     = 'post_published';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$this->query->insert_activity( $activity );

		// First query (not cached).
		$results1 = $this->query->query_activities( [ 'category' => 'content' ] );

		// Second query (should be cached).
		$results2 = $this->query->query_activities( [ 'category' => 'content' ] );

		$this->assertEquals( $results1, $results2 );
	}

	/**
	 * Test cache is flushed on insert.
	 */
	public function test_cache_flush_on_insert() {
		$activity1           = new Activity();
		$activity1->date     = new \DateTime( '2024-01-15' );
		$activity1->category = 'content';
		$activity1->type     = 'post_published';
		$activity1->data_id  = '123';
		$activity1->user_id  = 1;
		$this->query->insert_activity( $activity1 );

		// Query to populate cache.
		$results1 = $this->query->query_activities( [] );
		$this->assertCount( 1, $results1 );

		// Insert another activity.
		$activity2           = new Activity();
		$activity2->date     = new \DateTime( '2024-01-16' );
		$activity2->category = 'content';
		$activity2->type     = 'post_published';
		$activity2->data_id  = '456';
		$activity2->user_id  = 1;
		$this->query->insert_activity( $activity2 );

		// Query again - should see the new activity.
		$results2 = $this->query->query_activities( [] );
		$this->assertCount( 2, $results2 );
	}

	/**
	 * Test duplicate removal logic.
	 */
	public function test_duplicate_removal() {
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;

		// Manually insert a duplicate entry directly into the database.
		$wpdb->insert(
			$table_name,
			[
				'date'     => '2024-01-15',
				'category' => 'content',
				'type'     => 'post_published',
				'data_id'  => '123',
				'user_id'  => 1,
			]
		);
		$id1 = $wpdb->insert_id;

		$wpdb->insert(
			$table_name,
			[
				'date'     => '2024-01-15',
				'category' => 'content',
				'type'     => 'post_published',
				'data_id'  => '123',
				'user_id'  => 1,
			]
		);
		$id2 = $wpdb->insert_id;

		// Clear cache to force a fresh query.
		wp_cache_flush_group( Query::CACHE_GROUP );

		// Query should remove the duplicate.
		$results = $this->query->query_activities( [] );

		// Should only have 1 result (duplicate removed).
		$this->assertCount( 1, $results );

		// Verify one of the IDs was deleted.
		$remaining_results = $wpdb->get_results( "SELECT * FROM $table_name" );
		$this->assertCount( 1, $remaining_results );
	}
}
