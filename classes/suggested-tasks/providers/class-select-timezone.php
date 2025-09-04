<?php
/**
 * Add task to select the site timezone.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to select the site locale.
 */
class Select_Timezone extends Tasks_Interactive {

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'select-timezone';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'select-timezone';

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
		\add_action( 'wp_ajax_prpl_interactive_task_submit_select-timezone', [ $this, 'handle_interactive_task_specific_submit' ] );
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
			'iconEl' => 'label[for="timezone_string"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Set site timezone', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Setting the time zone correctly on your site is valuable. By setting the correct time zone, you ensure scheduled tasks happen exactly when you want them to happen. To correctly account for daylight savings\', we recommend you use the city-based time zone instead of the UTC offset (e.g. Amsterdam or London).', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$timezone_activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => static::PROVIDER_ID,
			]
		);

		return ! $timezone_activity;
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>';
		\esc_html_e( 'Setting the time zone correctly on your site is valuable. By setting the correct time zone, you ensure scheduled tasks happen exactly when you want them to happen. To correctly account for daylight savings\', we recommend you use the city-based time zone instead of the UTC offset (e.g. Amsterdam or London).', 'progress-planner' );
		echo '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {
		$current_offset     = \get_option( 'gmt_offset' );
		$tzstring           = \get_option( 'timezone_string' );
		$was_tzstring_saved = '' !== $tzstring || '0' !== $current_offset ? 'true' : 'false';

		// Remove old Etc mappings. Fallback to gmt_offset.
		if ( \str_contains( $tzstring, 'Etc/GMT' ) ) {
			$tzstring = '';
		}

		if ( empty( $tzstring ) ) { // Create a UTC+- zone if no timezone string exists.
			if ( 0 === (int) $current_offset ) {
				$tzstring = 'UTC+0';
			} elseif ( $current_offset < 0 ) {
				$tzstring = 'UTC' . $current_offset;
			} else {
				$tzstring = 'UTC+' . $current_offset;
			}
		}
		?>
		<label>
			<select id="timezone" name="timezone" data-timezone-saved="<?php echo \esc_attr( $was_tzstring_saved ); ?>">
				<?php echo \wp_timezone_choice( $tzstring, \get_user_locale() ); ?>
			</select>
		</label>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Set site timezone', 'progress-planner' ); ?>
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

		if ( ! isset( $_POST['setting'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing setting.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['value'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing value.', 'progress-planner' ) ] );
		}

		if ( ! isset( $_POST['setting_path'] ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Missing setting path.', 'progress-planner' ) ] );
		}

		$timezone_string = \sanitize_text_field( \wp_unslash( $_POST['value'] ) );

		if ( empty( $timezone_string ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid timezone.', 'progress-planner' ) ] );
		}

		$update_options = false;

		// Map UTC+- timezones to gmt_offsets and set timezone_string to empty.
		if ( \preg_match( '/^UTC[+-]/', $timezone_string ) ) {
			// Set the gmt_offset to the value of the timezone_string, strip the UTC prefix.
			$gmt_offset = \preg_replace( '/UTC\+?/', '', $timezone_string );

			// Reset the timezone_string to empty.
			$timezone_string = '';

			$update_options = true;
		} elseif ( \in_array( $timezone_string, \timezone_identifiers_list( \DateTimeZone::ALL_WITH_BC ), true ) ) {
			// $timezone_string is already set, reset the value for $gmt_offset.
			$gmt_offset = '';

			$update_options = true;
		}

		if ( $update_options ) {
			\update_option( 'timezone_string', $timezone_string );
			\update_option( 'gmt_offset', $gmt_offset );

			// We're not checking for the return value of the update_option calls, because it will return false if the value is the same (for example if gmt_offset is already set to '').
			\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
		}

		\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to update setting.', 'progress-planner' ) ] );
	}
}
