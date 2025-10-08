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
		\add_action( 'progress_planner_admin_page_after_widgets', [ $this, 'add_popover' ] );
		\add_action( 'progress_planner_admin_dashboard_widget_score_after', [ $this, 'add_popover' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_scripts' ] );
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

		$setting = \sanitize_text_field( \wp_unslash( $_POST['setting'] ) );

		// SECURITY: Whitelist of allowed settings that this endpoint can modify.
		// Only safe WordPress core settings are allowed.
		$allowed_settings = \apply_filters(
			'progress_planner_interactive_task_allowed_settings',
			[
				'date_format',
				'time_format',
				'timezone_string',
				'WPLANG',
				'start_of_week',
			]
		);

		if ( ! \in_array( $setting, $allowed_settings, true ) ) {
			\wp_send_json_error(
				[
					'message' => \esc_html__( 'This setting cannot be modified via this endpoint for security reasons.', 'progress-planner' ),
				]
			);
		}

		// Decode setting path before sanitization to preserve JSON structure.
		$setting_path_raw = \wp_unslash( $_POST['setting_path'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- We're decoding JSON, sanitization happens after validation.
		$setting_path     = \json_decode( $setting_path_raw, true );

		if ( \json_last_error() !== JSON_ERROR_NONE ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid setting path format.', 'progress-planner' ) ] );
		}

		// Sanitize value based on the specific setting type.
		$value = $this->sanitize_setting_value( $setting, \wp_unslash( $_POST['value'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Sanitization handled in sanitize_setting_value().

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
	 * Sanitize setting value based on the setting type.
	 *
	 * @param string $setting The setting name.
	 * @param mixed  $value   The value to sanitize.
	 * @return mixed The sanitized value.
	 */
	private function sanitize_setting_value( $setting, $value ) {
		switch ( $setting ) {
			case 'date_format':
			case 'time_format':
				// Allow common date/time format characters.
				return \sanitize_text_field( $value );

			case 'timezone_string':
				// Validate timezone against PHP's list of valid timezones.
				$valid_timezones = \timezone_identifiers_list();
				return \in_array( $value, $valid_timezones, true ) ? $value : '';

			case 'WPLANG':
				// Validate language code format (e.g., en_US, fr_FR).
				return \sanitize_text_field( $value );

			case 'start_of_week':
				// Must be a number 0-6 (Sunday-Saturday).
				$int_value = \absint( $value );
				return ( $int_value >= 0 && $int_value <= 6 ) ? $int_value : 0;

			default:
				// Default to text sanitization.
				return \sanitize_text_field( $value );
		}
	}

	/**
	 * Add the popover.
	 *
	 * @return void
	 */
	public function add_popover() {
		?>
		<div id="prpl-popover-<?php echo \esc_attr( static::POPOVER_ID ); ?>" class="prpl-popover prpl-popover-interactive" popover>
			<?php $this->the_popover_content(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
	}

	/**
	 * The popover content.
	 *
	 * @return void
	 */
	public function the_popover_content() {
		\progress_planner()->the_view(
			[
				'/views/popovers/' . static::POPOVER_ID . '.php',
				'/views/popovers/interactive-task.php',
			],
			[
				'prpl_task_object'       => $this,
				'prpl_popover_id'        => static::POPOVER_ID,
				'prpl_external_link_url' => $this->get_external_link_url(),
				'prpl_provider_id'       => $this->get_provider_id(),
				'prpl_task_actions'      => $this->get_task_actions(),
			]
		);
	}

	/**
	 * Print the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		$description = $this->get_description();
		if ( empty( $description ) ) {
			return;
		}

		echo '<p>' . \wp_kses_post( $description ) . '</p>';
	}

	/**
	 * Print the popover form contents.
	 *
	 * @return void
	 */
	abstract public function print_popover_form_contents();

	/**
	 * Enqueue the scripts.
	 *
	 * @param string $hook The current admin page.
	 *
	 * @return void
	 */
	public function enqueue_scripts( $hook ) {
		// Enqueue the script only on Progress Planner and WP dashboard pages.
		if ( 'toplevel_page_progress-planner' !== $hook && 'index.php' !== $hook ) {
			return;
		}

		// Enqueue the web component.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'progress-planner/recommendations/' . $this->get_provider_id(),
			$this->get_enqueue_data()
		);
	}

	/**
	 * Get the enqueue data.
	 *
	 * @return array
	 */
	protected function get_enqueue_data() {
		return [];
	}
}
