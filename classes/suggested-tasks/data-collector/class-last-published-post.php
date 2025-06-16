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
class Last_Published_Post extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'last_published_post_id';

	/**
	 * The include post types.
	 *
	 * @var string[]
	 */
	protected $include_post_types = [];

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'init', [ $this, 'set_include_post_types' ], 100 ); // Wait for all CPTs to be registered and collector manager to trigger it's init method (which is done on priority 99).
		\add_action( 'transition_post_status', [ $this, 'update_last_published_post_cache' ], 10, 3 );
	}

	/**
	 * Set the include post types.
	 *
	 * @return void
	 */
	public function set_include_post_types() {
		$this->include_post_types = \progress_planner()->get_settings()->get_post_types_names();
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
	public function update_last_published_post_cache( $new_status, $old_status, $post ) {
		if ( true === \in_array( get_post_type( $post ), $this->include_post_types, true ) &&
			( $new_status === 'publish' || $old_status === 'publish' )
		) {
			$this->update_cache();
		}
	}

	/**
	 * Query the hello world post.
	 *
	 * @return array
	 */
	protected function calculate_data() {
		// Default data.
		$data = [
			'post_id'   => 0,
			'long'      => false,
			'post_date' => '',
		];

		// Get the post that was created last.
		$last_created_posts = \get_posts(
			[
				'posts_per_page' => 1,
				'post_status'    => 'publish',
				'orderby'        => 'date',
				'order'          => 'DESC',
				'post_type'      => $this->include_post_types,
			]
		);

		if ( ! empty( $last_created_posts ) ) {
			$data = [
				'post_id'   => $last_created_posts[0]->ID,
				'post_date' => $last_created_posts[0]->post_date,
			];
		}

		return $data;
	}
}
