<?php
/**
 * Add task to rename the Uncategorized category.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Tasks_Interactive;
use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Posts as Terms_Without_Posts_Data_Collector;

/**
 * Add task to remove terms without posts.
 */
class Remove_Terms_Without_Posts extends Tasks_Interactive {

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
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'remove-terms-without-posts';

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
	 * Initialize the task.
	 */
	public function init() {
		\add_action( 'set_object_terms', [ $this, 'maybe_remove_irrelevant_tasks' ], 10, 6 );
		\add_filter( 'progress_planner_terms_without_posts_exclude_term_ids', [ $this, 'exclude_completed_terms' ] );

		\add_action( 'wp_ajax_prpl_interactive_task_submit_remove-terms-without-posts', [ $this, 'handle_interactive_task_submit' ] );
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

				// If the term is NULL it means the term was deleted, but we want to keep the task (and award a point).
				if ( ! $term ) {
					continue;
				}

				// If the taxonomy is not found the $term will be a WP_Error object.
				if ( \is_wp_error( $term ) || $term->count > self::MIN_POSTS ) {
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

		if ( ! isset( $task_data['target_term_id'] ) || ! isset( $task_data['target_taxonomy'] ) ) {
			return '';
		}

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

		if ( ! isset( $task_data['target_term_id'] ) || ! isset( $task_data['target_taxonomy'] ) ) {
			return '';
		}

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
		$term = $this->get_term_from_task_id( $data['meta']['prpl_task_id'] );

		$task_data = [
			'target_term_id'   => $term->term_id ?? '',
			'target_taxonomy'  => $term->taxonomy ?? '',
			'target_term_name' => $term->name ?? '',
		];

		$task_details = $this->get_task_details( $task_data );

		$actions[] = [
			'priority' => 10,
			'html'     => sprintf(
				'<a href="#" class="prpl-tooltip-action-text prpl-delete-term-action" role="button"
					data-task-context=\'%s\'
					onclick="event.preventDefault(); document.getElementById(\'prpl-popover-%s\')?.showPopover(); this.dispatchEvent(new CustomEvent(\'prpl-interactive-task-action\', { bubbles: true, detail: JSON.parse(this.dataset.taskContext) }));">
					%s
				</a>',
				htmlspecialchars(
					wp_json_encode(
						[
							'post_title'       => $task_details['post_title'],
							'target_term_id'   => $task_data['target_term_id'],
							'target_taxonomy'  => $task_data['target_taxonomy'],
							'target_term_name' => $task_data['target_term_name'],
						]
					),
					ENT_QUOTES,
					'UTF-8'
				),
				\esc_attr( static::POPOVER_ID ),
				\esc_html__( 'Delete term', 'progress-planner' )
			),
		];

		return $actions;
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Deleting this empty term will help keep your site organized. This action cannot be undone.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<div class="prpl-delete-term-info" style="margin-bottom: 15px; padding: 10px; background: #f0f0f1; border-radius: 4px;">
			<p style="margin: 0;">
				<strong><?php \esc_html_e( 'Term:', 'progress-planner' ); ?></strong>
				<span id="prpl-delete-term-name"></span>
			</p>
			<p style="margin: 5px 0 0 0; font-size: 12px; color: #646970;">
				<span id="prpl-delete-term-taxonomy"></span>
			</p>
		</div>
		<input type="hidden" name="term_id" id="prpl-delete-term-id" value="">
		<input type="hidden" name="taxonomy" id="prpl-delete-taxonomy" value="">
		<button type="submit" class="prpl-button prpl-button-primary" id="prpl-delete-term-button">
			<?php \esc_html_e( 'Delete term', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit for term deletion.
	 *
	 * @return void
	 */
	public function handle_interactive_task_submit() {
		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( static::CAPABILITY ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to delete terms.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['term_id'] ) || ! isset( $_POST['taxonomy'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing term information.', 'progress-planner' ) ] );
		}

		$term_id  = \absint( \wp_unslash( $_POST['term_id'] ) );
		$taxonomy = \sanitize_text_field( \wp_unslash( $_POST['taxonomy'] ) );

		// Verify the term exists.
		$term = \get_term( $term_id, $taxonomy );
		if ( ! $term || \is_wp_error( $term ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Term not found.', 'progress-planner' ) ] );
		}

		// Delete the term.
		$result = \wp_delete_term( $term_id, $taxonomy );

		if ( \is_wp_error( $result ) ) {
			\wp_send_json_error( [ 'message' => $result->get_error_message() ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Term deleted successfully.', 'progress-planner' ) ] );
	}
}
