<?php
/**
 * Add tasks for content updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Repetitive;

use Progress_Planner\Suggested_Tasks\Providers\Repetitive;
use Progress_Planner\Suggested_Tasks\Task_Factory;

/**
 * Add tasks for content updates.
 */
class Review extends Repetitive {

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'review-post';

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'content-update';

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'high';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The number of items to inject.
	 *
	 * @var int
	 */
	protected const ITEMS_TO_INJECT = 10;

	/**
	 * The snoozed post IDs.
	 *
	 * @var array|null
	 */
	protected $snoozed_post_ids = null;

	/**
	 * The post to update IDs.
	 *
	 * @var array|null
	 */
	protected $task_post_mappings = null;

	/**
	 * The include post types.
	 *
	 * @var string[]
	 */
	protected $include_post_types = [];

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		$this->include_post_types = \progress_planner()->get_settings()->get_post_types_names(); // Wait for the post types to be initialized.

		\add_filter( 'progress_planner_update_posts_tasks_args', [ $this, 'filter_update_posts_args' ] );
	}

	/**
	 * Get the task title.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_title( $task_id = '' ) {
		$post = $this->get_post_from_task_id( $task_id );

		if ( ! $post ) {
			return '';
		}

		return sprintf(
			// translators: %1$s: The post type, %2$s: The post title.
			\esc_html__( 'Review %1$s "%2$s"', 'progress-planner' ),
			strtolower( \get_post_type_object( \esc_html( $post->post_type ) )->labels->singular_name ), // @phpstan-ignore-line property.nonObject
			\esc_html( $post->post_title ) // @phpstan-ignore-line property.nonObject
		);
	}

	/**
	 * Get the task description.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_description( $task_id = '' ) {
		$post = $this->get_post_from_task_id( $task_id );

		if ( ! $post ) {
			return '';
		}

		return '<p>' . sprintf(
			/* translators: %1$s <a href="https://prpl.fyi/review-post" target="_blank">Review</a> link, %2$s: The post title. */
			\esc_html__( '%1$s the post "%2$s" as it was last updated more than 6 months ago.', 'progress-planner' ),
			'<a href="https://prpl.fyi/review-post" target="_blank">' . \esc_html__( 'Review', 'progress-planner' ) . '</a>',
			\esc_html( $post->post_title ) // @phpstan-ignore-line property.nonObject
		) . '</p>' . ( $this->capability_required() ? '<p><a href="' . \esc_url( \get_edit_post_link( $post->ID ) ) . '">' . \esc_html__( 'Edit the post', 'progress-planner' ) . '</a>.</p>' : '' ); // @phpstan-ignore-line property.nonObject
	}

	/**
	 * Get the task URL.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_url( $task_id = '' ) {
		$post = $this->get_post_from_task_id( $task_id );

		if ( ! $post ) {
			return '';
		}

		return $this->capability_required() ? \esc_url( \get_edit_post_link( $post->ID ) ) : ''; // @phpstan-ignore-line property.nonObject
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {

		if ( null === $this->task_post_mappings ) {
			$this->task_post_mappings = [];

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
						'post__in'  => $important_page_ids,
						'post_type' => 'any',
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
				return false;
			}

			foreach ( $last_updated_posts as $post ) {
				$task_id = $this->get_task_id( [ 'post_id' => $post->ID ] );

				// Don't add the task if it was completed.
				if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
					continue;
				}

				$this->task_post_mappings[ $task_id ] = [
					'task_id'   => $task_id,
					'post_id'   => $post->ID,
					'post_type' => $post->post_type,
				];
			}
		}

		return 0 < count( $this->task_post_mappings );
	}


	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		if (
			! $this->should_add_task() // No need to add the task.
		) {
			return [];
		}

		$task_to_inject = [];
		if ( ! empty( $this->task_post_mappings ) ) {
			foreach ( $this->task_post_mappings as $task_data ) {
				if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_data['task_id'] ) ) {
					continue;
				}

				$task_to_inject[] = [
					'task_id'     => $this->get_task_id( [ 'post_id' => $task_data['post_id'] ] ),
					'provider_id' => $this->get_provider_id(),
					'category'    => $this->get_provider_category(),
					'post_id'     => $task_data['post_id'],
					'post_type'   => $task_data['post_type'],
					'date'        => \gmdate( 'YW' ),
				];
			}
		}

		return $task_to_inject;
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
			'title'       => $this->get_title( $task_id ),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'url'         => $this->get_url( $task_id ),
			'url_target'  => $this->get_url_target(),
			'description' => $this->get_description( $task_id ),
		];

		return $task_details;
	}

	/**
	 * Get the post ID from the task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \WP_Post|null
	 */
	public function get_post_from_task_id( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $task_id );

		if ( empty( $tasks ) ) {
			return null;
		}

		$data = $tasks[0];

		return isset( $data['post_id'] ) && $data['post_id'] ? \get_post( $data['post_id'] ) : null;
	}

	/**
	 * This method is added just to override the parent method.
	 * For this task provider we can't check if it is snoozed like for other as we snooze the task for specific post.
	 * Check for that is included in the should_add_task method.
	 *
	 * @return bool
	 */
	public function is_task_snoozed() {
		return false;
	}

	/**
	 * Get the old posts.
	 *
	 * @param array $args The args.
	 *
	 * @return array
	 */
	public function get_old_posts( $args = [] ) {
		$posts = [];

		if ( ! empty( $this->include_post_types ) ) {
			$args = wp_parse_args(
				$args,
				[
					'posts_per_page' => static::ITEMS_TO_INJECT,
					'post_type'      => $this->include_post_types,
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
		}

		// Get the pages saved in the settings that have not been updated in the last 6 months.
		$saved_page_type_ids = $this->get_saved_page_types();

		if ( ! empty( $saved_page_type_ids ) ) {
			$pages_to_update = \get_posts(
				[
					'post_type'           => 'any',
					'post_status'         => 'publish',
					'orderby'             => 'modified',
					'order'               => 'ASC',
					'ignore_sticky_posts' => true,
					'date_query'          => [
						[
							'column' => 'post_modified',
							'before' => '-6 months',
						],
					],
					'post__in'            => $saved_page_type_ids,
				]
			);

			// Merge the posts & pages to update. Put the pages first.
			$posts = array_merge( $pages_to_update, $posts );
		}

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
		$snoozed                = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'status', 'snoozed' );

		if ( ! empty( $snoozed ) ) {
			foreach ( $snoozed as $task ) {
				if ( isset( $task['provider_id'] ) && 'review-post' === $task['provider_id'] ) {
					$this->snoozed_post_ids[] = $task['post_id'];
				}
			}
		}

		return $this->snoozed_post_ids;
	}

	/**
	 * Get the saved page-types.
	 *
	 * @return int[]
	 */
	protected function get_saved_page_types() {
		$ids = [];
		// Add the saved page-types to the post__not_in array.
		$page_types = \progress_planner()->get_admin__page_settings()->get_settings();
		foreach ( $page_types as $page_type ) {
			if ( isset( $page_type['value'] ) && 0 !== (int) $page_type['value'] ) {
				$ids[] = (int) $page_type['value'];
			}
		}
		return $ids;
	}

	/**
	 * Check if a specific task is completed.
	 *
	 * @param string $task_id The task ID to check.
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {

		$task = Task_Factory::create_task_from( 'id', $task_id );
		$data = $task->get_data();

		if ( isset( $data['post_id'] ) && (int) \get_post_modified_time( 'U', false, (int) $data['post_id'] ) > strtotime( '-6 months' ) ) {
			return true;
		}

		return false;
	}
}
