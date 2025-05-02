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
	 * The data collector.
	 *
	 * @var \Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Posts
	 */
	protected $data_collector;

	/**
	 * The minimum number of posts.
	 *
	 * @var int
	 */
	protected const MIN_POSTS = 1;

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
		$this->data_collector = new Terms_Without_Posts_Data_Collector();

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
		$pending_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', $this->get_provider_id() );

		if ( ! $pending_tasks ) {
			return;
		}

		foreach ( $pending_tasks as $task ) {
			if ( isset( $task['term_id'] ) && isset( $task['taxonomy'] ) ) {
				$term = \get_term( $task['term_id'], $task['taxonomy'] );

				if ( \is_wp_error( $term ) || ! $term || $term->count > self::MIN_POSTS ) {
					\progress_planner()->get_suggested_tasks()->delete_task( $task['task_id'] );
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
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_title( $task_id = '' ) {
		if ( ! $task_id ) {
			return '';
		}

		// Get the task data.
		$task_data = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $task_id );

		// We don't want to link if the term was deleted.
		if ( empty( $task_data ) || ! $task_data[0] ) {
			return '';
		}

		return \sprintf(
			/* translators: %s: The term name */
			\esc_html__( 'Remove %s term', 'progress-planner' ),
			\esc_html( $task_data[0]['term_name'] )
		);
	}

	/**
	 * Get the description.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	public function get_description( $task_id = '' ) {
		$term = $this->get_term_from_task_id( $task_id );

		if ( ! $term ) {
			return '';
		}

		return sprintf(
			/* translators: %1$s: The term name, %2$s <a href="https://prpl.fyi/remove-term" target="_blank">Read more</a> link */
			\esc_html__( 'The %1$s term has one or less posts associated with it, we recommend removing it. %2$s', 'progress-planner' ),
			$term->name,
			'<a href="https://prpl.fyi/remove-term" target="_blank">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
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
		$term = $this->get_term_from_task_id( $task_id );

		// We don't want to link if the term was deleted.
		if ( ! $term ) {
			return '';
		}

		return \admin_url( 'term.php?taxonomy=' . $term->taxonomy . '&tag_ID=' . $term->term_id );
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
	 * @return bool
	 */
	protected function is_specific_task_completed( $task_id ) {
		$term = $this->get_term_from_task_id( $task_id );

		// Terms was deleted.
		if ( ! $term ) {
			return true;
		}

		return self::MIN_POSTS < $term->count;
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

		$data = $this->data_collector->collect();

		return [
			[
				'task_id'     => $this->get_task_id(
					[
						'term_id'  => $data['term_id'],
						'taxonomy' => $data['taxonomy'],
					]
				),
				'provider_id' => $this->get_provider_id(),
				'category'    => $this->get_provider_category(),
				'term_id'     => $data['term_id'],
				'taxonomy'    => $data['taxonomy'],
				'term_name'   => $data['name'],
				'date'        => \gmdate( 'YW' ),
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
	 * Get the term from the task ID.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return \WP_Term|null
	 */
	public function get_term_from_task_id( $task_id ) {
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'task_id', $task_id );

		if ( empty( $tasks ) ) {
			return null;
		}

		$data = $tasks[0];

		if ( ! isset( $data['term_id'] ) || ! $data['term_id'] || ! isset( $data['taxonomy'] ) || ! $data['taxonomy'] ) {
			return null;
		}

		$term = \get_term( $data['term_id'], $data['taxonomy'] );

		if ( is_wp_error( $term ) ) {
			return null;
		}

		return $term;
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
		$tasks                    = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'provider_id', $this->get_provider_id() );

		if ( ! empty( $tasks ) ) {
			foreach ( $tasks as $task ) {
				if ( isset( $task['status'] ) && 'completed' === $task['status'] ) {
					$this->completed_term_ids[] = $task['term_id'];
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
		$exclude_term_ids = array_merge( $exclude_term_ids, $this->get_completed_term_ids() );

		return $exclude_term_ids;
	}
}
