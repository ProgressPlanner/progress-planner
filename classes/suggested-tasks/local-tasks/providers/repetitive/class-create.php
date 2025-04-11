<?php
/**
 * Add tasks for content creation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive;
use Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post as Last_Published_Post_Data_Collector;

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
	 * The task points.
	 *
	 * @var int
	 */
	protected $points = 2;

	/**
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post
	 */
	protected $data_collector;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Last_Published_Post_Data_Collector();
		$this->url            = \admin_url( 'post-new.php?post_type=post' );
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Create a post', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	public function get_description() {
		return esc_html__( 'Create a new, relevant post. If you write an in-depth post you may earn an extra point.', 'progress-planner' );
	}

	/**
	 * Check if a specific task is completed.
	 * Child classes can override this method to handle specific task IDs.
	 *
	 * @param string $task_id The task ID to check.
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$last_published_post_data = $this->data_collector->collect();

		if ( ! $last_published_post_data || ! isset( $last_published_post_data['long'] ) ) {
			return false;
		}

		return $last_published_post_data['long'];
	}

	/**
	 * Add task data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function modify_evaluated_task_data( $task_data ) {
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

		// Add tasks if there are no long posts published this week.
		return ( \gmdate( 'YW' ) === \gmdate( 'YW', strtotime( $last_published_post_data['post_date'] ) ) && false === $last_published_post_data['long'] )
			|| ( \gmdate( 'YW' ) < \gmdate( 'YW', strtotime( $last_published_post_data['post_date'] ) ) );
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
			'title'       => $this->get_title(),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'url'         => $this->get_url(),
			'description' => $this->get_description(),
		];

		return $task_details;
	}

	/**
	 * Get the number of points for the task.
	 * This is only used for calculating points from activities, to handle backwards compatibility.
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
		if ( ! $post_data || empty( $post_data['post_id'] ) || ! isset( $post_data['long'] ) ) {
			return 1;
		}

		return true === $post_data['long'] ? $this->points : 1;
	}
}
