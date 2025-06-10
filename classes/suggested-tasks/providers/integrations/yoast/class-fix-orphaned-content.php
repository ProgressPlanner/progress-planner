<?php
/**
 * Add task for Yoast SEO: fix orphaned content.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast;

use Progress_Planner\Suggested_Tasks\Providers\Integrations\Yoast\Yoast_Provider;
use Progress_Planner\Suggested_Tasks\Data_Collector\Yoast_Orphaned_Content;

/**
 * Add task for Yoast SEO: disable the author archive.
 */
class Fix_Orphaned_Content extends Yoast_Provider {

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'yoast-fix-orphaned-content';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The completed post IDs.
	 *
	 * @var array|null
	 */
	protected $completed_post_ids = null;

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Yoast_Orphaned_Content::class;

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_filter( 'progress_planner_yoast_orphaned_content_exclude_post_ids', [ $this, 'exclude_completed_posts' ] );
	}

	/**
	 * Get the title.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_title( $task_data = [] ) {
		return sprintf(
			/* translators: %s: Post title. */
			\esc_html__( 'Yoast SEO: add internal links to article "%s"!', 'progress-planner' ),
			\esc_html( $task_data['target_post_title'] )
		);
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data The task data.
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Yoast SEO detected that this article has no links pointing to it. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/fix-orphaned-content" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the fixing the orphaned content.', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the URL.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_url( $task_data = [] ) {
		$post = \get_post( $task_data['target_post_id'] );

		return $post ? 'https://prpl.fyi/fix-orphaned-content' : '';
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
	 * Check if a specific task is completed.
	 * Child classes can override this method to handle specific task IDs.
	 *
	 * @param string $task_id The task ID to check.
	 *
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$post = $this->get_post_from_task_id( $task_id );

		// Post was deleted.
		if ( ! $post ) {
			return true;
		}

		global $wpdb;

		$linked_count = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"
			SELECT COUNT(*)
			FROM {$wpdb->prefix}yoast_seo_links
			WHERE target_post_id = %d
			AND type = 'internal'
			",
				$post->ID
			)
		);

		return 0 !== (int) $linked_count;
	}

	/**
	 * Transform data collector data into task data format.
	 *
	 * @param array $data The data from data collector.
	 * @return array The transformed data with original data merged.
	 */
	protected function transform_collector_data( array $data ): array {
		return array_merge(
			$data,
			[
				'target_post_id'    => $data['post_id'],
				'target_post_title' => $data['post_title'],
			]
		);
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

		$data    = $this->get_data_collector()->collect();
		$task_id = $this->get_task_id(
			[
				'post_id' => $data['post_id'],
			]
		);

		// When we have data, check if task was completed.
		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
			return [];
		}

		// Transform the data to match the task data structure.
		$data = $this->transform_collector_data( $data );

		$task_data = [
			'task_id'        => $task_id,
			'provider_id'    => $this->get_provider_id(),
			'category'       => $this->get_provider_category(),
			'target_post_id' => $data['target_post_id'],
			'post_title'     => $this->get_title( $data ),
			'url'            => $this->get_url( $data ),
			'url_target'     => $this->get_url_target(),
			'dismissable'    => $this->is_dismissable(),
			'snoozable'      => $this->is_snoozable,
			'points'         => $this->get_points(),
		];

		$task_data = $this->modify_injection_task_data( $task_data );

		// Get the task post.
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] );

		return $task_post ? [] : [ \progress_planner()->get_suggested_tasks_db()->add( $task_data ) ];
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

		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );

		// If the task data is empty, return an empty array.
		if ( empty( $tasks ) ) {
			return [];
		}

		return [
			'task_id'        => $task_id,
			'provider_id'    => $this->get_provider_id(),
			'post_title'     => $this->get_title( $tasks[0]->get_data() ),
			'target_post_id' => $tasks[0]->target_post_id,
			'parent'         => $this->get_parent(),
			'priority'       => $this->get_priority(),
			'category'       => $this->get_provider_category(),
			'points'         => $this->get_points(),
			'dismissable'    => $this->is_dismissable(),
			'snoozable'      => $this->is_snoozable,
			'url'            => $this->get_url( $tasks[0]->get_data() ),
			'url_target'     => $this->get_url_target(),
			'description'    => $this->get_description( $tasks[0]->get_data() ),
		];
	}

	/**
	 * Get the post ID from the task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \WP_Post|null
	 */
	public function get_post_from_task_id( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );

		if ( empty( $tasks ) ) {
			return null;
		}

		$task = $tasks[0];

		return $task->target_post_id ? \get_post( $task->target_post_id ) : null;
	}

	/**
	 * Get the dismissed post IDs.
	 *
	 * @return array
	 */
	protected function get_completed_post_ids() {
		if ( null !== $this->completed_post_ids ) {
			return $this->completed_post_ids;
		}

		$this->completed_post_ids = [];
		$tasks                    = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] );

		if ( ! empty( $tasks ) ) {
			foreach ( $tasks as $task ) {
				if ( 'trash' === $task->post_status ) {
					$this->completed_post_ids[] = $task->target_post_id;
				}
			}
		}

		return $this->completed_post_ids;
	}

	/**
	 * Exclude completed posts.
	 *
	 * @param array $exclude_post_ids The excluded post IDs.
	 * @return array
	 */
	public function exclude_completed_posts( $exclude_post_ids ) {
		return array_merge( $exclude_post_ids, $this->get_completed_post_ids() );
	}
}
