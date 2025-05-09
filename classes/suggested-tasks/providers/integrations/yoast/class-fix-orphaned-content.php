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
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Yoast_Orphaned_Content
	 */
	protected $data_collector;

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
	 * Constructor.
	 */
	public function __construct() {
		$this->data_collector = new Yoast_Orphaned_Content();
	}

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_filter( 'progress_planner_yoast_orphaned_content_exclude_post_ids', [ $this, 'exclude_completed_posts' ] );
	}

	/**
	 * Get the task ID.
	 *
	 * @param array $data Optional data to include in the task ID.
	 * @return string
	 */
	public function get_task_id( $data = [] ) {
		$parts = [ $this->get_provider_id() ];

		// Add optional data parts if provided.
		if ( ! empty( $data ) ) {
			foreach ( $data as $value ) {
				$parts[] = $value;
			}
		}

		return implode( '-', $parts );
	}

	/**
	 * Get the title.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_title( $task_id = '' ) {
		// Get the task data.
		$task_data = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $task_id );

		// We don't want to link if the term was deleted.
		if ( empty( $task_data ) || ! $task_data[0] ) {
			return '';
		}

		return sprintf(
			/* translators: %s: Post title. */
			\esc_html__( 'Yoast SEO: add internal links to article "%s"!', 'progress-planner' ),
			\esc_html( $task_data[0]['post_title'] )
		);
	}

	/**
	 * Get the description.
	 *
	 * @param string $task_id The task ID.
	 * @return string
	 */
	public function get_description( $task_id = '' ) {
		return sprintf(
			/* translators: %s: "Read more" link. */
			\esc_html__( 'Yoast SEO detected that this article has no links pointing to it. %s.', 'progress-planner' ),
			'<a href="https://prpl.fyi/fix-orphaned-content" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the fixing the orphaned content.', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		);
	}

	/**
	 * Get the URL.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_url( $task_id = '' ) {
		$post = $this->get_post_from_task_id( $task_id );

		// We don't want to link if the post was deleted.
		if ( ! $post ) {
			return '';
		}

		return 'https://prpl.fyi/fix-orphaned-content';
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		return ! empty( $this->data_collector->collect() );
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
	 * Get an array of tasks to inject.
	 *
	 * @return array
	 */
	public function get_tasks_to_inject() {

		if (
			true === $this->is_task_snoozed() ||
			! $this->should_add_task() // No need to add the task.
		) {
			return [];
		}

		$data    = $this->data_collector->collect();
		$task_id = $this->get_task_id(
			[
				'post_id' => $data['post_id'],
			]
		);

		// When we have data, check if task was completed.
		if ( true === \progress_planner()->get_cpt_recommendations()->was_task_completed( $task_id ) ) {
			return [];
		}

		return [
			[
				'task_id'     => $task_id,
				'provider_id' => $this->get_provider_id(),
				'category'    => $this->get_provider_category(),
				'post_id'     => $data['post_id'],
				'post_title'  => $data['post_title'],
			],
		];
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
	 * Get the dismissed post IDs.
	 *
	 * @return array
	 */
	protected function get_completed_post_ids() {

		if ( null !== $this->completed_post_ids ) {
			return $this->completed_post_ids;
		}

		$this->completed_post_ids = [];
		$tasks                    = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', $this->get_provider_id() );

		if ( ! empty( $tasks ) ) {
			foreach ( $tasks as $task ) {
				if ( isset( $task['status'] ) && 'completed' === $task['status'] ) {
					$this->completed_post_ids[] = $task['post_id'];
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
