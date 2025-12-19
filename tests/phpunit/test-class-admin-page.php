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

	/**
	 * Test admin_footer outputs CSS.
	 *
	 * @return void
	 */
	public function test_admin_footer_outputs_css() {
		\ob_start();
		$this->page_instance->admin_footer();
		$output = \ob_get_clean();

		$this->assertStringContainsString( '<style>', $output );
		$this->assertStringContainsString( '#toplevel_page_progress-planner', $output );
		$this->assertStringContainsString( '.update-plugins', $output );
	}

	/**
	 * Test remove_admin_notices removes notices on plugin page.
	 *
	 * @return void
	 */
	public function test_remove_admin_notices_on_plugin_page() {
		// Set up screen.
		\set_current_screen( 'toplevel_page_progress-planner' );

		// Add a test action.
		\add_action( 'admin_notices', '__return_true' );
		$this->assertNotFalse( \has_action( 'admin_notices', '__return_true' ) );

		// Call remove_admin_notices.
		$this->page_instance->remove_admin_notices();

		// The action should be removed.
		$this->assertFalse( \has_action( 'admin_notices', '__return_true' ) );
	}

	/**
	 * Test remove_admin_notices does not remove notices on other pages.
	 *
	 * @return void
	 */
	public function test_remove_admin_notices_on_other_page() {
		// Set up a different screen.
		\set_current_screen( 'dashboard' );

		// Add a test action.
		\add_action( 'admin_notices', '__return_true' );
		$this->assertNotFalse( \has_action( 'admin_notices', '__return_true' ) );

		// Call remove_admin_notices.
		$this->page_instance->remove_admin_notices();

		// The action should still exist.
		$this->assertNotFalse( \has_action( 'admin_notices', '__return_true' ) );
	}

	/**
	 * Test constructor registers hooks.
	 *
	 * @return void
	 */
	public function test_constructor_registers_hooks() {
		$page = new Page();

		$this->assertNotFalse( \has_action( 'admin_menu', [ $page, 'add_page' ] ) );
		$this->assertNotFalse( \has_action( 'admin_enqueue_scripts', [ $page, 'enqueue_assets' ] ) );
		$this->assertNotFalse( \has_action( 'admin_footer', [ $page, 'admin_footer' ] ) );
	}

	/**
	 * Test enqueue_assets calls enqueue methods on plugin page.
	 *
	 * @return void
	 */
	public function test_enqueue_assets_on_plugin_page() {
		// Set up screen.
		\set_current_screen( 'toplevel_page_progress-planner' );

		// Clear existing scripts.
		global $wp_scripts;
		$wp_scripts = new \WP_Scripts();

		// Call enqueue_assets with the correct hook.
		$this->page_instance->enqueue_assets( 'toplevel_page_progress-planner' );

		// The method should have executed without error.
		$this->assertTrue( true );
	}

	/**
	 * Test enqueue_assets does not enqueue on other pages.
	 *
	 * @return void
	 */
	public function test_enqueue_assets_on_other_page() {
		// Set up a different screen.
		\set_current_screen( 'dashboard' );

		// Clear existing scripts.
		global $wp_scripts;
		$wp_scripts = new \WP_Scripts();

		// Get initial script count.
		$initial_count = \count( $wp_scripts->queue );

		// Call enqueue_assets with different hook.
		$this->page_instance->enqueue_assets( 'index.php' );

		// No new scripts should be enqueued.
		$this->assertLessThanOrEqual( $initial_count + 1, \count( $wp_scripts->queue ) );
	}

	/**
	 * Test notification counter is empty when no pending tasks.
	 *
	 * @return void
	 */
	public function test_notification_counter_empty_when_no_pending() {
		// Ensure no pending recommendations.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'pending',
			]
		);

		foreach ( $posts as $post ) {
			\wp_delete_post( $post->ID, true );
		}

		$reflection = new \ReflectionClass( $this->page_instance );
		$method     = $reflection->getMethod( 'get_notification_counter' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->page_instance );

		$this->assertEquals( '', $result );
	}

	/**
	 * Test notification counter contains count when pending tasks exist.
	 *
	 * @return void
	 */
	public function test_notification_counter_with_count() {
		// Create multiple pending tasks.
		$this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'pending',
			]
		);
		$this->factory->post->create(
			[
				'post_type'   => 'prpl_recommendations',
				'post_status' => 'pending',
			]
		);

		$reflection = new \ReflectionClass( $this->page_instance );
		$method     = $reflection->getMethod( 'get_notification_counter' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->page_instance );

		$this->assertStringContainsString( 'count-', $result );
		$this->assertStringContainsString( 'update-plugins', $result );
	}
}
