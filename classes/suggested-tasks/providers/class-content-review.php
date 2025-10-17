<?php
/**
 * Add tasks for content updates.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Dismissable_Task;
use Progress_Planner\Page_Types;

/**
 * Add tasks for content updates.
 */
class Content_Review extends Tasks {
	use Dismissable_Task;

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
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/review-post';

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
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = self::PRIORITY_LOW;

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
	 * @var array
	 */
	protected $snoozed_post_ids = [];

	/**
	 * The dismissed post IDs.
	 *
	 * @var array
	 */
	protected $dismissed_post_ids = [];

	/**
	 * The post to update IDs.
	 *
	 * @var array
	 */
	protected $task_post_mappings = [];

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

		// Add the Yoast cornerstone pages to the important page IDs.
		if ( \function_exists( 'YoastSEO' ) ) {
			\add_filter( 'progress_planner_update_posts_important_page_ids', [ $this, 'add_yoast_cornerstone_pages' ] );
		}

		$this->init_dismissable_task();
	}

	/**
	 * Get the task title.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_title_with_data( $task_data = [] ) {
		if ( ! isset( $task_data['target_post_id'] ) ) {
			return '';
		}

		$post = \get_post( $task_data['target_post_id'] );

		if ( ! $post ) {
			return '';
		}

		return \sprintf(
				// translators: %1$s: The post type, %2$s: The post title.
			\esc_html__( 'Review %1$s "%2$s"', 'progress-planner' ),
			\strtolower( \get_post_type_object( \esc_html( $post->post_type ) )->labels->singular_name ), // @phpstan-ignore-line property.nonObject
			\esc_html( $post->post_title ) // @phpstan-ignore-line property.nonObject
		);
	}

	/**
	 * Get the task URL.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_url_with_data( $task_data = [] ) {
		if ( ! isset( $task_data['target_post_id'] ) ) {
			return '';
		}

		$post = \get_post( $task_data['target_post_id'] );

		if ( ! $post ) {
			return '';
		}

		// We don't use the edit_post_link() function because we need to bypass it's current_user_can() check.
		return \esc_url(
			\add_query_arg(
				[
					'post'   => $post->ID,
					'action' => 'edit',
				],
				\admin_url( 'post.php' )
			)
		);
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		if ( ! empty( $this->task_post_mappings ) ) {
			return true;
		}

		$last_updated_posts = [];

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
					'post__in'   => $important_page_ids,
					'post_type'  => 'any',
					'date_query' => [
						[
							'column' => 'post_modified',
							'before' => '-6 months', // Important pages are updated more often.
						],
					],
				]
			);
		}

		// Lets check for other posts to update.
		if ( 0 < static::ITEMS_TO_INJECT - \count( $last_updated_posts ) ) {
			// Get the post that was updated last.
			$last_updated_posts = \array_merge(
				$last_updated_posts,
				$this->get_old_posts(
					[
						'post__not_in' => $important_page_ids, // This can be an empty array.
						'post_type'    => $this->include_post_types,
					]
				)
			);
		}

		if ( ! $last_updated_posts ) {
			return false;
		}

		foreach ( $last_updated_posts as $post ) {
			// Skip if the task has been dismissed.
			if ( $this->is_task_dismissed(
				[
					'target_post_id' => $post->ID,
					'provider_id'    => $this->get_provider_id(),
				]
			) ) {
				continue;
			}

			$task_id = $this->get_task_id( [ 'target_post_id' => $post->ID ] );

			// Don't add the task if it was completed.
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
				continue;
			}

			$this->task_post_mappings[ $task_id ] = [
				'task_id'          => $task_id,
				'target_post_id'   => $post->ID,
				'target_post_type' => $post->post_type,
			];
		}

		return ! empty( $this->task_post_mappings );
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if ( ! $this->should_add_task() ) {
			return [];
		}

		$task_to_inject = [];
		foreach ( $this->task_post_mappings as $task_data ) {
			if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_data['task_id'] ) ) {
				continue;
			}

			$task_to_inject[] = [
				'task_id'           => $this->get_task_id( [ 'target_post_id' => $task_data['target_post_id'] ] ),
				'provider_id'       => $this->get_provider_id(),
				'target_post_id'    => $task_data['target_post_id'],
				'target_post_type'  => $task_data['target_post_type'],
				'date'              => \gmdate( 'YW' ),
				'post_title'        => $this->get_title_with_data( $task_data ),
				'url'               => $this->get_url_with_data( $task_data ),
				'url_target'        => $this->get_url_target(),
				'dismissable'       => $this->is_dismissable(),
				'priority'          => $this->get_priority(),
				'points'            => $this->get_points(),
				'external_link_url' => $this->get_external_link_url(),
			];
		}

		$added_tasks = [];

		foreach ( $task_to_inject as $task_data ) {
			// Skip the task if it was already injected.
			if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] ) ) {
				continue;
			}

			$added_tasks[] = \progress_planner()->get_suggested_tasks_db()->add( $task_data );
		}

		return $added_tasks;
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
	 * @return \WP_Post[]
	 */
	public function get_old_posts( $args = [] ) {
		$posts = [];

		// Parse default args.
		$args = \wp_parse_args(
			$args,
			[
				'posts_per_page'      => static::ITEMS_TO_INJECT,
				'post_status'         => 'publish',
				'orderby'             => 'modified',
				'order'               => 'ASC',
				'ignore_sticky_posts' => true,
				'date_query'          => [
					[
						'column' => 'post_modified',
						'before' => '-12 months',
					],
				],
			]
		);

		/**
		 * Filters the args for the posts & pages we want user to review.
		 *
		 * @param array $args The get_posts args.
		 */
		$args = \apply_filters( 'progress_planner_update_posts_tasks_args', $args );

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
		$args['post__not_in'] = isset( $args['post__not_in'] )
			? $args['post__not_in']
			: [];

		$args['post__not_in'] = \array_merge(
			$args['post__not_in'],
			// Add the snoozed post IDs to the post__not_in array.
			$this->get_snoozed_post_ids(),
		);

		if ( ! empty( $this->get_dismissed_post_ids() ) ) {
			$args['post__not_in'] = \array_merge( $args['post__not_in'], $this->get_dismissed_post_ids() );
		}

		if ( \function_exists( 'YoastSEO' ) ) {
			// Handle the case when the meta key doesn't exist.
			$args['meta_query'] = [ // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'relation' => 'OR',
				[
					'key'     => '_yoast_wpseo_content_score',
					'compare' => 'EXISTS',
				],
				[
					'key'     => '_yoast_wpseo_content_score',
					'compare' => 'NOT EXISTS',
				],
			];

			$args['orderby'] = 'meta_value_num';
			$args['order']   = 'ASC';
		}

		return $args;
	}

	/**
	 * Get the snoozed post IDs.
	 *
	 * @return array
	 */
	protected function get_snoozed_post_ids() {
		if ( ! empty( $this->snoozed_post_ids ) ) {
			return $this->snoozed_post_ids;
		}

		$snoozed = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'future' ] );

		foreach ( $snoozed as $task ) {
			/**
			 * The task object.
			 *
			 * @var \Progress_Planner\Suggested_Tasks\Task $task
			 */
			if ( isset( $task->provider->slug ) && 'review-post' === $task->provider->slug ) {
				$this->snoozed_post_ids[] = $task->target_post_id;
			}
		}

		return $this->snoozed_post_ids;
	}

	/**
	 * Get the dismissed post IDs.
	 *
	 * @return array
	 */
	protected function get_dismissed_post_ids() {
		if ( ! empty( $this->dismissed_post_ids ) ) {
			return $this->dismissed_post_ids;
		}

		$dismissed = $this->get_dismissed_tasks();

		if ( ! empty( $dismissed ) ) {
			$this->dismissed_post_ids = \array_values( \wp_list_pluck( $dismissed, 'post_id' ) );
		}

		return $this->dismissed_post_ids;
	}

	/**
	 * Get the task identifier for storing dismissal data.
	 * Override this method in the implementing class to provide task-specific identification.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string|false The task identifier or false if not applicable.
	 */
	protected function get_task_identifier( $task_data ) {
		return $this->get_provider_id() . '-' . $task_data['target_post_id'];
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
		$task = \progress_planner()->get_suggested_tasks_db()->get_post( $task_id );

		if ( ! $task ) {
			return false;
		}

		$data = $task->get_data();

		return $data && isset( $data['target_post_id'] )
			&& (int) \get_post_modified_time( 'U', false, (int) $data['target_post_id'] ) > \strtotime( '-12 months' );
	}

	/**
	 * Add the Yoast cornerstone pages to the important page IDs.
	 *
	 * @param int[] $important_page_ids The important page IDs.
	 * @return int[]
	 */
	public function add_yoast_cornerstone_pages( $important_page_ids ) {
		if ( ! \function_exists( 'YoastSEO' ) ) {
			return $important_page_ids;
		}
		$cornerstone_page_ids = \get_posts(
			[
				'post_type'  => 'any',
				'meta_key'   => '_yoast_wpseo_is_cornerstone', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value' => '1', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'fields'     => 'ids',
			]
		);
		if ( ! empty( $cornerstone_page_ids ) ) {
			$important_page_ids = \array_merge( $important_page_ids, $cornerstone_page_ids );
		}
		return $important_page_ids;
	}

	/**
	 * Get the expiration period in seconds.
	 *
	 * @param array $dismissal_data The dismissal data.
	 *
	 * @return int The expiration period in seconds.
	 */
	protected function get_expiration_period( $dismissal_data ) {
		if ( ! isset( $dismissal_data['post_id'] ) ) {
			return 6 * MONTH_IN_SECONDS;
		}

		// Important pages have term from 'progress_planner_page_types' taxonomy assigned.
		$has_term = \has_term( '', Page_Types::TAXONOMY_NAME, $dismissal_data['post_id'] );
		if ( $has_term ) {
			return 6 * MONTH_IN_SECONDS;
		}

		// Check if it his cornerstone content.
		if ( \function_exists( 'YoastSEO' ) ) {
			$is_cornerstone = \get_post_meta( $dismissal_data['post_id'], '_yoast_wpseo_is_cornerstone', true );
			if ( '1' === $is_cornerstone ) {
				return 6 * MONTH_IN_SECONDS;
			}
		}

		return 12 * MONTH_IN_SECONDS;
	}

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $data['id'] );
		if ( ! $task_post ) {
			return $actions;
		}

		$task_data = $task_post->get_data();

		if ( isset( $task_data['target_post_id'] ) ) {
			$actions[] = [
				'priority' => 10,
				'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'post.php?action=edit&post=' . $task_data['target_post_id'] ) . '" target="_self">' . \esc_html__( 'Review', 'progress-planner' ) . '</a>',
			];
		}

		return $actions;
	}
}
