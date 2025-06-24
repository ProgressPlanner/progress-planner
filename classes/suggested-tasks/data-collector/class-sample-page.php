<?php
/**
 * Sample Page data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Sample Page data collector class.
 */
class Sample_Page extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'sample_page_id';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'transition_post_status', [ $this, 'update_sample_page_cache' ], 10, 3 );
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
	public function update_sample_page_cache( $new_status, $old_status, $post ) {
		// If the status is the same, do nothing.
		if ( $old_status === $new_status ) {
			return;
		}

		if ( $new_status === 'publish' || $old_status === 'publish' ) {
			$this->update_cache();
		}
	}

	/**
	 * Query the sample page.
	 *
	 * @return \WP_Post|int
	 */
	protected function calculate_data() {
		$sample_page = \get_page_by_path( \__( 'sample-page' ) ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		if ( null === $sample_page ) {
			$query = new \WP_Query(
				[
					'post_type'      => 'page',
					'title'          => \__( 'Sample Page' ), // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
					'post_status'    => 'publish',
					'posts_per_page' => 1,
				]
			);

			$sample_page = ! empty( $query->post ) ? $query->post : 0;
		}

		return ( \is_object( $sample_page ) && \is_a( $sample_page, \WP_Post::class ) ) ? $sample_page->ID : 0;
	}
}
