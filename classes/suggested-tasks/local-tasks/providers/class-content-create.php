<?php
/**
 * Add tasks for content creation.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Activities\Content_Helpers;

/**
 * Add tasks for content creation.
 */
class Content_Create extends Content_Abstract {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'create-post';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'content-new';

	/**
	 * The number of items to inject.
	 *
	 * @var int
	 */
	const ITEMS_TO_INJECT = 2;

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		// Early exit if we have both long and short posts snoozed.
		if ( true === \progress_planner()->get_suggested_tasks()->check_task_condition(
			[
				'type'         => 'snoozed-post-length',
				'post_lengths' => [ 'long', 'short' ],
			]
		) ) {
			return [];
		}

		// Get the post that was created last.
		$last_created_posts = \get_posts(
			[
				'posts_per_page' => 1,
				'post_status'    => 'publish',
				'orderby'        => 'date',
				'order'          => 'DESC',
			]
		);

		$is_last_post_long = (
			! empty( $last_created_posts )
			&& \progress_planner()->get_activities__content_helpers()->is_post_long( $last_created_posts[0]->ID )
		);

		// If the task with this length is snoozed, don't add a task.
		if ( true === \progress_planner()->get_suggested_tasks()->check_task_condition(
			[
				'type'         => 'snoozed-post-length',
				'post_lengths' => [ $is_last_post_long ? 'short' : 'long' ],
			]
		) ) {
			return [];
		}

		$task_id = $this->get_task_id(
			[
				'type' => 'create-post',
				'date' => \gmdate( 'YW' ),
				'long' => $is_last_post_long ? '0' : '1',
			]
		);

		// If the task with this length and id is completed, don't add a task.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
			return [];
		}

		return [ $this->get_task_details( $task_id ) ];
	}

	/**
	 * Evaluate a task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool|string
	 */
	public function evaluate_task( $task_id ) {
		$data = $this->get_data_from_task_id( $task_id );

		$last_posts = \get_posts(
			[
				'posts_per_page' => 1,
				'post_status'    => 'publish',
				'orderby'        => 'date',
				'order'          => 'DESC',
			]
		);

		$last_post = $last_posts ? $last_posts[0] : null;
		if ( ! $last_post ) {
			return false;
		}

		// Check if the post was created this week.
		if ( \gmdate( 'YW', strtotime( $last_post->post_date ) ) !== \gmdate( 'YW' ) ) { // @phpstan-ignore-line argument.type
			return false;
		}

		// Check if the task is for this week.
		if ( ! isset( $data['date'] ) || (string) $data['date'] !== (string) \gmdate( 'YW' ) ) {
			return false;
		}

		// Check if the task is for a long post.
		$is_post_long = \progress_planner()->get_activities__content_helpers()->is_post_long( $last_post->ID );
		if ( ! isset( $data['long'] ) || $data['long'] !== $is_post_long ) {
			return false;
		}

		return $this->get_task_id(
			[
				'type'    => 'create-post',
				'date'    => \gmdate( 'YW' ),
				'post_id' => $last_post->ID,
				'long'    => $is_post_long ? '1' : '0',
			]
		);
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

		$data = $this->get_data_from_task_id( $task_id );

		$task_details = [
			'task_id'     => $task_id,
			'title'       => isset( $data['long'] ) && $data['long']
				? esc_html__( 'Create a long post', 'progress-planner' )
				: esc_html__( 'Create a short post', 'progress-planner' ),
			'parent'      => 0,
			'priority'    => 'medium',
			'type'        => $this->get_provider_type(),
			'points'      => isset( $data['long'] ) && $data['long'] ? 2 : 1,
			'url'         => \esc_url( \admin_url( 'post-new.php?post_type=post' ) ),
			'description' => isset( $data['long'] ) && $data['long']
				? sprintf(
					/* translators: %d: The threshold (number, words count) for a long post. */
					esc_html__( 'Create a new long post (longer than %d words).', 'progress-planner' ),
					Content_Helpers::LONG_POST_THRESHOLD
				)
				: sprintf(
					/* translators: %d: The threshold (number, words count) for a long post. */
					esc_html__( 'Create a new short post (no longer than %d words).', 'progress-planner' ),
					Content_Helpers::LONG_POST_THRESHOLD
				),
		];

		return $task_details;
	}
}
