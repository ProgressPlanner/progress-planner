<?php
/**
 * Add tasks for unpublished content.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Traits\Dismissable_Task;
use Progress_Planner\Suggested_Tasks\Data_Collector\Unpublished_Content as Unpublished_Content_Data_Collector;

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
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Unpublished_Content_Data_Collector::class;

	/**
	 * Whether the task is repetitive.
	 *
	 * @var bool
	 */
	protected $is_repetitive = false;

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
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		$this->init_dismissable_task();

		\add_filter( 'progress_planner_unpublished_content_exclude_post_ids', [ $this, 'exclude_completed_posts' ] );
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

		if ( empty( $post->post_title ) ) {
			return \sprintf(
				/* translators: %1$s: post type, %2$d: post ID */
				\esc_html__( 'Add a title to %1$s %2$d and finish it', 'progress-planner' ),
				\strtolower( \get_post_type_object( \esc_html( $post->post_type ) )->labels->singular_name ), // @phpstan-ignore-line property.nonObject
				(int) $post->ID
			);
		}

		return \sprintf(
				// translators: %1$s: The post type, %2$s: The post title.
			\esc_html__( 'Finish %1$s "%2$s" and publish it', 'progress-planner' ),
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
		$post_title = \trim( $post_title );
		$post_title = empty( $post_title )
			? \strtolower( \get_post_type_object( \esc_html( $post->post_type ) )->labels->singular_name ) . ' ' . (int) $post->ID // @phpstan-ignore-line property.nonObject
			: '"' . $post_title . '"';

		$post_url = \add_query_arg(
			[
				'post'   => $post->ID,
				'action' => 'edit',
			],
			\admin_url( 'post.php' )
		);

		return \sprintf(
			/* translators: %s: post title */
			\esc_html__( 'You started writing %1$s, but never finished it. Perhaps it\'s time to finish it?', 'progress-planner' ),
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
		return ! empty( $this->get_data_collector()->collect() );
	}

	/**
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {
		if ( true === $this->is_task_snoozed() || ! $this->should_add_task() ) {
			return [];
		}

		$data    = $this->transform_collector_data( $this->get_data_collector()->collect() );
		$task_id = $this->get_task_id(
			[
				'target_post_id' => $data['target_post_id'],
			]
		);

		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
			return [];
		}

		// Transform the data to match the task data structure.
		$task_data = $this->modify_injection_task_data(
			$this->get_task_details(
				$data
			)
		);

		// Get the task post.
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] );

		// Skip the task if it was already injected.
		if ( $task_post ) {
			return [];
		}

		return [ \progress_planner()->get_suggested_tasks_db()->add( $task_data ) ];
	}

	/**
	 * Modify task data before injecting it.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	protected function modify_injection_task_data( $task_data ) {
		// Transform the data to match the task data structure.
		$data = $this->transform_collector_data( $this->get_data_collector()->collect() );

		$task_data['target_post_id'] = $data['target_post_id'];

		return $task_data;
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
	 * Exclude completed posts from the query.
	 *
	 * @param array $post_ids The post IDs.
	 * @return array
	 */
	public function exclude_completed_posts( $post_ids ) {
		return \array_merge( $post_ids, $this->get_snoozed_post_ids(), $this->get_dismissed_post_ids() );
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

		if ( ! $data || ! isset( $data['target_post_id'] ) ) {
			return false;
		}

		$post_status = \get_post_status( $data['target_post_id'] );

		// If the post status is not draft or auto-draft (this includes (bool) false when the post was deleted), the task is completed.
		return ( 'draft' !== $post_status && 'auto-draft' !== $post_status );
	}

	/**
	 * Get the task actions.
	 *
	 * @param array $data The task data.
	 *
	 * @return array
	 */
	public function get_task_actions( $data = [] ) {
		$actions = parent::get_task_actions( $data );

		if ( ! isset( $data['meta']['prpl_url'] ) ) {
			return $actions;
		}

		$actions['do'] = \progress_planner()->the_view(
			'actions/do.php',
			\array_merge(
				$data,
				[
					'task_action_text' => \esc_html__( 'Publish', 'progress-planner' ),
					'url'              => $data['meta']['prpl_url'],
					'url_target'       => '_self',
				]
			),
			true
		);

		return $actions;
	}
}
