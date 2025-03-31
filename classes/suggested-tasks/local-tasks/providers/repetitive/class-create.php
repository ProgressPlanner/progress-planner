<?php
/**
 * Add tasks for content creation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;
use Progress_Planner\Data_Collector\Last_Published_Post as Last_Published_Post_Data_Collector;

/**
 * Add tasks for content creation.
 */
class Create extends Repetitive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'create-post';

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'content-new';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Data_Collector\Last_Published_Post
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Last_Published_Post_Data_Collector();
	}

	/**
	 * Add task data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function modify_task_data( $task_data ) {
		$last_published_post_data = $this->data_collector->collect();

		if ( ! $last_published_post_data || empty( $last_published_post_data['post_id'] ) ) {
			return $task_data;
		}

		// Add the post ID and post length to the task data.
		$task_data['post_id'] = $last_published_post_data['post_id'];
		$task_data['long']    = $last_published_post_data['long'];

		return $task_data;
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
			'provider_id' => $this->get_provider_id(),
			'title'       => esc_html__( 'Create a post', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'medium',
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(), // We use $this->get_points() here on purpose, get_points_for_task() calcs the points for the last published post.
			'url'         => \esc_url( \admin_url( 'post-new.php?post_type=post' ) ),
			'description' => esc_html__( 'Create a new post.', 'progress-planner' ),
		];

		return $task_details;
	}

	/**
	 * Get the number of points for the task.
	 * This is used to calculate points in the RR widget, so user can see if he earned 1 or 2 points when celebrating.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return int
	 */
	public function get_points_for_task( $task_id = '' ) {

		if ( ! $task_id ) {
			// Get the post that was created last.
			$post_data = $this->data_collector->collect();
		} else {
			$post_data = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $task_id );
			$post_data = $post_data[0] ?? false;
		}

		// Post was created, but then deleted?
		if ( ! $post_data || empty( $post_data['post_id'] ) ) {
			return $this->points;
		}

		return true === $post_data['long'] ? 2 : 1;
	}
}
