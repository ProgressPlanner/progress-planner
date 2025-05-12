<?php
/**
 * Add tasks for content creation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Data_Collector\Last_Published_Post as Last_Published_Post_Data_Collector;

/**
 * Add tasks for content creation.
 */
class Content_Create extends Tasks {

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
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = true;

	/**
	 * The task URL target.
	 *
	 * @var string
	 */
	protected $url_target = '_blank';

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
		$this->url            = 'https://prpl.fyi/valuable-content';
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	public function get_title() {
		return esc_html__( 'Create valuable content', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	public function get_description() {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Time to add more valuable content to your site! Check our blog for inspiration. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/valuable-content" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
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
			'title'       => $this->get_title(),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'url'         => $this->get_url(),
			'url_target'  => $this->get_url_target(),
			'description' => $this->get_description(),
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
	public function get_points( $task_id = '' ) {

		if ( ! $task_id ) {
			return $this->points;
		}

		$post_data = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'task_id' => $task_id ] );
		$post_data = $post_data[0] ?? false;

		// Backwards compatibility.
		if ( $post_data && isset( $post_data['long'] ) ) {
			return true === $post_data['long'] ? 2 : 1;
		}

		return $this->points;
	}
}
