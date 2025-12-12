<?php
/**
 * Add tasks for permalink structure.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for permalink structure.
 */
class Permalink_Structure extends Tasks_Interactive {

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = true;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'core-permalink-structure';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'core-permalink-structure';

	/**
	 * The external link URL.
	 *
	 * @var string
	 */
	protected const EXTERNAL_LINK_URL = 'https://prpl.fyi/change-default-permalink-structure';

	/**
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = 3;

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_core-permalink-structure', [ $this, 'handle_interactive_task_specific_submit' ] );
		\add_action( 'init', [ $this, 'maybe_flush_rewrite_rules' ] );
	}

	/**
	 * Maybe flush rewrite rules.
	 *
	 * Checks for a transient flag and flushes rewrite rules if needed.
	 * This is more performant than flushing immediately during the AJAX request.
	 *
	 * @return void
	 */
	public function maybe_flush_rewrite_rules() {
		if ( \get_transient( 'prpl_flush_rewrite_rules' ) ) {
			\flush_rewrite_rules();
			\delete_transient( 'prpl_flush_rewrite_rules' );
		}
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-permalink.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		$icon_el = 'label[for="permalink-input-month-name"], label[for="permalink-input-post-name"]';

		// If the task is completed, we want to add icon element only to the selected option (not both).
		if ( $this->is_task_completed() ) {
			$permalink_structure = \get_option( 'permalink_structure' );

			if ( '/%year%/%monthnum%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%postname%/' === $permalink_structure ) {
				$icon_el = 'label[for="permalink-input-month-name"]';
			}

			if ( '/%postname%/' === $permalink_structure || '/index.php/%postname%/' === $permalink_structure ) {
				$icon_el = 'label[for="permalink-input-post-name"]';
			}
		}

		return [
			'hook'   => 'options-permalink.php',
			'iconEl' => $icon_el,
		];
	}

	/**
	 * Get the title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set permalink structure', 'progress-planner' );
	}

	/**
	 * Check if the task condition is satisfied.
	 * (bool) true means that the task condition is satisfied, meaning that we don't need to add the task or task was completed.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$permalink_structure = \get_option( 'permalink_structure' );
		return '/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure || '/index.php/%year%/%monthnum%/%day%/%postname%/' === $permalink_structure;
	}

	// Popover rendering methods removed - now handled by React PermalinkStructurePopover component.

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change core permalink settings.
	 * The $_POST data is expected to be:
	 * - value: (mixed) The value to update the setting to.
	 * - nonce: (string) The nonce.
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

		if ( ! isset( $_POST['value'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		$permalink_structure = \trim( \sanitize_text_field( \wp_unslash( $_POST['value'] ) ) );

		if ( empty( $permalink_structure ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid permalink structure.', 'progress-planner' ) ] );
		}

		// Update the permalink structure.
		\update_option( 'permalink_structure', $permalink_structure );

		// Set a transient to flush rewrite rules on the next page load.
		// This is more performant than flushing immediately during the AJAX request.
		\set_transient( 'prpl_flush_rewrite_rules', 1, HOUR_IN_SECONDS );

		\wp_send_json_success( [ 'message' => \esc_html__( 'Permalink structure updated.', 'progress-planner' ) ] );
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
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html__( 'Select permalink structure', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
