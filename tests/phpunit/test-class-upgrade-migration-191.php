<?php
/**
 * Test upgrade migrations for version 1.9.1.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

/**
 * Test upgrade migrations for version 1.9.1.
 */
class Upgrade_Migrations_191_Test extends \WP_UnitTestCase {

	/**
	 * Create a recommendation and force a raw (unsanitized) title directly in the
	 * database, bypassing wp_insert_post()'s kses sanitization.
	 *
	 * This simulates a row stored before the write-time sanitization existed.
	 *
	 * @param string $raw_title The raw title to store verbatim.
	 * @return int The created post ID.
	 */
	private function create_recommendation_with_raw_title( $raw_title ) {
		global $wpdb;

		// Insert the post via WP core, then write the malicious title straight into
		// the DB so neither wp_insert_post()'s kses sanitization nor the plugin's
		// in-request object cache (Suggested_Tasks_DB::format_recommendation())
		// observes the placeholder - this mirrors a legacy row loaded fresh by the
		// migration in its own request.
		//
		// Content and excerpt are left empty (as they are for programmatic/CLI
		// recommendation inserts) so the empty-content guard is exercised when a
		// pure-markup title strips to an empty string.
		$post_id = self::factory()->post->create(
			[
				'post_type'    => 'prpl_recommendations',
				'post_title'   => 'placeholder',
				'post_content' => '',
				'post_excerpt' => '',
				'post_status'  => 'publish',
			]
		);

		$wpdb->update( $wpdb->posts, [ 'post_title' => $raw_title ], [ 'ID' => $post_id ] ); // phpcs:ignore WordPress.DB
		\clean_post_cache( $post_id );

		return $post_id;
	}

	/**
	 * Test that HTML tags are stripped from existing recommendation titles.
	 *
	 * @return void
	 */
	public function test_migration_strips_tags_from_titles() {
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		$task_id = $this->create_recommendation_with_raw_title( '<img src=x onerror=alert(1)>Hello' );

		// Sanity check: the malicious markup is stored before the migration.
		$this->assertStringContainsString( '<img', \get_post( $task_id )->post_title );

		( new \Progress_Planner\Update\Update_191() )->run();

		$title = \get_post( $task_id )->post_title;
		$this->assertStringNotContainsString( '<img', $title );
		$this->assertStringNotContainsString( 'onerror', $title );
		$this->assertStringContainsString( 'Hello', $title );
	}

	/**
	 * Test that a recommendation whose title is *pure* markup is deleted, even
	 * when post_content and post_excerpt are empty.
	 *
	 * Stripping leaves an empty title. The plugin never stores title-less
	 * recommendations, so the row is junk and is removed. (Updating it in place
	 * would hit WordPress's empty-content guard and leave the markup behind.)
	 *
	 * @return void
	 */
	public function test_migration_deletes_pure_markup_title_with_empty_content() {
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		$task_id = $this->create_recommendation_with_raw_title( '<img src=x onerror=alert(1)>' );

		( new \Progress_Planner\Update\Update_191() )->run();

		$this->assertNull( \get_post( $task_id ), 'Pure-markup recommendation should be deleted.' );
	}

	/**
	 * Test that a <script> payload is stripped from an existing title.
	 *
	 * @return void
	 */
	public function test_migration_strips_script_from_titles() {
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		$task_id = $this->create_recommendation_with_raw_title( '<script>alert(document.cookie)</script>Title' );

		( new \Progress_Planner\Update\Update_191() )->run();

		$title = \get_post( $task_id )->post_title;
		$this->assertStringNotContainsString( '<script', $title );
		$this->assertStringContainsString( 'Title', $title );
	}

	/**
	 * Test that a legitimate plain-text title is left unchanged.
	 *
	 * @return void
	 */
	public function test_migration_preserves_plain_text_titles() {
		\progress_planner()->get_suggested_tasks_db()->delete_all_recommendations();

		$task_id = $this->create_recommendation_with_raw_title( 'Buy milk & eggs' );

		$modified_before = \get_post( $task_id )->post_modified;

		( new \Progress_Planner\Update\Update_191() )->run();

		$post = \get_post( $task_id );
		$this->assertSame( 'Buy milk & eggs', $post->post_title );
		// A title that needs no change must not be re-saved.
		$this->assertSame( $modified_before, $post->post_modified, 'Clean title should not be modified.' );
	}
}
