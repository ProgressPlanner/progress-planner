<?php
/**
 * Abstract class for a task provider.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add tasks for content updates.
 */
abstract class Tasks_Interactive extends Tasks {

	/**
	 * The popover ID for interactive tasks.
	 *
	 * @var string
	 */
	const POPOVER_ID = '';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		// Popover rendering is now handled by React components.
		// No need to register popover rendering hooks.
		\add_action( 'wp_ajax_prpl_interactive_task_submit', [ $this, 'handle_interactive_task_submit' ] );
	}

	/**
	 * Get the task details.
	 *
	 * @param array $task_data The task data.
	 *
	 * @return array
	 */
	public function get_task_details( $task_data = [] ) {
		$task_details               = parent::get_task_details( $task_data );
		$task_details['popover_id'] = 'prpl-popover-' . static::POPOVER_ID;

		return $task_details;
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - setting: (string) The setting to update.
	 * - value: (mixed) The value to update the setting to.
	 * - setting_path: (array) The path to the setting to update.
	 *                         Use an empty array if the setting is not nested.
	 *                         If the value is nested, use an array of keys.
	 *                         Example: [ 'a', 'b', 'c' ] will update the value of $option['a']['b']['c'].
	 * - nonce: (string) The nonce.
	 *
	 * @return void
	 */
	public function handle_interactive_task_submit() {

		// Check if the user has the necessary capabilities.
		if ( ! \current_user_can( 'manage_options' ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'You do not have permission to update settings.', 'progress-planner' ) ] );
		}

		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['setting'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing setting.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['value'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['setting_path'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing setting path.', 'progress-planner' ) ] );
		}

		$setting      = \sanitize_text_field( \wp_unslash( $_POST['setting'] ) );
		$value        = \sanitize_text_field( \wp_unslash( $_POST['value'] ) );
		$setting_path = \json_decode( \sanitize_text_field( \wp_unslash( $_POST['setting_path'] ) ), true );

		// Whitelist allowed options to prevent arbitrary options update.
		// This prevents privilege escalation by restricting which options can be updated.
		$allowed_options = $this->get_allowed_interactive_options();

		if ( ! \in_array( $setting, $allowed_options, true ) ) {
			\wp_send_json_error(
				[
					'message' => \esc_html__( 'Invalid setting. This option cannot be updated through interactive tasks.', 'progress-planner' ),
				]
			);
		}

		if ( ! empty( $setting_path ) ) {
			$setting_value = \get_option( $setting );
			\_wp_array_set( $setting_value, $setting_path, $value );
			$updated = \update_option( $setting, $setting_value );
			if ( ! $updated ) {
				\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to update setting.', 'progress-planner' ) ] );
			}
			\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
		}

		$updated = \update_option( $setting, $value );
		if ( ! $updated ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to update setting.', 'progress-planner' ) ] );
		}
		\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
	}

	/**
	 * Get the list of allowed options that can be updated via interactive tasks.
	 *
	 * This whitelist prevents privilege escalation by ensuring only specific
	 * WordPress options can be modified through the interactive task interface.
	 *
	 * @return array List of allowed option names.
	 */
	protected function get_allowed_interactive_options() {
		$allowed_options = [
			// Core WordPress settings that are safe to update via interactive tasks.
			'blogdescription',          // Site tagline.
			'default_comment_status',   // Comment settings.
			'default_ping_status',      // Pingback settings.
			'timezone_string',          // Site timezone.
			'WPLANG',                   // Site language/locale (deprecated since WP 4.0, but still used by class-select-locale.php).
			'date_format',              // Date format.
			'time_format',              // Time format.
			'default_pingback_flag',    // Pingback flag.
			'comment_registration',     // Comment registration.
			'close_comments_for_old_posts', // Close comments for old posts.
			'thread_comments',          // Threaded comments.
			'comments_per_page',        // Comments per page.
			'comment_order',            // Comment order.
			'page_comments',            // Paginate comments.
		];

		/**
		 * Filter the list of allowed options for interactive tasks.
		 *
		 * WARNING: Be very careful when extending this list. Adding sensitive
		 * options like 'admin_email', 'users_can_register', or plugin-specific
		 * options that control access or permissions could create security vulnerabilities.
		 *
		 * @param array $allowed_options List of allowed option names.
		 *
		 * @return array Modified list of allowed option names.
		 */
		return \apply_filters( 'progress_planner_interactive_task_allowed_options', $allowed_options );
	}

	// Popover rendering methods removed - now handled by React components.
	// See assets/src/components/Popovers/ for React popover implementations.
}
