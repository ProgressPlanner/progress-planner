<?php
/**
 * Terms without description data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Terms without posts data collector class.
 */
class Unpublished_Content extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'unpublished_content';

	/**
	 * The minimum number of posts.
	 *
	 * @var int
	 */
	protected const POSTS_TO_COLLECT = 1;

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'delete_post', [ $this, 'update_unpublished_content_cache' ], 10 );

		// We need to update the cache when a post status changes.
		\add_action( 'transition_post_status', [ $this, 'on_post_status_changed' ], 10, 3 );
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
	public function on_post_status_changed( $new_status, $old_status, $post ) {
		// If the status is the same or we don't include the post type, do nothing.
		if ( $old_status === $new_status || ! \in_array( \get_post_type( $post ), \progress_planner()->get_settings()->get_post_types_names(), true ) ) {
			return;
		}

		if ( $new_status === 'publish' ) {
			$this->update_cache();
		}
	}

	/**
	 * Update the cache when term is edited or deleted.
	 *
	 * @return void
	 */
	public function update_unpublished_content_cache() {
		$this->update_cache();
	}

	/**
	 * Query the terms without posts.
	 *
	 * @return array|null
	 */
	protected function calculate_data() {
		$args = [
			'post_type'      => \progress_planner()->get_settings()->get_post_types_names(),
			'posts_per_page' => static::POSTS_TO_COLLECT,
			'post_status'    => [ 'draft', 'auto-draft' ],
			'orderby'        => 'modified',
			'order'          => 'ASC',
			'fields'         => 'ids',
			'date_query'     => [
				[
					'column' => 'post_modified',
					'before' => '-1 week',
				],
			],
		];

		/**
		 * Filter the post IDs to exclude from the query.
		 *
		 * @param array $post__not_in The post IDs to exclude.
		 *
		 * @return array
		 */
		$post__not_in = \apply_filters( 'progress_planner_unpublished_content_exclude_post_ids', [] );

		if ( ! empty( $post__not_in ) ) {
			$args['post__not_in'] = $post__not_in;
		}

		$posts = \get_posts( $args );

		return $posts ? [ 'post_id' => $posts[0] ] : null;
	}
}
