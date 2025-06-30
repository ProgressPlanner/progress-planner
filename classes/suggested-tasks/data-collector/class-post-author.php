<?php
/**
 * Post author data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Post author data collector class.
 */
class Post_Author extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'post_author_count';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'post_updated', [ $this, 'update_post_author_on_change' ], 10, 3 );
		\add_action( 'transition_post_status', [ $this, 'update_post_author_cache' ], 10, 3 );
	}

	/**
	 * Update the cache when the post author changes.
	 *
	 * @param int      $post_id The post ID.
	 * @param \WP_Post $post_after The post object following the update.
	 * @param \WP_Post $post_before The post object before the update.
	 *
	 * @return void
	 */
	public function update_post_author_on_change( $post_id, $post_after, $post_before ) {
		if ( $post_after->post_author !== $post_before->post_author ) {
			$this->update_cache();
		}
	}

	/**
	 * Update the cache when post status changes.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post The post.
	 *
	 * @return void
	 */
	public function update_post_author_cache( $new_status, $old_status, $post ) {
		if ( $new_status === 'publish' || $old_status === 'publish' ) {
			$this->update_cache();
		}
	}

	/**
	 * Calculate the unique author count.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		global $wpdb;

		$author_ids = $wpdb->get_col( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			"
			SELECT DISTINCT post_author
			FROM {$wpdb->posts}
			WHERE post_status = 'publish'
			AND post_type = 'post'
		"
		);

		return \count( $author_ids );
	}
}
