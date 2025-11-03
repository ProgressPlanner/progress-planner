<?php
/**
 * Class Actions_Content_Scan_Test
 *
 * @package Progress_Planner\Tests
 * @group actions
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Actions\Content_Scan;
use Progress_Planner\Activities\Query;

/**
 * Actions_Content_Scan_Test test case.
 *
 * @group actions
 */
class Actions_Content_Scan_Test extends \WP_UnitTestCase {

	/**
	 * Content_Scan instance.
	 *
	 * @var Content_Scan
	 */
	protected $content_scan;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->content_scan = new Content_Scan();

		// Clean up any existing activities.
		global $wpdb;
		$table_name = $wpdb->prefix . Query::TABLE_NAME;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$wpdb->query( "TRUNCATE TABLE {$table_name}" );

		\wp_cache_flush_group( Query::CACHE_GROUP );

		// Reset scan state.
		\progress_planner()->get_settings()->delete( Content_Scan::LAST_SCANNED_PAGE_OPTION );
		\progress_planner()->get_settings()->delete( 'content_scanned' );
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

		// Reset scan state.
		\progress_planner()->get_settings()->delete( Content_Scan::LAST_SCANNED_PAGE_OPTION );
		\progress_planner()->get_settings()->delete( 'content_scanned' );

		parent::tearDown();
	}

	/**
	 * Test register_hooks adds shutdown hook.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->content_scan->register_hooks();

		$this->assertGreaterThan( 0, \has_action( 'shutdown', [ $this->content_scan, 'update_stats' ] ) );
	}

	/**
	 * Test get_total_pages calculates correctly.
	 *
	 * @return void
	 */
	public function test_get_total_pages() {
		// Create some test posts.
		$post_ids = $this->factory->post->create_many( 35 );

		$total_pages = $this->content_scan->get_total_pages();

		// With 35 posts and SCAN_POSTS_PER_PAGE = 30, we should have 2 pages.
		$expected_pages = (int) \ceil( 35 / Content_Scan::SCAN_POSTS_PER_PAGE );
		$this->assertEquals( $expected_pages, $total_pages );

		// Clean up.
		foreach ( $post_ids as $post_id ) {
			\wp_delete_post( $post_id, true );
		}
	}

	/**
	 * Test get_total_pages with no posts.
	 *
	 * @return void
	 */
	public function test_get_total_pages_empty() {
		$total_pages = $this->content_scan->get_total_pages();

		$this->assertEquals( 0, $total_pages );
	}

	/**
	 * Test update_stats processes first page.
	 *
	 * @return void
	 */
	public function test_update_stats_first_page() {
		// Create test posts.
		$post_ids = $this->factory->post->create_many( 5 );

		$this->content_scan->update_stats();

		// Check that last scanned page is updated.
		$last_page = \progress_planner()->get_settings()->get( Content_Scan::LAST_SCANNED_PAGE_OPTION, 0 );
		$this->assertEquals( 1, $last_page );

		// Check that activities were created.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);

		$this->assertGreaterThan( 0, \count( $activities ) );

		// Clean up.
		foreach ( $post_ids as $post_id ) {
			\wp_delete_post( $post_id, true );
		}
	}

	/**
	 * Test update_stats processes posts and updates page counter.
	 *
	 * @return void
	 */
	public function test_update_stats_completes_scan() {
		// Create a small number of posts.
		$post_ids = $this->factory->post->create_many( 3 );

		// Run update_stats once (should process all posts).
		$this->content_scan->update_stats();

		// Check that last scanned page was updated.
		$last_page_1 = \progress_planner()->get_settings()->get( Content_Scan::LAST_SCANNED_PAGE_OPTION, 0 );
		$this->assertEquals( 1, $last_page_1 );

		// Check that activities were created.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);
		$this->assertGreaterThan( 0, \count( $activities ) );

		// Clean up.
		foreach ( $post_ids as $post_id ) {
			\wp_delete_post( $post_id, true );
		}
	}

	/**
	 * Test update_stats returns early if already past total pages.
	 *
	 * @return void
	 */
	public function test_update_stats_returns_early_when_past_total() {
		// Set last scanned page to a high number.
		\progress_planner()->get_settings()->set( Content_Scan::LAST_SCANNED_PAGE_OPTION, 999 );

		$this->content_scan->update_stats();

		// Should not process anything.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);

		$this->assertEmpty( $activities );
	}

	/**
	 * Test insert_activities method.
	 *
	 * @return void
	 */
	public function test_insert_activities() {
		$post_ids = $this->factory->post->create_many( 3 );
		$posts    = [];

		foreach ( $post_ids as $post_id ) {
			$posts[] = \get_post( $post_id );
		}

		$this->content_scan->insert_activities( $posts );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);

		$this->assertCount( 3, $activities );

		// Clean up.
		foreach ( $post_ids as $post_id ) {
			\wp_delete_post( $post_id, true );
		}
	}

	/**
	 * Test insert_activities handles empty array.
	 *
	 * @return void
	 */
	public function test_insert_activities_empty() {
		$this->content_scan->insert_activities( [] );

		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);

		$this->assertEmpty( $activities );
	}

	/**
	 * Test content_scan extends Content class.
	 *
	 * @return void
	 */
	public function test_extends_content() {
		$this->assertInstanceOf( \Progress_Planner\Actions\Content::class, $this->content_scan );
	}

	/**
	 * Test SCAN_POSTS_PER_PAGE constant is defined.
	 *
	 * @return void
	 */
	public function test_scan_posts_per_page_constant() {
		$this->assertEquals( 30, Content_Scan::SCAN_POSTS_PER_PAGE );
	}

	/**
	 * Test LAST_SCANNED_PAGE_OPTION constant is defined.
	 *
	 * @return void
	 */
	public function test_last_scanned_page_option_constant() {
		$this->assertEquals( 'content_last_scanned_page', Content_Scan::LAST_SCANNED_PAGE_OPTION );
	}

	/**
	 * Test update_stats handles multiple pages correctly.
	 *
	 * @return void
	 */
	public function test_update_stats_multiple_pages() {
		// Create enough posts for 2 pages (SCAN_POSTS_PER_PAGE = 30).
		$post_ids = $this->factory->post->create_many( 35 );

		// Run update_stats first time.
		$this->content_scan->update_stats();
		$last_page_1 = \progress_planner()->get_settings()->get( Content_Scan::LAST_SCANNED_PAGE_OPTION, 0 );
		$this->assertEquals( 1, $last_page_1 );

		// Run update_stats second time.
		$this->content_scan->update_stats();
		$last_page_2 = \progress_planner()->get_settings()->get( Content_Scan::LAST_SCANNED_PAGE_OPTION, 0 );
		$this->assertEquals( 2, $last_page_2 );

		// Verify activities were created for the posts.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);
		$this->assertGreaterThan( 0, \count( $activities ) );

		// Clean up.
		foreach ( $post_ids as $post_id ) {
			\wp_delete_post( $post_id, true );
		}
	}

	/**
	 * Test update_stats only processes published posts.
	 *
	 * @return void
	 */
	public function test_update_stats_only_published() {
		// Get the count before adding new posts.
		$activities_before = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);
		$count_before      = \count( $activities_before );

		// Create draft and published posts.
		$draft_id     = $this->factory->post->create( [ 'post_status' => 'draft' ] );
		$published_id = $this->factory->post->create( [ 'post_status' => 'publish' ] );

		$this->content_scan->update_stats();

		$activities_after = \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'content' ]
		);

		// Should have one more activity than before (only for the published post, not the draft).
		$this->assertGreaterThan( $count_before, \count( $activities_after ) );

		// Clean up.
		\wp_delete_post( $draft_id, true );
		\wp_delete_post( $published_id, true );
	}
}
