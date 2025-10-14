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
	 * The task priority.
	 *
	 * @var int
	 */
	protected $priority = self::PRIORITY_NORMAL - 4;

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
		return 'wp_default' === $this->get_date_format_type() ? \esc_html__( 'Set site date format', 'progress-planner' ) : \esc_html__( 'Verify site date format', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Setting the date format correctly on your site is valuable. By setting the correct date format, you ensure the dates are displayed correctly in the admin area and the front end.', 'progress-planner' );
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
		$detected_date_format = $this->get_date_format_type();

		// Get the site default language name.
		$available_languages = \wp_get_available_translations();
		$site_locale         = \get_locale();

		if ( isset( $available_languages[ $site_locale ] ) ) {
			$lang_name = $available_languages[ $site_locale ]['english_name'];
		} elseif ( \function_exists( 'locale_get_display_name' ) ) {
			$lang_name = \locale_get_display_name( $site_locale, 'en' );
		} else {
			$lang_name = $site_locale;
		}
		?>
		<?php if ( 'wp_default' === $detected_date_format ) : ?>
			<p><?php \esc_html_e( 'Choosing the right date format helps your visitors instantly understand when something was published without confusion or guessing. It also makes your site feel more familiar and trustworthy, especially if your audience is local.', 'progress-planner' ); ?></p>
			<p><?php \esc_html_e( 'By setting the correct format, you make sure dates show up clearly both in your dashboard and on your live site.', 'progress-planner' ); ?></p>
			<p><?php \esc_html_e( 'Tip: Pick the format that matches what your audience expects.', 'progress-planner' ); ?></p>
		<?php elseif ( 'localized_default' === $detected_date_format ) : ?>
			<p><?php \esc_html_e( 'Choosing the right date format helps your visitors instantly understand when something was published without confusion or guessing. It also makes your site feel more familiar and trustworthy, especially if your audience is local.', 'progress-planner' ); ?></p>
			<p>
				<?php
				\printf(
					/* translators: %s: The date format. */
					\esc_html__( 'The date format currently set matches the default format for your site language (%s). Therefore, we expect it\'s set correctly. But can you have a quick look, just to be sure?', 'progress-planner' ),
					\esc_html( $lang_name )
				);
				?>
			</p>
			<p><?php \esc_html_e( 'Tip: Pick the format that matches what your audience expects.', 'progress-planner' ); ?></p>
		<?php else : ?>
			<p><?php \esc_html_e( 'Choosing the right date format helps your visitors instantly understand when something was published without confusion or guessing. It also makes your site feel more familiar and trustworthy, especially if your audience is local.', 'progress-planner' ); ?></p>
			<p><?php \esc_html_e( 'Because your site is not using the WordPress default setting, we expect you may have set this already. That\'s why we just want you to verify if it\'s set correctly.', 'progress-planner' ); ?></p>
			<p><?php \esc_html_e( 'Tip: Pick the format that matches what your audience expects.', 'progress-planner' ); ?></p>
		<?php endif; ?>
		<?php
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {

		// Default date format, based on the user's locale.
		$localized_default_date_format = \__( 'F j, Y' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain -- We want localized date format from WP Core.

		// Try to get the localized default date format.
		$site_locale = \get_locale();
		$user_locale = \get_user_locale();
		if ( $user_locale !== $site_locale && \switch_to_locale( $site_locale ) ) {
			$localized_default_date_format = \__( 'F j, Y' ); // phpcs:ignore WordPress.WP.I18n.MissingArgDomain -- We want localized date format from WP Core.
			\restore_previous_locale();
		}

		/**
		 * Filters the default date formats.
		 *
		 * @param string[] $default_date_formats Array of default date formats.
		 */
		$prpl_date_formats = \array_unique( \apply_filters( 'date_formats', [ $localized_default_date_format, 'F j, Y', 'Y-m-d', 'm/d/Y', 'd/m/Y', 'd.m.Y' ] ) ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound, WordPress.WP.I18n.MissingArgDomain -- WP core filter & we want to add the default date format

		$prpl_custom = true;
		?>
		<div class="radios">
			<fieldset>
				<?php foreach ( $prpl_date_formats as $prpl_format ) : ?>
				<div class="prpl-radio-wrapper">
					<label class="prpl-custom-radio">
						<input
							type="radio"
							name="date_format"
							value="<?php echo \esc_attr( $prpl_format ); ?>"
							<?php
							if ( \get_option( 'date_format' ) === $prpl_format ) { // checked() uses "==" rather than "===".
								echo " checked='checked'";
								$prpl_custom = false;
							}
							?>
						/>
						<span class="prpl-custom-control"></span>
						<span class="date-time-text format-i18n"><?php echo \esc_html( \date_i18n( $prpl_format ) ); ?></span>
						<code><?php echo \esc_html( $prpl_format ); ?></code>
					</label>
				</div>
				<?php endforeach; ?>

				<?php /* Custom date format. */ ?>
				<div class="prpl-radio-wrapper">
					<label class="prpl-custom-radio">
						<input type="radio" name="date_format" id="date_format_custom_radio" value="\c\u\s\t\o\m" <?php \checked( $prpl_custom ); ?>/>
						<span class="prpl-custom-control"></span> <span class="date-time-text date-time-custom-text">
							<?php
							\printf(
								/* translators: %s: Screen reader text "enter a custom date format in the following field". */
								\esc_html__( 'Custom: %s', 'progress-planner' ),
								/* translators: Hidden accessibility text. */
								'<span class="screen-reader-text">' . \esc_html__( 'enter a custom date format in the following field', 'progress-planner' ) . '</span>'
							);
							?>
						</span>
					</label>
					<label for="date_format_custom" class="screen-reader-text">
						<?php
						/* translators: Hidden accessibility text. */
						\esc_html_e( 'Custom date format:', 'progress-planner' );
						?>
					</label>
					<input type="text" name="date_format_custom" id="date_format_custom" value="<?php echo \esc_attr( \get_option( 'date_format' ) ); ?>" class="small-text" />
				</div>

				<?php /* Preview. */ ?>
				<p>
					<?php
					\printf(
						/* translators: %s: Preview text. */
						\wp_kses_post( \__( '<strong>Preview:</strong> %s', 'progress-planner' ) ),
						'<span class="example">' . \esc_html( \date_i18n( \get_option( 'date_format' ) ) ) . '</span><span class="spinner"></span>'
					);
					?>
				</p>
			</fieldset>
		</div>
		<button type="submit" class="prpl-button prpl-button-primary">
			<?php \esc_html_e( 'Set date format', 'progress-planner' ); ?>
		</button>
		<?php
	}

	/**
	 * Handle the interactive task submit.
	 *
	 * This is only for interactive tasks that change non-core settings.
	 * The $_POST data is expected to be:
	 * - date_format: (string) The date format to update.
	 * - date_format_custom: (string) The custom date format to update.
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

	/**
	 * Add task actions specific to this task.
	 *
	 * @param array $data    The task data.
	 * @param array $actions The existing actions.
	 *
	 * @return array
	 */
	public function add_task_actions( $data = [], $actions = [] ) {
		$action_label = 'wp_default' === $this->get_date_format_type() ? \esc_html__( 'Set date format', 'progress-planner' ) : \esc_html__( 'Verify date format', 'progress-planner' );
		$actions[]    = [
			'priority' => 10,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'prpl-popover-' . \esc_attr( static::POPOVER_ID ) . '\')?.showPopover()">' . \esc_html( $action_label ) . '</a>',
		];

		return $actions;
	}

	/**
	 * Checks to which format the date is set.
	 *  - 'F j, Y' - WP default with US-en locale.
	 *  - __( ''F j, Y' ), localized version of the default date format.
	 *  - non default date format.
	 *
	 * @return string
	 */
	protected function get_date_format_type() {
		$date_format = \get_option( 'date_format' );

		if ( $date_format === 'F j, Y' && 'F j, Y' !== \__( 'F j, Y' ) ) { // phpcs:ignore WordPress.WP.I18n.MissingArgDomain -- We want localized date format from WP Core.
			return 'wp_default';
		}

		if ( $date_format === \__( 'F j, Y' ) ) { // phpcs:ignore WordPress.WP.I18n.MissingArgDomain -- We want localized date format from WP Core.
			return 'localized_default';
		}

		return 'non_default';
	}
}
