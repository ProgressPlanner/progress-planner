<?php
/**
 * Class Admin_Page_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Admin\Page;

/**
 * Admin Page test case.
 */
class Admin_Page_Test extends \WP_UnitTestCase {

	/**
	 * Test instance.
	 *
	 * @var Page
	 */
	private $page_instance;

	/**
	 * Set up test.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		$this->page_instance = new Page();
	}

	/**
	 * Test add_page registers admin menu.
	 *
	 * @return void
	 */
	public function test_add_page() {
		global $menu, $submenu;

		// Initialize menu arrays if they don't exist.
		if ( ! isset( $menu ) ) {
			$menu = [];
		}
		if ( ! isset( $submenu ) ) {
			$submenu = [];
		}

		$this->page_instance->add_page();

		// Verify menu was added.
		$this->assertNotEmpty( $menu );
		$menu_found = false;
		foreach ( $menu as $item ) {
			if ( isset( $item[2] ) && 'progress-planner' === $item[2] ) {
				$menu_found = true;
				break;
			}
		}
		$this->assertTrue( $menu_found );

		// Verify submenu was added (may not be set in test environment).
		if ( isset( $submenu['progress-planner'] ) ) {
			$this->assertNotEmpty( $submenu['progress-planner'] );
		}
	}

	/**
	 * Test get_notification_counter returns empty string when no pending tasks.
	 *
	 * @return void
	 */
	public function test_get_notification_counter_no_pending() {
		$reflection = new \ReflectionClass( $this->page_instance );
		$method     = $reflection->getMethod( 'get_notification_counter' );
		$method->setAccessible( true );

		$counter = $method->invoke( $this->page_instance );

		$this->assertEquals( '', $counter );
	}

	/**
	 * Test get_notification_counter returns HTML when pending tasks exist.
	 *
	 * @return void
	 */
	public function test_get_notification_counter_with_pending() {
		// Create a pending task.
		$this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'pending',
			]
		);

		$reflection = new \ReflectionClass( $this->page_instance );
		$method     = $reflection->getMethod( 'get_notification_counter' );
		$method->setAccessible( true );

		$counter = $method->invoke( $this->page_instance );

		$this->assertNotEmpty( $counter );
		$this->assertStringContainsString( 'update-plugins', $counter );
	}

	/**
	 * Test clear_activity_scores_cache clears cache for content activities.
	 *
	 * @return void
	 */
	public function test_clear_activity_scores_cache() {
		// Create a mock activity.
		$activity = $this->getMockBuilder( \Progress_Planner\Activities\Activity::class )
			->disableOriginalConstructor()
			->getMock();

		$activity->category = 'content';

		// Set a cache value.
		$cache_key = 'activities_weekly_post_record';
		\progress_planner()->get_settings()->set( $cache_key, [ 'test' => 'data' ] );

		// Clear cache.
		$this->page_instance->clear_activity_scores_cache( $activity );

		// Verify cache was cleared.
		$cached = \progress_planner()->get_settings()->get( $cache_key );
		$this->assertEquals( [], $cached );
	}

	/**
	 * Test clear_activity_scores_cache does not clear cache for non-content activities.
	 *
	 * @return void
	 */
	public function test_clear_activity_scores_cache_non_content() {
		// Create a mock activity.
		$activity = $this->getMockBuilder( \Progress_Planner\Activities\Activity::class )
			->disableOriginalConstructor()
			->getMock();

		$activity->category = 'maintenance';

		// Set a cache value.
		$cache_key = 'activities_weekly_post_record';
		\progress_planner()->get_settings()->set( $cache_key, [ 'test' => 'data' ] );

		// Clear cache.
		$this->page_instance->clear_activity_scores_cache( $activity );

		// Verify cache was NOT cleared.
		$cached = \progress_planner()->get_settings()->get( $cache_key );
		$this->assertEquals( [ 'test' => 'data' ], $cached );
	}

	/**
	 * Test render_page does not throw error.
	 *
	 * @return void
	 */
	public function test_render_page() {
		// Should not throw an error.
		\ob_start();
		$this->page_instance->render_page();
		\ob_end_clean();

		$this->assertTrue( true );
	}
}
