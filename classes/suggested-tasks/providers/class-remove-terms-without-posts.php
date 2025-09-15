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
	protected $priority = 60;

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
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/remove-empty-taxonomy';

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
		foreach ( \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] ) as $task ) {
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
	 * Get the title.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_title_with_data( $task_data = [] ) {
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
	 * Get the URL.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return string
	 */
	protected function get_url_with_data( $task_data = [] ) {
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

		$data    = $this->transform_collector_data( $this->get_data_collector()->collect() );
		$task_id = $this->get_task_id(
			[
				'target_term_id'  => $data['target_term_id'],
				'target_taxonomy' => $data['target_taxonomy'],
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
		return $task_post ? [] : [ \progress_planner()->get_suggested_tasks_db()->add( $task_data ) ];
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

		$task_data['target_term_id']   = $data['target_term_id'];
		$task_data['target_taxonomy']  = $data['target_taxonomy'];
		$task_data['target_term_name'] = $data['target_term_name'];

		return $task_data;
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

		foreach ( \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] ) as $task ) {
			if ( 'trash' === $task->post_status ) {
				$this->completed_term_ids[] = $task->target_term_id;
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
		return \array_merge( $exclude_term_ids, $this->get_completed_term_ids() );
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
		$actions[] = [
			'priority' => 10,
			'html'     => '<a class="prpl-tooltip-action-text" href="' . \admin_url( 'options-permalink.php' ) . '" target="_self">' . \esc_html__( 'Go to the "Taxonomies" page', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
