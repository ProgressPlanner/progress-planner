<?php
/**
 * Add tasks for content updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Local_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

/**
 * Add tasks for content updates.
 */
class Content_Review extends Content_Abstract {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	const ID = 'review-post';

	/**
	 * The provider type.
	 *
	 * @var string
	 */
	const TYPE = 'content-update';

	/**
	 * The number of items to inject.
	 *
	 * @var int
	 */
	const ITEMS_TO_INJECT = 10;

	/**
	 * The snoozed post IDs.
	 *
	 * @var array|null
	 */
	protected $snoozed_post_ids = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_filter( 'progress_planner_update_posts_tasks_args', [ $this, 'filter_update_posts_args' ] );

		\add_action( 'transition_post_status', [ $this, 'transition_post_status' ], 10, 3 );
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

		if ( isset( $data['post_id'] ) && (int) \get_post_modified_time( 'U', false, (int) $data['post_id'] ) > strtotime( '-6 months' ) ) {
			$data['date'] = \gmdate( 'YW' );
			return $this->get_task_id( $data );
		}
		return false;
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		$number_of_posts_to_inject = static::ITEMS_TO_INJECT;
		$last_updated_posts        = [];

		// Check if there are any important pages to update.
		$important_page_ids = [];
		foreach ( \progress_planner()->get_admin__page_settings()->get_settings() as $important_page ) {
			if ( 0 !== (int) $important_page['value'] ) {
				$important_page_ids[] = (int) $important_page['value'];
			}
		}

		// Add the privacy policy page ID if it exists. Not 'publish' page will not be fetched by get_posts().
		$privacy_policy_page_id = \get_option( 'wp_page_for_privacy_policy' );
		if ( $privacy_policy_page_id ) {
			$important_page_ids[] = (int) $privacy_policy_page_id;
		}

		/**
		 * Filters the pages we deem more important for content updates.
		 *
		 * @param int[] $important_page_ids Post & page IDs of the important pages.
		 */
		$important_page_ids = \apply_filters( 'progress_planner_update_posts_important_page_ids', $important_page_ids );

		if ( ! empty( $important_page_ids ) ) {
			$last_updated_posts = $this->get_old_posts(
				[
					'post__in' => $important_page_ids,
				]
			);
		}

		// Lets check for other posts to update.
		$number_of_posts_to_inject = $number_of_posts_to_inject - count( $last_updated_posts );

		if ( 0 < $number_of_posts_to_inject ) {
			// Get the post that was updated last.
			$last_updated_posts = array_merge(
				$last_updated_posts,
				$this->get_old_posts(
					[
						'post__not_in' => $important_page_ids, // This can be an empty array.
					]
				)
			);
		}

		if ( ! $last_updated_posts ) {
			return [];
		}

