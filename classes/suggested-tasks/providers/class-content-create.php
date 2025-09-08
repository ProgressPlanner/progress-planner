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
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Last_Published_Post_Data_Collector::class;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/valuable-content';

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
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return 'https://prpl.fyi/valuable-content';
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Create valuable content', 'progress-planner' );
	}

	/**
	 * Add task data.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function modify_evaluated_task_data( $task_data ) {
		$last_published_post_data = $this->get_data_collector()->collect();

		if ( ! $last_published_post_data || empty( $last_published_post_data['post_id'] ) ) {
			return $task_data;
		}

		// Add the post ID to the task data.
		$task_data['target_post_id'] = $last_published_post_data['post_id'];

		return $task_data;
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		// Get the post that was created last.
		$last_published_post_data = $this->get_data_collector()->collect();

		// There are no published posts, add task.
		if ( ! $last_published_post_data || empty( $last_published_post_data['post_id'] ) ) {
			return true;
		}

		// Add tasks if there are no posts published this week.
		return \gmdate( 'YW' ) !== \gmdate( 'YW', \strtotime( $last_published_post_data['post_date'] ) );
	}

	/**
	 * Get the task-action text.
	 *
	 * @return string
	 */
	protected function get_task_action_text() {
		return \esc_html__( 'Create new post', 'progress-planner' );
	}
}
