<?php
/**
 * Add task for setting the About page.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
abstract class Set_Page_Task extends Tasks_Interactive {

	/**
	 * The page name.
	 *
	 * @var string
	 */
	protected const PAGE_NAME = '';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 3;

	/**
	 * Whether the generic script has been enqueued.
	 *
	 * @var bool
	 */
	private static $script_enqueued = false;

	/**
	 * Whether the AJAX action has been registered.
	 *
	 * @var bool
	 */
	private static $ajax_action_registered = false;

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		// Register AJAX action only once for all page tasks.
		if ( ! self::$ajax_action_registered ) {
			\add_action( 'wp_ajax_prpl_interactive_task_submit_set-page', [ __CLASS__, 'handle_interactive_task_specific_submit' ] );
			self::$ajax_action_registered = true;
		}
	}

	/**
	 * Enqueue the scripts.
	 *
	 * Override parent method to ensure the generic set-page.js is only enqueued once.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {

		// Don't enqueue the script if the user is not at least an editor, since we dont want to enqueue scripts on WP Dashboard page.
		if ( ! \current_user_can( 'edit_others_posts' ) ) {
			return;
		}

		// Enqueue the script only on Progress Planner and WP dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $hook && 'index.php' !== $hook ) {
			return;
		}

		// Enqueue the generic set-page script only once for all page tasks.
		if ( ! self::$script_enqueued ) {
			\progress_planner()->get_admin__enqueue()->enqueue_script(
				'progress-planner/recommendations/set-page',
				$this->get_enqueue_data()
			);
			self::$script_enqueued = true;
		}
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$pages = \progress_planner()->get_admin__page_settings()->get_settings();

		if ( ! isset( $pages[ static::PAGE_NAME ] ) ) {
			return false;
		}

		return 'no' === $pages[ static::PAGE_NAME ]['isset'];
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$pages = \progress_planner()->get_admin__page_settings()->get_settings();
		$page  = $pages[ static::PAGE_NAME ];

		\progress_planner()->the_view(
			'setting/page-select.php',
			[
				'prpl_setting' => $page,
				'context'      => 'popover',
			]
		);
		$this->print_submit_button( \__( 'Set page', 'progress-planner' ) );
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change core permalink settings.
	 * The $_POST data is expected to be:
	 * - have_page: (string) The value to update the setting to.
	 * - id: (int) The ID of the page to update.
	 * - task_id: (string) The task ID (e.g., "set-page-about") to identify the page type.
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public static function handle_interactive_task_specific_submit() {

		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to update settings.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['have_page'] ) || ! isset( $_POST['task_id'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		$have_page = \trim( \sanitize_text_field( \wp_unslash( $_POST['have_page'] ) ) );
		$id        = isset( $_POST['id'] ) ? (int) \trim( \sanitize_text_field( \wp_unslash( $_POST['id'] ) ) ) : 0;
		$task_id   = \trim( \sanitize_text_field( \wp_unslash( $_POST['task_id'] ) ) );

		if ( empty( $have_page ) || empty( $task_id ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid page value.', 'progress-planner' ) ] );
		}

		// Extract page name from task ID (e.g., "set-page-about" -> "about").
		$page_name = \str_replace( 'set-page-', '', $task_id );
		if ( empty( $page_name ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid task ID.', 'progress-planner' ) ] );
		}

		// Validate page name against allowed page types.
		$pages = \progress_planner()->get_admin__page_settings()->get_settings();
		if ( ! isset( $pages[ $page_name ] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid page name.', 'progress-planner' ) ] );
		}

		// Update the page value.
		\progress_planner()->get_admin__page_settings()->set_page_values(
			[
				$page_name => [
					'id'        => (int) $id,
					'have_page' => $have_page, // yes, no, not-applicable.
				],
			]
		);

		\wp_send_json_success( [ 'message' => \esc_html__( 'Page updated.', 'progress-planner' ) ] );
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
