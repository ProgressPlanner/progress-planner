<?php
/**
 * Hello World data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Post author data collector class.
 */
class Hello_World extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'hello_world_post_id';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'transition_post_status', [ $this, 'update_hello_world_post_cache' ], 10, 3 );
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
	public function update_hello_world_post_cache( $new_status, $old_status, $post ) {
		// If the status is the same, do nothing.
		if ( $old_status === $new_status ) {
			return;
		}

		if ( $new_status === 'publish' || $old_status === 'publish' ) {
			$this->update_cache();
		}
	}

	/**
	 * Query the hello world post.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		$sample_post = \get_page_by_path( \__( 'hello-world' ), OBJECT, 'post' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
		if ( null === $sample_post ) {
			$query = new \WP_Query(
				[
					'post_type'      => 'post',
					'title'          => \__( 'Hello world!' ), // phpcs:ignore WordPress.WP.I18n.MissingArgDomain
					'post_status'    => 'publish',
					'posts_per_page' => 1,
				]
			);

			$sample_post = ! empty( $query->post ) ? $query->post : 0;
		}

		return ( \is_object( $sample_post ) && \is_a( $sample_post, \WP_Post::class ) ) ? $sample_post->ID : 0;
	}
}
