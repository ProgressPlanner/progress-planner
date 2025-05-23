<?php
/**
 * Add task to rename the Uncategorized category.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Tasks;
use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Posts as Terms_Without_Posts_Data_Collector;

/**
 * Add task to remove terms without posts.
 */
class Remove_Terms_Without_Posts extends Tasks {

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
	protected const PROVIDER_ID = 'remove-terms-without-posts';

	/**
	 * The provider category.
	 *
	 * @var string
	 */
	protected const CATEGORY = 'content-update';

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'edit_others_posts';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * The task priority.
	 *
	 * @var string
	 */
	protected $priority = 'medium';

	/**
	 * The minimum number of posts.
	 *
	 * @var int
	 */
	protected const MIN_POSTS = 1;

	/**
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Terms_Without_Posts_Data_Collector::class;

	/**
	 * The completed term IDs.
	 *
	 * @var array|null
	 */
	protected $completed_term_ids = null;

	/**
	 * Constructor.
	 */
	public function __construct() {
		\add_filter( 'progress_planner_terms_without_posts_exclude_term_ids', [ $this, 'exclude_completed_terms' ] );
	}

	/**
	 * Initialize the task.
	 */
	public function init() {
		\add_action( 'set_object_terms', [ $this, 'maybe_remove_irrelevant_tasks' ], 10, 6 );
	}

	/**
	 * Maybe remove irrelevant tasks.
	 *
	 * @param int    $object_id The object ID.
	 * @param array  $terms The terms.
	 * @param array  $tt_ids The term taxonomy IDs.
	 * @param string $taxonomy The taxonomy.
	 * @param bool   $append Whether to append the terms.
	 * @param array  $old_tt_ids The old term taxonomy IDs.
	 *
	 * @return void
	 */
	public function maybe_remove_irrelevant_tasks( $object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids ) {
		$pending_tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] );

		if ( ! $pending_tasks ) {
			return;
		}

		foreach ( $pending_tasks as $task ) {
			/**
			 * The task post object.
			 *
			 * @var \Progress_Planner\Suggested_Tasks\Task $task
			 */
			if ( $task->target_term_id && $task->target_taxonomy ) {
				$term = \get_term( $task->target_term_id, $task->target_taxonomy );

				if ( \is_wp_error( $term ) || ! $term || $term->count > self::MIN_POSTS ) {
					\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
				}
			}
		}
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
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_title( $task_data = [] ) {
		$term = \get_term( $task_data['target_term_id'], $task_data['target_taxonomy'] );
		return ( $term && ! \is_wp_error( $term ) )
			? \sprintf(
				/* translators: %s: The term name */
				\esc_html__( 'Remove term named "%s"', 'progress-planner' ),
				\esc_html( $term->name )
			)
			: '';
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_description( $task_data = [] ) {
		$term = \get_term( $task_data['target_term_id'], $task_data['target_taxonomy'] );
		return ( $term && ! \is_wp_error( $term ) )
			? sprintf(
				/* translators: %1$s: The term name, %2$s <a href="https://prpl.fyi/remove-empty-taxonomy" target="_blank">Read more</a> link */
				\esc_html__( 'The "%1$s" term has one or less posts associated with it, we recommend removing it. %2$s', 'progress-planner' ),
				$term->name,
				'<a href="https://prpl.fyi/remove-empty-taxonomy" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the removing the empty terms', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
			)
			: '';
	}

	/**
	 * Get the URL.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_url( $task_data = [] ) {
		$term = \get_term( $task_data['target_term_id'], $task_data['target_taxonomy'] );
		return ( $term && ! \is_wp_error( $term ) )
			? \admin_url( 'term.php?taxonomy=' . $term->taxonomy . '&tag_ID=' . $term->term_id )
			: '';
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
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$term = $this->get_term_from_task_id( $task_id );
		return $term ? self::MIN_POSTS < $term->count : true;
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
				'target_term_id'   => $data['term_id'],
				'target_taxonomy'  => $data['taxonomy'],
				'target_term_name' => $data['name'],
			]
		);
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

		$data    = $this->get_data_collector()->collect();
		$task_id = $this->get_task_id(
			[
				'term_id'  => $data['term_id'],
				'taxonomy' => $data['taxonomy'],
			]
		);

		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
			return [];
		}

		// Transform the data to match the task data structure.
		$data = $this->transform_collector_data( $data );

		$task_data = [
			'task_id'          => $task_id,
			'provider_id'      => $this->get_provider_id(),
			'category'         => $this->get_provider_category(),
			'target_term_id'   => $data['target_term_id'],
			'target_taxonomy'  => $data['target_taxonomy'],
			'target_term_name' => $data['target_term_name'],
			'date'             => \gmdate( 'YW' ),
			'post_title'       => $this->get_title( $data ),
			'description'      => $this->get_description( $data ),
			'url'              => $this->get_url( $data ),
			'url_target'       => '_blank',
			'dismissable'      => $this->is_dismissable(),
			'snoozable'        => $this->is_snoozable,
			'points'           => $this->get_points(),
		];

		$task_data = $this->modify_injection_task_data( $task_data );

		// Add the tasks to the pending tasks option, it will not add duplicates.
		$task_post = \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] );

		// Skip the task if it was already injected.
		if ( $task_post ) {
			return [];
		}

		return [ \progress_planner()->get_suggested_tasks_db()->add( $task_data ) ];
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
			'task_id'     => $task_id,
			'provider_id' => $this->get_provider_id(),
			'post_title'  => $this->get_title( $tasks[0]->get_data() ),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'snoozable'   => $this->is_snoozable,
			'url'         => $this->get_url( $tasks[0]->get_data() ),
			'url_target'  => $this->get_url_target(),
			'description' => $this->get_description( $tasks[0]->get_data() ),
		];
	}

	/**
	 * Get the term from the task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \WP_Term|null
	 */
	public function get_term_from_task_id( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'task_id' => $task_id ] );

		if ( empty( $tasks ) ) {
			return null;
		}

		$task = $tasks[0];

		if ( ! $task->target_term_id || ! $task->target_taxonomy ) {
			return null;
		}

		$term = \get_term( $task->target_term_id, $task->target_taxonomy );
		return $term && ! \is_wp_error( $term ) ? $term : null;
	}

	/**
	 * Get the dismissed term IDs.
	 *
	 * @return array
	 */
	protected function get_completed_term_ids() {
		if ( null !== $this->completed_term_ids ) {
			return $this->completed_term_ids;
		}

		$this->completed_term_ids = [];
		$tasks                    = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] );

		if ( ! empty( $tasks ) ) {
			foreach ( $tasks as $task ) {
				if ( 'trash' === $task->post_status ) {
					$this->completed_term_ids[] = $task->target_term_id;
				}
			}
		}

		return $this->completed_term_ids;
	}

	/**
	 * Exclude completed terms.
	 *
	 * @param array $exclude_term_ids The excluded term IDs.
	 * @return array
	 */
	public function exclude_completed_terms( $exclude_term_ids ) {
		return array_merge( $exclude_term_ids, $this->get_completed_term_ids() );
	}
}
