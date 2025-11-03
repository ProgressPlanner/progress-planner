<?php
/**
 * Add tasks for settings saved.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for settings saved.
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
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'admin.php?page=progress-planner-settings' );
	}

	/**
	 * Initialize the task provider.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'progress_planner_settings_form_options_stored', [ $this, 'remove_upgrade_option' ] );
		\add_action( 'wp_ajax_prpl_interactive_task_submit_set-valuable-post-types', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Remove the upgrade option.
	 *
	 * @return void
	 */
	public function remove_upgrade_option() {
		if ( true === (bool) \get_option( 'progress_planner_set_valuable_post_types', false ) ) {
			\delete_option( 'progress_planner_set_valuable_post_types' );
		}
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
	 * We add tasks only to users who have have completed "Fill the settings page" task
	 * and have upgraded from v1.2 or have 'include_post_types' option empty.
	 * Reason being that this option was migrated,
	 * but it could be missed, and post type selection should be revisited.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$saved_posts = \progress_planner()->get_suggested_tasks_db()->get_tasks_by( [ 'provider_id' => 'settings-saved' ] );
		if ( empty( $saved_posts ) ) {
			return false;
		}

		// Is the task trashed?
		$post_trashed = 'trash' === $saved_posts[0]->post_status;

		// Upgraded from <= 1.2?
		$upgraded = (bool) \get_option( 'progress_planner_set_valuable_post_types', false );

		// Include post types option empty?
		$include_post_types = \progress_planner()->get_settings()->get( 'include_post_types', [] );

		// Add the task only to users who have completed the "Settings saved" task and have upgraded from v1.2 or have 'include_post_types' option empty.
		return $post_trashed && ( true === $upgraded || empty( $include_post_types ) );
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
		$post_types = explode( ',', $post_types );
		$post_types = array_map( 'sanitize_text_field', $post_types );

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
