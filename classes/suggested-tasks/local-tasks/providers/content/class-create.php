<?php
/**
 * Add tasks for content creation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Content;

use Progress_Planner\Activities\Content_Helpers;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;
use Progress_Planner\Data_Collector\Create_Post as Create_Post_Data_Collector;

/**
 * Add tasks for content creation.
 */
class Create extends Repetitive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const ID = 'create-post';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	protected const TYPE = 'content-new';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Data_Collector\Create_Post
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Create_Post_Data_Collector();
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {

		// Get the post that was created last.
		$last_published_post_data = $this->data_collector->collect();

		// There are no published posts, add task.
		if ( ! $last_published_post_data || empty( $last_published_post_data['post_id'] ) ) {
			return true;
		}

		// Add tasks if there are no posts published this week.
		return \gmdate( 'YW' ) !== \gmdate( 'YW', strtotime( $last_published_post_data['post_date'] ) );
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id = '' ) {

		if ( ! $task_id ) {
			return [];
		}

		$task_details = [
			'task_id'     => $task_id,
			'title'       => esc_html__( 'Create a post', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'medium',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'url'         => \esc_url( \admin_url( 'post-new.php?post_type=post' ) ),
			'description' => esc_html__( 'Create a new post.', 'progress-planner' ),
		];

		return $task_details;
	}

	/**
	 * Get the number of points for the task.
	 *
	 * @return int
	 */
	public function get_points() {

		// Get the post that was created last.
		$last_published_post_data = $this->data_collector->collect();

		// Post was created, but then deleted?
		if ( ! $last_published_post_data || empty( $last_published_post_data['post_id'] ) ) {
			return 1;
		}

		return 'long' === $last_published_post_data['post_length'] ? 2 : 1;
	}
}
