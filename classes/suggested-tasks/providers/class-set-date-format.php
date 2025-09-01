<?php
/**
 * Add task to select the site date format.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to select the site date format.
 */
class Set_Date_Format extends Tasks_Interactive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'set-date-format';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'set-date-format';

	/**
	 * Whether the task is dismissable.
	 *
	 * @var bool
	 */
	protected $is_dismissable = true;

	/**
	 * Initialize the task.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'wp_ajax_prpl_interactive_task_submit_set-date-format', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-general.php?pp-focus-el=' . $this->get_task_id() );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => 'tr:has(input[name="date_format"]) th',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set site date format', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Setting the date format correctly on your site is valuable. By setting the correct date format, you ensure the dates are displayed correctly in the admin area and the front end. We recommend you use the same date format as your country.', 'progress-planner' );
	}

	/**
	 * Get the task-action text.
	 *
	 * @return string
	 */
	protected function get_task_action_text() {
		return \esc_html__( 'Set date format', 'progress-planner' );
	}
	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$date_format_activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => static::PROVIDER_ID,
			]
		);

		return ! $date_format_activity;
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Setting the date format correctly on your site is valuable. By setting the correct date format, you ensure the dates are displayed correctly in the admin area and the front end. We recommend you use the same date format as your country.', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		/**
		 * Filters the default date formats.
		 *
		 * @param string[] $default_date_formats Array of default date formats.
		 */
		$date_formats = array_unique( \apply_filters( 'date_formats', [ 'F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y', 'd.m.Y' ] ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- WP core filter

		$custom = true;

		echo '<div class="radios">';
		echo '<fieldset>';
		foreach ( $date_formats as $format ) {
			echo '<div class="prpl-radio-wrapper">';
			echo "<label class='prpl-custom-radio'><input type='radio' name='date_format' value='" . \esc_attr( $format ) . "'";
			if ( \get_option( 'date_format' ) === $format ) { // checked() uses "==" rather than "===".
				echo " checked='checked'";
				$custom = false;
			}
			echo ' /> <span class="prpl-custom-control"></span><span class="date-time-text format-i18n">' . \esc_html( \date_i18n( $format ) ) . '</span><code>' . \esc_html( $format ) . '</code></label>';
			echo '</div>';
		}

		echo '<div class="prpl-radio-wrapper">';
		echo '<label class="prpl-custom-radio"><input type="radio" name="date_format" id="date_format_custom_radio" value="\c\u\s\t\o\m"';
		checked( $custom );
		echo '/> <span class="prpl-custom-control"></span> <span class="date-time-text date-time-custom-text">' . \esc_html( __( 'Custom:', 'progress-planner' ) ) . '<span class="screen-reader-text"> ' .
				/* translators: Hidden accessibility text. */
				\esc_html( __( 'enter a custom date format in the following field', 'progress-planner' ) ) .
			'</span></span></label>' .
			'<label for="date_format_custom" class="screen-reader-text">' .
				/* translators: Hidden accessibility text. */
				\esc_html( __( 'Custom date format:', 'progress-planner' ) ) .
			'</label>' .
			'<input type="text" name="date_format_custom" id="date_format_custom" value="' . \esc_attr( \get_option( 'date_format' ) ) . '" class="small-text" />' .
			'</div>' .
			'<p><strong>' . \esc_html( __( 'Preview:', 'progress-planner' ) ) . '</strong> <span class="example">' . \esc_html( \date_i18n( \get_option( 'date_format' ) ) ) . '</span>' .
			"<span class='spinner'></span>\n" . '</p>';
		?>
		</fieldset>
		</div>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Set date format', 'progress-planner' ); ?>
		</button>
		<?php
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
	public function handle_interactive_task_specific_submit() {
		// Check the nonce.
		if ( ! \check_ajax_referer( 'progress_planner', 'nonce', false ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid nonce.', 'progress-planner' ) ] );
		}

		if ( ! empty( $_POST['date_format'] ) && isset( $_POST['date_format_custom'] )
			&& '\c\u\s\t\o\m' === \wp_unslash( $_POST['date_format'] ) // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- We're not processing any data, here.
		) {
			$_POST['date_format'] = $_POST['date_format_custom']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized, WordPress.Security.ValidatedSanitizedInput.MissingUnslash -- sanitize_text_field() will sanitize the value.
		}

		$date_format = \sanitize_text_field( \wp_unslash( $_POST['date_format'] ) );

		if ( empty( $date_format ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid timezone.', 'progress-planner' ) ] );
		}

		// We're not checking for the return value of the update_option calls, because it will return false if the value is the same.
		\update_option( 'date_format', $date_format );

		\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
	}
}
