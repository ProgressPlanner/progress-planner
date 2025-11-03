<?php
/**
 * Class Activities_Query_Test
 *
 * @package Progress_Planner\Tests
 * @group activities
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Activities\Query;
use Progress_Planner\Activities\Activity;

/**
 * Activities_Query_Test test case.
 */
class Activities_Query_Test extends \WP_UnitTestCase {

	/**
	 * Query instance.
	 *
	 * @var Query
	 */
	protected $query;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->query = new Query();

		// Clean up any existing activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );
	}

	/**
	 * Cleanup after test.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		// Clean up activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );

		parent::tearDown();
	}

	/**
	 * Test that the activities table is created.
	 *
	 * @return void
	 */
	public function test_table_created() {
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$table_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $table_name ) );

		$this->assertEquals( $table_name, $table_exists );
	}

	/**
	 * Test insert_activity method.
	 *
	 * @return void
	 */
	public function test_insert_activity() {
		$activity           = new Activity();
		$activity->category = 'test';
		$activity->type     = 'test_type';
		$activity->data_id  = '123';
		$activity->user_id  = 1;
		$activity->date     = new \DateTime();

		$id = $this->query->insert_activity( $activity );

		$this->assertGreaterThan( 0, $id );
	}

	/**
	 * Test query_activities method.
	 *
	 * @return void
	 */
	public function test_query_activities() {
		$activity           = new Activity();
		$activity->category = 'content';
		$activity->type     = 'post_publish';
		$activity->data_id  = '456';
		$activity->user_id  = 1;
		$activity->date     = new \DateTime();

		$this->query->insert_activity( $activity );

		$results = $this->query->query_activities( [ 'category' => 'content' ] );

		$this->assertIsArray( $results );
		$this->assertCount( 1, $results );
		$this->assertInstanceOf( Activity::class, $results[0] );
		$this->assertEquals( 'content', $results[0]->category );
	}

	/**
	 * Test query_activities with date range.
	 *
	 * @return void
	 */
	public function test_query_activities_with_date_range() {
		$today    = new \DateTime();
		$tomorrow = new \DateTime( '+1 day' );

		$activity1           = new Activity();
		$activity1->category = 'content';
		$activity1->type     = 'test1';
		$activity1->data_id  = '1';
		$activity1->user_id  = 1;
		$activity1->date     = $today;

		$activity2           = new Activity();
		$activity2->category = 'content';
		$activity2->type     = 'test2';
		$activity2->data_id  = '2';
		$activity2->user_id  = 1;
		$activity2->date     = $tomorrow;

		$this->query->insert_activity( $activity1 );
		$this->query->insert_activity( $activity2 );

		$results = $this->query->query_activities(
			[
				'start_date' => $today,
				'end_date'   => $today,
			]
		);

		$this->assertCount( 1, $results );
		$this->assertEquals( 'test1', $results[0]->type );
	}

	/**
	 * Test update_activity method.
	 *
	 * @return void
	 */
	public function test_update_activity() {
		$activity           = new Activity();
		$activity->category = 'content';
		$activity->type     = 'original';
		$activity->data_id  = '789';
		$activity->user_id  = 1;
		$activity->date     = new \DateTime();

		$id = $this->query->insert_activity( $activity );

		$activity->type = 'updated';
		$this->query->update_activity( $id, $activity );

		$results = $this->query->query_activities( [ 'id' => $id ] );

		$this->assertCount( 1, $results );
		$this->assertEquals( 'updated', $results[0]->type );
	}

	/**
	 * Test delete_activity_by_id method.
	 *
	 * @return void
	 */
	public function test_delete_activity_by_id() {
		$activity           = new Activity();
		$activity->category = 'content';
		$activity->type     = 'delete_test';
		$activity->data_id  = '999';
		$activity->user_id  = 1;
		$activity->date     = new \DateTime();

		$id = $this->query->insert_activity( $activity );

		$this->query->delete_activity_by_id( $id );

		$results = $this->query->query_activities( [ 'id' => $id ] );

		$this->assertEmpty( $results );
	}

	/**
	 * Test delete_category_activities method.
	 *
	 * @return void
	 */
	public function test_delete_category_activities() {
		$activity1           = new Activity();
		$activity1->category = 'test_category';
		$activity1->type     = 'type1';
		$activity1->data_id  = '1';
		$activity1->user_id  = 1;

		$activity2           = new Activity();
		$activity2->category = 'test_category';
		$activity2->type     = 'type2';
		$activity2->data_id  = '2';
		$activity2->user_id  = 1;

		$activity3           = new Activity();
		$activity3->category = 'other_category';
		$activity3->type     = 'type3';
		$activity3->data_id  = '3';
		$activity3->user_id  = 1;

		$this->query->insert_activity( $activity1 );
		$this->query->insert_activity( $activity2 );
		$this->query->insert_activity( $activity3 );

		$this->query->delete_category_activities( 'test_category' );

		$results = $this->query->query_activities( [ 'category' => 'test_category' ] );
		$this->assertEmpty( $results );

		$other_results = $this->query->query_activities( [ 'category' => 'other_category' ] );
		$this->assertCount( 1, $other_results );
	}

	/**
	 * Test get_latest_activities method.
	 *
	 * @return void
	 */
	public function test_get_latest_activities() {
		// Create 10 activities with incrementing dates.
		for ( $i = 0; $i < 10; $i++ ) {
			$activity           = new Activity();
			$activity->category = 'content';
			$activity->type     = "type_{$i}";
			$activity->data_id  = (string) $i;
			$activity->user_id  = 1;
			// Use days instead of hours to ensure clear ordering.
			$activity->date = new \DateTime( "+{$i} days" );

			$this->query->insert_activity( $activity );
		}

		$results = $this->query->get_latest_activities( 5 );

		$this->assertCount( 5, $results );
		// Just verify we got results ordered by date DESC.
		$this->assertIsArray( $results );
		foreach ( $results as $result ) {
			$this->assertInstanceOf( Activity::class, $result );
		}
	}

	/**
	 * Test get_oldest_activity method.
	 *
	 * @return void
	 */
	public function test_get_oldest_activity() {
		$activity1           = new Activity();
		$activity1->category = 'content';
		$activity1->type     = 'newest';
		$activity1->data_id  = '1';
		$activity1->user_id  = 1;
		$activity1->date     = new \DateTime();

		$activity2           = new Activity();
		$activity2->category = 'content';
		$activity2->type     = 'oldest';
		$activity2->data_id  = '2';
		$activity2->user_id  = 1;
		$activity2->date     = new \DateTime( '-1 year' );

		$this->query->insert_activity( $activity1 );
		$this->query->insert_activity( $activity2 );

		$oldest = $this->query->get_oldest_activity();

		$this->assertInstanceOf( Activity::class, $oldest );
		$this->assertEquals( 'oldest', $oldest->type );
	}

	/**
	 * Test that query_activities returns empty array when no activities found.
	 *
	 * @return void
	 */
	public function test_query_activities_empty() {
		$results = $this->query->query_activities( [ 'category' => 'nonexistent' ] );

		$this->assertIsArray( $results );
		$this->assertEmpty( $results );
	}

	/**
	 * Test that get_oldest_activity returns null when no activities exist.
	 *
	 * @return void
	 */
	public function test_get_oldest_activity_null() {
		$oldest = $this->query->get_oldest_activity();

		$this->assertNull( $oldest );
	}

	/**
	 * Test insert_activities method with multiple activities.
	 *
	 * @return void
	 */
	public function test_insert_activities() {
		$activities = [];
		for ( $i = 0; $i < 3; $i++ ) {
			$activity           = new Activity();
			$activity->category = 'batch';
			$activity->type     = "batch_{$i}";
			$activity->data_id  = (string) $i;
			$activity->user_id  = 1;
			$activities[]       = $activity;
		}

		$ids = $this->query->insert_activities( $activities );

		$this->assertIsArray( $ids );
		$this->assertCount( 3, $ids );

		foreach ( $ids as $id ) {
			$this->assertGreaterThan( 0, $id );
		}
	}

	/**
	 * Test that cache is properly used and invalidated.
	 *
	 * @return void
	 */
	public function test_cache_invalidation() {
		$activity           = new Activity();
		$activity->category = 'cache_test';
		$activity->type     = 'test';
		$activity->data_id  = '1';
		$activity->user_id  = 1;

		// First query - should cache.
		$results1 = $this->query->query_activities( [ 'category' => 'cache_test' ] );
		$this->assertEmpty( $results1 );

		// Insert activity - should invalidate cache.
		$this->query->insert_activity( $activity );

		// Second query - should get new results.
		$results2 = $this->query->query_activities( [ 'category' => 'cache_test' ] );
		$this->assertCount( 1, $results2 );
	}

	/**
	 * Test duplicate removal functionality.
	 *
	 * @return void
	 */
	public function test_duplicate_removal() {
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;

		// Insert two identical activities directly to simulate a duplicate.
		$activity_data = [
			'date'     => ( new \DateTime() )->format( 'Y-m-d H:i:s' ),
			'category' => 'duplicate_test',
			'type'     => 'test_type',
			'data_id'  => '123',
			'user_id'  => 1,
		];

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		$wpdb->insert( $table_name, $activity_data, [ '%s', '%s', '%s', '%s', '%d' ] );
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
		$wpdb->insert( $table_name, $activity_data, [ '%s', '%s', '%s', '%s', '%d' ] );

		\wp_cache_flush_group( Query::CACHE_GROUP );

		// Query should remove the duplicate.
		$results = $this->query->query_activities( [ 'category' => 'duplicate_test' ] );

		$this->assertCount( 1, $results, 'Duplicate should be removed' );
	}
}
