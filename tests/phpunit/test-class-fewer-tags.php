<?php
/**
 * Unit tests for Fewer_Tags_Provider_Test class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Providers\Fewer_Tags;
use WP_UnitTestCase;
use WP_Filesystem_Base;

/**
 * Class Fewer_Tags_Provider_Test.
 */
class Fewer_Tags_Provider_Test extends \WP_UnitTestCase {

	/**
	 * The task provider instance.
	 *
	 * @var Fewer_Tags
	 */
	private $task_provider;

	/**
	 * Original active plugins.
	 *
	 * @var array
	 */
	private $original_active_plugins;

	/**
	 * Filesystem instance.
	 *
	 * @var WP_Filesystem_Base
	 */
	private $filesystem;

	/**
	 * Set up the test.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->original_active_plugins = get_option( 'active_plugins', [] );

		// Initialize filesystem.
		global $wp_filesystem;
		if ( ! $wp_filesystem ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
			WP_Filesystem();
		}
		$this->filesystem = $wp_filesystem;
	}

	/**
	 * Tear down the test.
	 */
	public function tearDown(): void {
		update_option( 'active_plugins', $this->original_active_plugins );
		parent::tearDown();
	}

	/**
	 * Test that task is added when plugin is inactive and tags outnumber posts.
	 */
	public function test_should_add_task_when_plugin_inactive_and_tags_outnumber_posts() {
		// Create more tags than posts.
		$tag1 = wp_insert_term( 'Tag 1', 'post_tag' );
		$this->assertNotWPError( $tag1 );
		$tag2 = wp_insert_term( 'Tag 2', 'post_tag' );
		$this->assertNotWPError( $tag2 );

		// Create a new Fewer_Tags instance here so it's internal cache is populated with the correct data.
		$this->task_provider = new Fewer_Tags();

		$this->assertTrue( $this->task_provider->should_add_task() );

		// Clean up.
		wp_delete_term( $tag1['term_id'], 'post_tag' );
		wp_delete_term( $tag2['term_id'], 'post_tag' );
	}

	/**
	 * Test that task is not added when plugin is inactive but tags don't outnumber posts.
	 */
	public function test_should_add_task_when_plugin_inactive_but_tags_dont_outnumber_posts() {
		// Create one tag.
		$tag = wp_insert_term( 'Tag 1', 'post_tag' );
		$this->assertNotWPError( $tag );

		// Create two published posts.
		$post1 = wp_insert_post(
			[
				'post_title'  => 'Test Post 1',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->assertNotWPError( $post1 );

		$post2 = wp_insert_post(
			[
				'post_title'  => 'Test Post 2',
				'post_status' => 'publish',
				'post_type'   => 'post',
			]
		);
		$this->assertNotWPError( $post2 );

		// Create a new Fewer_Tags instance here so it's internal cache is populated with the correct data.
		$this->task_provider = new Fewer_Tags();

		$this->assertFalse( $this->task_provider->should_add_task() );

		// Clean up.
		wp_delete_post( $post1 );
		wp_delete_post( $post2 );
		wp_delete_term( $tag['term_id'], 'post_tag' );
	}

	/**
	 * Test that task is completed when plugin is active.
	 */
	public function test_is_task_completed_when_plugin_active() {
		// Mock the plugin file to exist.
		$plugin_dir  = WP_PLUGIN_DIR . '/fewer-tags';
		$dir_created = false;
		if ( ! $this->filesystem->exists( $plugin_dir ) ) {
			$this->filesystem->mkdir( $plugin_dir, 0755 );
			$dir_created = true;
		}
		$this->filesystem->put_contents( $plugin_dir . '/fewer-tags.php', '<?php /* Plugin Name: Fewer Tags */' );

		// Mock plugin as active in options.
		update_option( 'active_plugins', [ 'fewer-tags/fewer-tags.php' ] );

		// Create a new Fewer_Tags instance here so it's internal cache is populated with the correct data.
		$this->task_provider = new Fewer_Tags();

		$this->assertTrue( $this->task_provider->is_task_completed() );

		// Clean up.
		$this->filesystem->delete( $plugin_dir . '/fewer-tags.php' );
		if ( $dir_created ) {
			$this->filesystem->rmdir( $plugin_dir );
		}
	}

	/**
	 * Test that task is not completed when plugin is inactive.
	 */
	public function test_is_task_completed_when_plugin_inactive() {
		// Create a new Fewer_Tags instance here so it's internal cache is populated with the correct data.
		$this->task_provider = new Fewer_Tags();

		$this->assertFalse( $this->task_provider->is_task_completed() );
	}
}
