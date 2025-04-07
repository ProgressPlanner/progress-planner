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
		\add_action( 'wp_ajax_progress_planner_scan_posts', [ $this, 'ajax_scan' ] );
		\add_action( 'wp_ajax_progress_planner_reset_posts_data', [ $this, 'ajax_reset_posts_data' ] );
	}

	/**
	 * Ajax scan.
	 *
	 * @return void
	 */
	public function ajax_scan() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		// Scan the posts.
		$updated_stats = $this->update_stats();

		\wp_send_json_success(
			[
				'lastScanned' => $updated_stats['lastScannedPage'],
				'lastPage'    => $updated_stats['lastPage'],
				'progress'    => $updated_stats['progress'],
				'messages'    => [
					'scanComplete' => \esc_html__( 'Scan complete.', 'progress-planner' ),
				],
			]
		);
	}

	/**
	 * Ajax reset posts data.
	 *
	 * @return void
	 */
	public function ajax_reset_posts_data() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		// Reset the last scanned page.
		\progress_planner()->get_settings()->set( static::LAST_SCANNED_PAGE_OPTION, 0 );

		// Reset the activities.
		$activities = \progress_planner()->get_activities__query()->query_activities( [ 'category' => 'content' ] );
		\progress_planner()->get_activities__query()->delete_activities( $activities );

		// Reset the word count.
		\progress_planner()->get_settings()->set( 'word_count', [] );

		\wp_send_json_success(
			[
				'messages' => [
					'resetComplete' => \esc_html__( 'Reset complete.', 'progress-planner' ),
				],
			]
		);
	}

	/**
	 * Update stats for posts.
	 * - Gets the next page to scan.
	 * - Gets the posts for the page.
	 * - Updates the stats for the posts.
	 * - Updates the last scanned page option.
	 *
	 * @return array
	 */
	public function update_stats() {
		// Calculate the total pages to scan.
		$total_pages = $this->get_total_pages();
		// Get the last scanned page.
		$last_page = (int) \progress_planner()->get_settings()->get( static::LAST_SCANNED_PAGE_OPTION, 0 );
		// The current page to scan.
		$current_page = $last_page + 1;

		// Get posts.
		$posts = \get_posts(
			[
				'posts_per_page' => static::SCAN_POSTS_PER_PAGE,
				'paged'          => $current_page,
				'post_type'      => [ 'post', 'page' ],
				'post_status'    => 'publish',
			]
		);

		if ( ! $posts ) {
			\progress_planner()->get_settings()->delete( static::LAST_SCANNED_PAGE_OPTION );
			\progress_planner()->get_settings()->set( 'content_scanned', true );
			return [
				'lastScannedPage' => $current_page,
				'lastPage'        => $total_pages,
				'progress'        => 100,
			];
		}

		// Insert the activities and the word-count for posts in the db.
		$this->insert_activities( $posts );

		// Update the last scanned page.
		\progress_planner()->get_settings()->set( static::LAST_SCANNED_PAGE_OPTION, $current_page );

		return [
			'lastScannedPage' => $current_page,
			'lastPage'        => $total_pages,
			'progress'        => round( ( $current_page / max( 1, $total_pages ) ) * 100 ),
		];
	}

	/**
	 * Get the number of total pages.
	 *
	 * @return int
	 */
	public function get_total_pages() {
		// Get the total number of posts.
		$total_posts_count = 0;
		foreach ( [ 'post', 'page' ] as $post_type ) {
			$total_posts_count += \wp_count_posts( $post_type )->publish;
		}
		// Calculate the total pages to scan.
		return (int) \ceil( $total_posts_count / static::SCAN_POSTS_PER_PAGE );
	}

	/**
	 * Insert the activities and the word-count for posts in the db.
	 *
	 * @param \WP_Post[] $posts The posts to set the word count for.
	 *
	 * @return void
	 */
	public function insert_activities( $posts ) {
		$activities = [];
		// Loop through the posts and update the stats.
		foreach ( $posts as $post ) {
			// Set the activity.
			$activities[ $post->ID ] = \progress_planner()->get_activities__content()->get_activity_from_post( $post );
		}

		\progress_planner()->get_activities__query()->insert_activities( $activities );
	}
}
