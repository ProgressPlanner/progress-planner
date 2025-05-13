<?php
/**
 * Post tag count data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Post tag count data collector class.
 */
class Post_Tag_Count extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'post_tag_count';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'created_post_tag', [ $this, 'update_cache' ], 10 );
		\add_action( 'delete_post_tag', [ $this, 'update_cache' ], 10 );
	}

	/**
	 * Query the post tag count.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		global $wpdb;

		$result = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			"
			SELECT COUNT( * ) as tag_count
			FROM {$wpdb->terms} AS t
			INNER JOIN {$wpdb->term_taxonomy} AS tt ON t.term_id = tt.term_id
			WHERE tt.taxonomy = 'post_tag'
		",
		);

		return ! empty( $result ) ? $result : 0;
	}
}
