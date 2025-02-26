<?php
/**
 * Archive format data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Data_Collector;

use Progress_Planner\Data_Collector\Base_Data_Collector;

/**
 * Archive format data collector class.
 */
class Archive_Format extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'archive_format_count';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'transition_post_status', [ $this, 'update_archive_format_cache' ], 10, 3 );
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
	public function update_archive_format_cache( $new_status, $old_status, $post ) {
		if ( $new_status === 'publish' || $old_status === 'publish' ) {
			$this->update_cache();
		}
	}

	/**
	 * Calculate the archive format count.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		// Check if there are any posts that use a post format using get_posts and get only the IDs.
		// phpcs:disable WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		$args = [
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'tax_query'      => [
				[
					'taxonomy' => 'post_format',
					'operator' => 'EXISTS',
				],
			],
		];
		// phpcs:enable WordPress.DB.SlowDBQuery.slow_db_query_tax_query

		return count( get_posts( $args ) );
	}
}
