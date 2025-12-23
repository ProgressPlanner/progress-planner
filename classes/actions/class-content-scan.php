<?php
/**
 * Content scan class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Actions;

use Progress_Planner\Actions\Content;

/**
 * Content scan class.
 */
class Content_Scan extends Content {

	/**
	 * The option used to store the last scanned page.
	 *
	 * @var string
	 */
	const LAST_SCANNED_PAGE_OPTION = 'content_last_scanned_page';

	/**
	 * The number of posts to scan at a time.
	 *
	 * @var int
	 */
	const SCAN_POSTS_PER_PAGE = 30;

	/**
	 * Register hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Add hooks to handle scanning existing posts.
		\add_action( 'shutdown', [ $this, 'update_stats' ] );
	}

	/**
	 * Update stats for posts.
	 * - Gets the next page to scan.
	 * - Gets the posts for the page.
	 * - Updates the stats for the posts.
	 * - Updates the last scanned page option.
	 *
	 * @return void
	 */
	public function update_stats() {
		// Calculate the total pages to scan.
		$total_pages = $this->get_total_pages();
		// Get the last scanned page.
		$last_page = (int) \progress_planner()->get_settings()->get( static::LAST_SCANNED_PAGE_OPTION, 0 );
		// The current page to scan.
		$current_page = $last_page + 1;

		if ( $current_page > $total_pages ) {
			return;
		}

		// Get posts.
		$posts = \get_posts(
			[
				'posts_per_page' => static::SCAN_POSTS_PER_PAGE,
				'paged'          => $current_page,
				'post_type'      => \progress_planner()->get_activities__content_helpers()->get_post_types_names(),
				'post_status'    => 'publish',
			]
		);

		if ( ! $posts ) {
			\progress_planner()->get_settings()->delete( static::LAST_SCANNED_PAGE_OPTION );
			\progress_planner()->get_settings()->set( 'content_scanned', true );
			return;
		}

		// Insert the activities for posts in the db.
		$this->insert_activities( $posts );

		// Update the last scanned page.
		\progress_planner()->get_settings()->set( static::LAST_SCANNED_PAGE_OPTION, $current_page );
	}

	/**
	 * Get the number of total pages.
	 *
	 * @return int
	 */
	public function get_total_pages() {
		// Get the total number of posts.
		$total_posts_count = 0;
		foreach ( \progress_planner()->get_activities__content_helpers()->get_post_types_names() as $post_type ) {
			$total_posts_count += \wp_count_posts( $post_type )->publish;
		}
		// Calculate the total pages to scan.
		return (int) \ceil( $total_posts_count / static::SCAN_POSTS_PER_PAGE );
	}

	/**
	 * Insert the activities for posts in the db.
	 *
	 * @param \WP_Post[] $posts The posts to insert the activities for.
	 *
	 * @return void
	 */
	public function insert_activities( $posts ) {
		$activities = [];
		// Loop through the posts and update the stats.
		foreach ( $posts as $post ) {
			// Set the activity, we're dealing only with published posts (but just in case).
			$activities[ $post->ID ] = \progress_planner()->get_activities__content_helpers()->get_activity_from_post( $post, 'publish' === $post->post_status ? 'publish' : 'update' );
		}

		\progress_planner()->get_activities__query()->insert_activities( $activities );
	}
}
