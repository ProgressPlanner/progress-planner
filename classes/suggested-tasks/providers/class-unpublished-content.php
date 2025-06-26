<?php
/**
 * Add tasks for unpublished content.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Dismissable_Task;

/**
 * Add tasks for unpublished content.
 */
class Unpublished_Content extends Tasks {
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
	protected const PROVIDER_ID = 'unpublished-content';

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'content-publish';

	/**
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = false;

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
	protected $priority = 30;

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
	 * The dismissed post IDs.
	 *
	 * @var array|null
	 */
	protected $dismissed_post_ids = null;

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
			\esc_html__( 'Publish %1$s "%2$s"', 'progress-planner' ),
			\strtolower( \get_post_type_object( \esc_html( $post->post_type ) )->labels->singular_name ), // @phpstan-ignore-line property.nonObject
			\esc_html( $post->post_title ) // @phpstan-ignore-line property.nonObject
		);
	}

	/**
	 * Get the task description.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_description_with_data( $task_data = [] ) {
		if ( ! isset( $task_data['target_post_id'] ) ) {
			return '';
		}

		$post = \get_post( $task_data['target_post_id'] );

		if ( ! $post ) {
			return '';
		}

		$post_title = \get_the_title( $post );
		$post_url   = \add_query_arg(
			[
				'post'   => $post->ID,
				'action' => 'edit',
			],
			\admin_url( 'post.php' )
		);

		return \sprintf(
			/* translators: %s: post title */
			\esc_html__( 'You started writing %1$s, but never finished it. Perhaps it\'s time to publish it?', 'progress-planner' ),
			'<a href="' . \esc_url( $post_url ) . '" target="_blank">' . \esc_html( $post_title ) . '</a>'
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
		if ( null !== $this->task_post_mappings ) {
			return 0 < \count( $this->task_post_mappings );
		}

		$this->task_post_mappings = [];
		$last_updated_posts       = [];

		// Get the post that was updated last.
		$last_updated_posts = \array_merge(
			$last_updated_posts,
			$this->get_old_posts(
				[
					'post_type' => $this->include_post_types,
				]
			)
		);

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

		return 0 < \count( $this->task_post_mappings );
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
		if ( ! empty( $this->task_post_mappings ) ) {
			foreach ( $this->task_post_mappings as $task_data ) {
				if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_data['task_id'] ) ) {
					continue;
				}

				$task_to_inject[] = [
					'task_id'          => $this->get_task_id( [ 'target_post_id' => $task_data['target_post_id'] ] ),
					'provider_id'      => $this->get_provider_id(),
					'category'         => $this->get_provider_category(),
					'target_post_id'   => $task_data['target_post_id'],
					'target_post_type' => $task_data['target_post_type'],
					'date'             => \gmdate( 'YW' ),
					'post_title'       => $this->get_title_with_data( $task_data ),
					'description'      => $this->get_description_with_data( $task_data ),
					'url'              => $this->get_url_with_data( $task_data ),
					'url_target'       => $this->get_url_target(),
					'dismissable'      => $this->is_dismissable(),
					'snoozable'        => $this->is_snoozable,
					'points'           => $this->get_points(),
				];
			}
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
	 * @return array
	 */
	public function get_old_posts( $args = [] ) {
		$posts = [];

		// Parse default args.
		$args = \wp_parse_args(
			$args,
			[
				'posts_per_page' => static::ITEMS_TO_INJECT,
				'post_status'    => [ 'draft', 'pending' ],
				'orderby'        => 'modified',
				'order'          => 'ASC',
				'date_query'     => [
					[
						'column' => 'post_modified',
						'before' => '-1 week',
					],
				],
			]
		);

		$args['post__not_in'] = isset( $args['post__not_in'] )
			? $args['post__not_in']
			: [];

		$args['post__not_in'] = \array_merge(
			$args['post__not_in'],
			// Add the snoozed post IDs to the post__not_in array.
			$this->get_snoozed_post_ids(),
		);

		$dismissed_post_ids = $this->get_dismissed_post_ids();

		if ( ! empty( $dismissed_post_ids ) ) {
			$args['post__not_in'] = \array_merge( $args['post__not_in'], $dismissed_post_ids );
		}

		// Get the post that was updated last.
		$posts = \get_posts( $args );

		return $posts ? $posts : [];
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
		$snoozed                = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'post_status' => 'future' ] );

		if ( ! empty( $snoozed ) ) {
			foreach ( $snoozed as $task ) {
				/**
				 * The task object.
				 *
				 * @var \Progress_Planner\Suggested_Tasks\Task $task
				 */
				if ( isset( $task->provider->slug ) && 'unpublished-content' === $task->provider->slug ) {
					$this->snoozed_post_ids[] = $task->target_post_id;
				}
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
		if ( null !== $this->dismissed_post_ids ) {
			return $this->dismissed_post_ids;
		}

		$this->dismissed_post_ids = [];
		$dismissed                = $this->get_dismissed_tasks();

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
			&& 'publish' === \get_post_status( $data['target_post_id'] );
	}
}
