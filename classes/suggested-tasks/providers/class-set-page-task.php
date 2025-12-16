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
	protected $priority = 10;

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		// Register AJAX action for all page tasks.
		\add_action( 'wp_ajax_prpl_interactive_task_submit_set-page', [ __CLASS__, 'handle_interactive_task_specific_submit' ] );
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
