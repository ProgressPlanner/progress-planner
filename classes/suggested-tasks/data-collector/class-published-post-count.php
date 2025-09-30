<?php
/**
 * Published post count data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Published post count data collector class.
 */
class Published_Post_Count extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'published_post_count';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'transition_post_status', [ $this, 'maybe_update_published_post_count_cache' ], 10, 3 );
		\add_action( 'delete_post', [ $this, 'update_cache' ], 10 );
	}

	/**
	 * Update the cache when a post is published or deleted.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post       The post object.
	 *
	 * @return void
	 */
	public function maybe_update_published_post_count_cache( $new_status, $old_status, $post ) {
		if ( 'publish' !== $new_status && 'publish' !== $old_status ) {
			return;
		}

		$this->update_cache();
	}

	/**
	 * Query the published post count.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		$result = \wp_count_posts( 'post' )->publish;

		return ! empty( $result ) ? $result : 0;
	}
}
