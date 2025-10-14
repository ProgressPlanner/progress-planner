<?php
/**
 * Add task to update term description.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

use Progress_Planner\Suggested_Tasks\Providers\Tasks_Interactive;
use Progress_Planner\Suggested_Tasks\Data_Collector\Terms_Without_Description as Terms_Without_Description_Data_Collector;

/**
 * Add task to update term description.
 */
class Update_Term_Description extends Tasks_Interactive {

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
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'update-term-description';

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
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/taxonomy-terms-description';

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
	protected $priority = 80;

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

		\add_action( 'wp_ajax_prpl_interactive_task_submit_update-term-description', [ $this, 'handle_interactive_task_submit' ] );
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
		$pending_tasks = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => $this->get_provider_id() ] );

		if ( ! $pending_tasks ) {
			return;
		}

		foreach ( $pending_tasks as $task ) {
			if ( $task->target_term_id && $task->target_taxonomy && (int) $task->target_term_id === (int) $deleted_term->term_id ) {
				\progress_planner()->get_suggested_tasks_db()->delete_recommendation( $task->ID );
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
		return $term && ! \is_wp_error( $term ) ? \sprintf(
			/* translators: %s: The term name */
			\esc_html__( 'Write a description for term named "%s"', 'progress-planner' ),
			\esc_html( $term->name )
		) : '';
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

		$term_description = \trim( $term->description );

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

		// Skip the task if it was already injected.
		if ( \progress_planner()->get_suggested_tasks_db()->get_post( $task_data['task_id'] ) ) {
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
		if ( ! isset( $data['meta']['prpl_task_id'] ) ) {
			return $actions;
		}

		$term = $this->get_term_from_task_id( $data['meta']['prpl_task_id'] );
		if ( ! $term ) {
			return $actions;
		}

		$task_data = [
			'termId'   => $term->term_id,
			'taxonomy' => $term->taxonomy,
			'termName' => $term->name,
		];

		$actions[] = [
			'priority' => 10,
			'html'     => '<a href="#" class="prpl-tooltip-action-text prpl-update-term-description-action" role="button" '
				. 'data-task-context="' . \esc_attr( \wp_json_encode( $task_data ) ) . '" '
				. 'onclick="event.preventDefault(); document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover(); this.dispatchEvent(new CustomEvent(\'prpl-interactive-task-action\', { bubbles: true, detail: JSON.parse(this.dataset.taskContext) }));">'
				. \esc_html__( 'Write description', 'progress-planner' ) . '</a>',
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
		\esc_html_e( 'Adding a description to your term helps search engines and visitors understand what content to expect.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		?>
		<div class="prpl-update-term-info" style="margin-bottom: 15px;">
			<p style="margin: 0 0 5px 0;">
				<strong><?php \esc_html_e( 'Term:', 'progress-planner' ); ?></strong>
				<span id="prpl-update-term-name"></span>
			</p>
			<p style="margin: 0 0 10px 0; font-size: 12px; color: #646970;">
				<span id="prpl-update-term-taxonomy"></span>
			</p>
		</div>
		<textarea
			name="description"
			id="prpl-term-description"
			rows="5"
			style="width: 100%; margin-bottom: 15px;"
			placeholder="<?php \esc_attr_e( 'Enter term description...', 'progress-planner' ); ?>"
		></textarea>
		<input type="hidden" name="term_id" id="prpl-update-term-id" value="">
		<input type="hidden" name="taxonomy" id="prpl-update-taxonomy" value="">
		<button type="submit" class="prpl-button prpl-button-primary" id="prpl-update-term-description-button">
			<?php \esc_html_e( 'Save description', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit for term description update.
	 *
	 * @return void
	 */
	public function handle_interactive_task_submit() {
		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( static::CAPABILITY ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to update terms.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['term_id'] ) || ! isset( $_POST['taxonomy'] ) || ! isset( $_POST['description'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing term information.', 'progress-planner' ) ] );
		}

		$term_id     = \absint( \wp_unslash( $_POST['term_id'] ) );
		$taxonomy    = \sanitize_text_field( \wp_unslash( $_POST['taxonomy'] ) );
		$description = \wp_kses_post( \wp_unslash( $_POST['description'] ) );

		// Verify the term exists.
		$term = \get_term( $term_id, $taxonomy );
		if ( ! $term || \is_wp_error( $term ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Term not found.', 'progress-planner' ) ] );
		}

		// Update the term description.
		$result = \wp_update_term(
			$term_id,
			$taxonomy,
			[
				'description' => $description,
			]
		);

		if ( \is_wp_error( $result ) ) {
			\wp_send_json_error( [ 'message' => $result->get_error_message() ] );
		}

		\wp_send_json_success( [ 'message' => \esc_html__( 'Term description updated successfully.', 'progress-planner' ) ] );
	}
}
