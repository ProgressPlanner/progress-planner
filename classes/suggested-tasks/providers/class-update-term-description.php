<?php
/**
 * Add task to update term description.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Tasks;
use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Description as Terms_Without_Description_Data_Collector;

/**
 * Add task to update term description.
 */
class Update_Term_Description extends Tasks {

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
	protected const PROVIDER_ID = 'update-term-description';

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
	 * The data collector class name.
	 *
	 * @var string
	 */
	protected const DATA_COLLECTOR_CLASS = Terms_Without_Description_Data_Collector::class;

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
	protected $priority = 'low';

	/**
	 * The completed term IDs.
	 *
	 * @var array|null
	 */
	protected $completed_term_ids = null;

	/**
	 * Initialize the task.
	 */
	public function init() {
		// Maybe remove tasks when term is deleted.
		\add_action( 'delete_term', [ $this, 'maybe_remove_irrelevant_tasks' ], 10, 5 );

		\add_filter( 'progress_planner_terms_without_description_exclude_term_ids', [ $this, 'exclude_completed_terms' ] );
	}

	/**
	 * Update the cache when a post is term is edited.
	 *
	 * @param int      $term         Term ID.
	 * @param int      $tt_id        Term taxonomy ID.
	 * @param string   $taxonomy     Taxonomy slug.
	 * @param \WP_Term $deleted_term Copy of the already-deleted term.
	 * @param array    $object_ids   List of term object IDs.
	 * @return void
	 */
	public function maybe_remove_irrelevant_tasks( $term, $tt_id, $taxonomy, $deleted_term, $object_ids ) {
		$pending_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] );

		if ( ! $pending_tasks ) {
			return;
		}

		foreach ( $pending_tasks as $task ) {
			if ( isset( $task['term_id'] ) && isset( $task['taxonomy'] ) ) {

				if ( (int) $task['term_id'] === (int) $deleted_term->term_id ) {
					\progress_planner()->get_suggested_tasks()->delete_recommendation( $task['ID'] );
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
		$term = \get_term( $task_data['term_id'], $task_data['taxonomy'] );
		return $term && ! \is_wp_error( $term ) ? \sprintf(
			/* translators: %s: The term name */
			\esc_html__( 'Write a description for term named "%s"', 'progress-planner' ),
			\esc_html( $term->name )
		) : '';
	}

	/**
	 * Get the description.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	public function get_description( $task_data = [] ) {
		$term = \get_term( $task_data['term_id'], $task_data['taxonomy'] );

		return $term && ! \is_wp_error( $term ) ? sprintf(
			/* translators: %1$s: The term name, %2$s <a href="https://prpl.fyi/taxonomy-terms-description" target="_blank">Read more</a> link */
			\esc_html__( 'Your "%1$s" archives probably show the description of that specific term. %2$s', 'progress-planner' ),
			$term->name,
			'<a href="https://prpl.fyi/taxonomy-terms-description" target="_blank" data-prpl_accessibility_text="' . \esc_attr__( 'Read more about the writing a description for taxonomy terms.', 'progress-planner' ) . '">' . \esc_html__( 'Read more', 'progress-planner' ) . '</a>'
		) : '';
	}

	/**
	 * Get the URL.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_url( $task_data = [] ) {
		$term = \get_term( $task_data['term_id'], $task_data['taxonomy'] );
		return $term && ! \is_wp_error( $term )
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

		// Terms was deleted.
		if ( ! $term ) {
			return true;
		}

		$term_description = trim( $term->description );

		return '' !== $term_description && '&nbsp;' !== $term_description;
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
				'term_id'  => $data['term_id'],
				'taxonomy' => $data['taxonomy'],
			]
		);

		if ( true === \progress_planner()->get_suggested_tasks()->was_task_completed( $task_id ) ) {
			return [];
		}

		$task_data = [
			'task_id'     => $task_id,
			'provider_id' => $this->get_provider_id(),
			'category'    => $this->get_provider_category(),
			'term_id'     => $data['term_id'],
			'taxonomy'    => $data['taxonomy'],
			'term_name'   => $data['name'],
			'date'        => \gmdate( 'YW' ),
			'post_title'  => $this->get_title( $data ),
			'description' => $this->get_description( $data ),
			'url'         => $this->get_url( $data ),
			'url_target'  => '_blank',
			'dismissable' => $this->is_dismissable(),
			'points'      => $this->get_points(),
		];

		$task_data = $this->modify_injection_task_data( $task_data );

		// Add the tasks to the pending tasks option, it will not add duplicates.
		$task_post = \progress_planner()->get_suggested_tasks()->get_post( $task_data['task_id'] );

		// Skip the task if it was already injected.
		if ( $task_post ) {
			return [];
		}

		return [ \progress_planner()->get_suggested_tasks()->add( $task_data ) ];
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

		$task_data = \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'task_id' => $task_id ] );

		if ( empty( $task_data ) ) {
			return [];
		}

		return [
			'task_id'     => $task_id,
			'provider_id' => $this->get_provider_id(),
			'post_title'  => $this->get_title( $task_data[0] ),
			'parent'      => $this->get_parent(),
			'priority'    => $this->get_priority(),
			'category'    => $this->get_provider_category(),
			'points'      => $this->get_points(),
			'dismissable' => $this->is_dismissable(),
			'url'         => $this->get_url( $task_data[0] ),
			'url_target'  => $this->get_url_target(),
			'description' => $this->get_description( $task_data[0] ),
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
		$tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'task_id' => $task_id ] );

		if ( empty( $tasks ) ) {
			return null;
		}

		$data = $tasks[0];

		if ( ! isset( $data['term_id'] ) || ! $data['term_id'] || ! isset( $data['taxonomy'] ) || ! $data['taxonomy'] ) {
			return null;
		}

		$term = \get_term( $data['term_id'], $data['taxonomy'] );
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
		$tasks                    = \progress_planner()->get_suggested_tasks()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] );

		if ( ! empty( $tasks ) ) {
			foreach ( $tasks as $task ) {
				if ( 'trash' === $task['post_status'] ) {
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
		return array_merge( $exclude_term_ids, $this->get_completed_term_ids() );
	}
}