		$items = [];
		foreach ( $last_updated_posts as $post ) {
			$task_id = $this->get_task_id(
				[
					'type'    => 'review-post',
					'post_id' => $post->ID, // @phpstan-ignore-line property.nonObject
				]
			);
			$items[] = $this->get_task_details( $task_id );
		}
		return $items;
	}

	/**
	 * Get the task details.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array
	 */
	public function get_task_details( $task_id ) {

		if ( ! $task_id ) {
			return [];
		}

		$data = $this->get_data_from_task_id( $task_id );

		$post         = \get_post( $data['post_id'] );
		$task_details = [
			'task_id'     => $task_id,
			// translators: %1$s: The post type, %2$s: The post title.
			'title'       => sprintf( 'Review %1$s "%2$s"', \esc_html( $post->post_type ), \esc_html( $post->post_title ) ), // @phpstan-ignore-line property.nonObject
			'parent'      => 0,
			'priority'    => 'high',
			'type'        => $this->get_provider_type(),
			'points'      => 1,
			'dismissable' => true,
			'url'         => $this->capability_required() ? \esc_url( \get_edit_post_link( $post->ID ) ) : '', // @phpstan-ignore-line property.nonObject
			'description' => '<p>' . sprintf(
				/* translators: %1$s <a href="https://prpl.fyi/review-post" target="_blank">Review</a> link, %2$s: The post title. */
				\esc_html__( '%1$s the post "%2$s" as it was last updated more than 6 months ago.', 'progress-planner' ),
				'<a href="https://prpl.fyi/review-post" target="_blank">' . \esc_html__( 'Review', 'progress-planner' ) . '</a>',
				\esc_html( $post->post_title ) // @phpstan-ignore-line property.nonObject
			) . '</p>' . ( $this->capability_required() ? '<p><a href="' . \esc_url( \get_edit_post_link( $post->ID ) ) . '">' . \esc_html__( 'Edit the post', 'progress-planner' ) . '</a>.</p>' : '' ), // @phpstan-ignore-line property.nonObject
		];

		return $task_details;
	}

	/**
	 * Get the old posts.
	 *
	 * @param array $args The args.
	 *
	 * @return array
	 */
	public function get_old_posts( $args = [] ) {
		$args = wp_parse_args(
			$args,
			[
				'posts_per_page' => static::ITEMS_TO_INJECT,
				'post_type'      => [ 'page', 'post' ],
				'post_status'    => 'publish',
				'orderby'        => 'modified',
				'order'          => 'ASC',
				'date_query'     => [
					[
						'column' => 'post_modified',
						'before' => '-6 months',
					],
				],
			]
		);

		/**
		 * Filters the args for the posts & pages we want user to review.
		 *
		 * @param array $args The get_postsargs.
		 */
		$args = apply_filters( 'progress_planner_update_posts_tasks_args', $args );

		// Get the post that was updated last.
		$posts = \get_posts( $args );

		return $posts ? $posts : [];
	}

	/**
	 * Filter the review posts tasks args.
	 *
	 * @param array $args The args.
	 *
	 * @return array
	 */
	public function filter_update_posts_args( $args ) {
		$snoozed_post_ids = $this->get_snoozed_post_ids();

		if ( ! empty( $snoozed_post_ids ) ) {
			if ( ! isset( $args['post__not_in'] ) ) {
				$args['post__not_in'] = [];
			}
			$args['post__not_in'] = array_merge( $args['post__not_in'], $snoozed_post_ids );
		}

		return $args;
	}

	/**
	 * Get the snoozed post IDs.
	 *
	 * @return array
	 */
	protected function get_snoozed_post_ids() {

		if ( null !== $this->snoozed_post_ids ) {
			return $this->snoozed_post_ids;
		}

		$this->snoozed_post_ids = [];
		$snoozed                = \progress_planner()->get_suggested_tasks()->get_snoozed_tasks();

		if ( \is_array( $snoozed ) && ! empty( $snoozed ) ) {
			foreach ( $snoozed as $task ) {
				$data = $this->get_data_from_task_id( $task['id'] );
				if ( isset( $data['type'] ) && 'review-post' === $data['type'] ) {
					$this->snoozed_post_ids[] = $data['post_id'];
				}
			}
		}

		return $this->snoozed_post_ids;
	}

	/**
	 * Run actions when transitioning a post status.
	 *
	 * @param string   $new_status The new status.
	 * @param string   $old_status The old status.
	 * @param \WP_Post $post       The post object.
	 *
	 * @return void
	 */
	public function transition_post_status( $new_status, $old_status, $post ) {
		$include_post_types = \progress_planner()->get_settings()->get( [ 'include_post_types' ], [ 'post', 'page' ] );

		// Bail if we should skip saving.
		if ( ( 'trash' !== $new_status )
			|| ! \in_array( $post->post_type, $include_post_types, true )
		) {
			return;
		}

		foreach ( \progress_planner()->get_suggested_tasks()->get_local()->get_pending_tasks() as $task_id ) {
			$task_object = ( new Local_Task_Factory( $task_id ) )->get_task();
			$task_data   = $task_object->get_data();
			if (
				$this->get_provider_type() === $task_data['type'] &&
				(
					isset( $task_data['post_id'] ) &&
					(int) $task_data['post_id'] === (int) $post->ID
				)
			) {
				// Remove the task from the pending local tasks list.
				\progress_planner()->get_suggested_tasks()->get_local()->remove_pending_task( $task_id ); // @phpstan-ignore-line method.nonObject
			}
		}
	}
}
