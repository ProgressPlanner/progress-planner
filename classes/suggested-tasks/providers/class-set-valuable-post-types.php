<?php
/**
 * Add tasks for set valuable post types.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for set valuable post types.
 */
class Set_Valuable_Post_Types extends Tasks_Interactive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-valuable-post-types';

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	public const POPOVER_ID = 'set-valuable-post-types';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/valuable-content';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 70;

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_set-valuable-post-types', [ $this, 'handle_interactive_task_specific_submit' ] );

		// On late init hook we need to check if the public post types are changed.
		\add_action( 'init', [ $this, 'check_public_post_types' ], PHP_INT_MAX - 1 );
	}

	/**
	 * Check if the public post types are changed.
	 *
	 * @return void
	 */
	public function check_public_post_types() {
		$previosly_set_public_post_types = \array_unique( \get_option( 'progress_planner_public_post_types', [] ) );
		$public_post_types               = \array_unique( \progress_planner()->get_settings()->get_public_post_types() );

		// Sort the public post types.
		\sort( $previosly_set_public_post_types );
		\sort( $public_post_types );

		// Compare the previously set public post types with the current public post types.
		if ( $previosly_set_public_post_types === $public_post_types ) {
			return;
		}

		// Update the previously set public post types.
		\update_option( 'progress_planner_public_post_types', $public_post_types );

		// Exit if post type was removed, or it is not public anymore, since the user will not to able to make different selection.
		if ( \count( $public_post_types ) < \count( $previosly_set_public_post_types ) ) {
			return;
		}

		// If we're here that means that there is new public post type.

		// Check if the task exists, if it does and it is published do nothing.
		$task = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => static::PROVIDER_ID ] );
		if ( ! empty( $task ) && 'publish' === $task[0]->post_status ) {
			return;
		}

		// If it is trashed, change it's status to publish.
		if ( ! empty( $task ) && 'trash' === $task[0]->post_status ) {
			\wp_update_post(
				[
					'ID'          => $task[0]->ID,
					'post_status' => 'publish',
				]
			);
			return;
		}

		// If we're here then we need to add it.
		\progress_planner()->get_suggested_tasks_db()->add( $this->modify_injection_task_data( $this->get_task_details() ) );
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set valuable content types', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 * We add tasks only to users who have upgraded from v1.2 or have 'include_post_types' option empty.
	 * Reason being that this option was migrated,
	 * but it could be missed, and post type selection should be revisited.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => static::PROVIDER_ID,
			]
		);
		if ( ! empty( $activity ) ) {
			return false;
		}

		// Upgraded from <= 1.2?
		$upgraded = (bool) \get_option( 'progress_planner_set_valuable_post_types', false );

		// Include post types option empty?
		$include_post_types = \progress_planner()->get_settings()->get( 'include_post_types', [] );

		// Add the task only to users who have upgraded from v1.2 or have 'include_post_types' option empty.
		return ( true === $upgraded || empty( $include_post_types ) );
	}

	/**
	 * Check if the task is completed.
	 * We are checking the 'is_task_completed' method only if the task was added previously.
	 * If it was and the option is not set it means that user has completed the task.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		return false === \get_option( 'progress_planner_set_valuable_post_types', false );
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * @return void
	 */
	public function handle_interactive_task_specific_submit() {
		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to update settings.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['prpl-post-types-include'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing post types.', 'progress-planner' ) ] );
		}

		$post_types = \wp_unslash( $_POST['prpl-post-types-include'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- array elements are sanitized below.
		$post_types = \explode( ',', $post_types );
		$post_types = \array_map( 'sanitize_text_field', $post_types );

		\progress_planner()->get_admin__page_settings()->save_post_types( $post_types );

		\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'You\'re in control of what counts as valuable content. We\'ll track and reward activity only for the post types you select here.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$prpl_saved_settings = \progress_planner()->get_settings()->get_post_types_names();
		$prpl_post_types     = \progress_planner()->get_settings()->get_public_post_types();

		// Early exit if there are no public post types.
		if ( empty( $prpl_post_types ) ) {
			return;
		}
		?>
		<div class="prpl-post-types-selection">
			<?php foreach ( $prpl_post_types as $prpl_post_type ) : ?>
			<label>
				<input
					type="checkbox"
					name="prpl-post-types-include[]"
					value="<?php echo \esc_attr( $prpl_post_type ); ?>"
					<?php \checked( \in_array( $prpl_post_type, $prpl_saved_settings, true ) ); ?>
				/>
				<?php echo \esc_html( \get_post_type_object( $prpl_post_type )->labels->name ); // @phpstan-ignore-line property.nonObject ?>
			</label>
			<?php endforeach; ?>
		</div>
		<?php
		$this->print_submit_button( \__( 'Set', 'progress-planner' ) );
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Set', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
