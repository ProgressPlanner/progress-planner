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
		$current_offset = \get_option( 'gmt_offset' );
		$tzstring       = \get_option( 'timezone_string' );
		$was_tzstring_saved = '' !== $tzstring || '0' !== $current_offset ? 'true' : 'false';

		// Remove old Etc mappings. Fallback to gmt_offset.
		if ( str_contains( $tzstring, 'Etc/GMT' ) ) {
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
			<select id="gmt_offset" name="gmt_offset" data-timezone-saved="<?php echo \esc_attr( $was_tzstring_saved ); ?>">
				<?php echo \wp_timezone_choice( $tzstring, \get_user_locale() ); ?>
			</select>
		</label>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Set site timezone', 'progress-planner' ); ?>
		</button>
		<?php
	}
}
