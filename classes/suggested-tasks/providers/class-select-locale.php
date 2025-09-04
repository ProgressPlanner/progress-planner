<?php
/**
 * Add task to select the site locale.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Providers;

/**
 * Add task to select the site locale.
 */
class Select_Locale extends Tasks_Interactive {

	/**
	 * The capability required to perform the task.
	 *
	 * @var string
	 */
	protected const CAPABILITY = 'install_languages';

	/**
	 * Whether the task is an onboarding task.
	 *
	 * @var bool
	 */
	protected const IS_ONBOARDING_TASK = false;

	/**
	 * The provider ID.
	 *
	 * @var string
	 */
	protected const PROVIDER_ID = 'select-locale';

	/**
	 * The popover ID.
	 *
	 * @var string
	 */
	const POPOVER_ID = 'select-locale';

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
		\add_action( 'wp_ajax_prpl_interactive_task_submit_select-locale', [ $this, 'handle_interactive_task_specific_submit' ] );
	}

	/**
	 * Get the task URL.
	 *
	 * @return string
	 */
	protected function get_url() {
		return \admin_url( 'options-general.php' );
	}

	/**
	 * Get the link setting.
	 *
	 * @return array
	 */
	public function get_link_setting() {
		return [
			'hook'   => 'options-general.php',
			'iconEl' => 'label[for="WPLANG"]',
		];
	}

	/**
	 * Get the task title.
	 *
	 * @return string
	 */
	protected function get_title() {
		return \esc_html__( 'Select your site locale', 'progress-planner' );
	}

	/**
	 * Get the task description.
	 *
	 * @return string
	 */
	protected function get_description() {
		return \esc_html__( 'Select your site locale to ensure your site is displayed correctly in the correct language.', 'progress-planner' );
	}

	/**
	 * Check if the task should be added.
	 *
	 * @return bool
	 */
	public function should_add_task() {
		$user_lang = $this->get_browser_locale();
		$wp_lang   = \get_locale();

		return $user_lang && ! \str_starts_with( $wp_lang, $user_lang );
	}

	/**
	 * Get the browser locale.
	 *
	 * @return string
	 */
	protected function get_browser_locale() {
		$lang = \sanitize_text_field( \wp_unslash( $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '' ) );
		if ( ! $lang ) {
			return '';
		}

		$lang = \strtolower( \substr( $lang, 0, 2 ) );
		$lang = \explode( '-', $lang )[0];
		$lang = \explode( '_', $lang )[0];

		return $lang;
	}

	/**
	 * Get all locales from the WP API.
	 *
	 * Not currently used, but could be useful in the future.
	 *
	 * @return array
	 */
	protected function get_locales() {
		$cache_key = 'all_locales';
		$cached    = \progress_planner()->get_utils__cache()->get( $cache_key );
		if ( $cached ) {
			return $cached;
		}

		$response = \wp_remote_get( 'https://api.wordpress.org/translations/core/1.0/' );
		if ( \is_wp_error( $response ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}
		$body    = \wp_remote_retrieve_body( $response );
		$locales = \json_decode( $body, true );
		if ( ! \is_array( $locales ) || ! isset( $locales['translations'] ) ) {
			\progress_planner()->get_utils__cache()->set( $cache_key, [], 5 * MINUTE_IN_SECONDS );
			return [];
		}

		// Get the locales.
		$locales = \array_map(
			function ( $locale ) {
				return [
					'code' => $locale['language'],
					'name' => $locale['native_name'],
				];
			},
			$locales['translations']
		);

		\progress_planner()->get_utils__cache()->set( $cache_key, $locales, MONTH_IN_SECONDS );

		// Return the locales.
		return $locales;
	}

	/**
	 * Check if the task is completed.
	 *
	 * @param string $task_id Optional task ID to check completion for.
	 * @return bool
	 */
	public function is_task_completed( $task_id = '' ) {
		$locale_activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'data_id'  => static::PROVIDER_ID,
			]
		);

		return ! empty( $locale_activity );
	}

	/**
	 * Get the popover instructions.
	 *
	 * @return void
	 */
	public function print_popover_instructions() {
		echo '<p>' . \esc_html__( 'Select your site locale to ensure your site is displayed correctly in the correct language', 'progress-planner' ) . '</p>';
	}

	/**
	 * Print the popover input field for the form.
	 *
	 * @return void
	 */
	public function print_popover_form_contents() {

		if ( ! \function_exists( 'wp_get_available_translations' ) ) {
			require_once ABSPATH . 'wp-admin/includes/translation-install.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		$languages    = \get_available_languages();
		$translations = \wp_get_available_translations();
		$locale       = \get_locale();
		if ( ! \in_array( $locale, $languages, true ) ) {
			$locale = '';
		}

		\wp_dropdown_languages(
			[
				'name'                        => 'language',
				'id'                          => 'language',
				'selected'                    => $locale,
				'languages'                   => $languages,
				'translations'                => $translations,
				'show_available_translations' => \current_user_can( 'install_languages' ) && \wp_can_install_language_pack(),
			]
		);
		?>
		<button type="submit" class="prpl-button prpl-button-primary" style="color: #fff;">
			<?php \esc_html_e( 'Select locale', 'progress-planner' ); ?>
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

		$option_updated      = false;
		$language_for_update = \sanitize_text_field( \wp_unslash( $_POST['value'] ) );

		if ( empty( $language_for_update ) ) {
			\wp_send_json_error( [ 'message' => \esc_html__( 'Invalid language.', 'progress-planner' ) ] );
		}

		// Handle translation installation.
		if ( \current_user_can( 'install_languages' ) ) {
			require_once ABSPATH . 'wp-admin/includes/translation-install.php'; // @phpstan-ignore requireOnce.fileNotFound

			if ( \wp_can_install_language_pack() ) {
				$language = \wp_download_language_pack( $language_for_update );
				if ( $language ) {
					$language_for_update = $language;

					$option_updated = \update_option( 'WPLANG', $language_for_update );
				}
			}
		}

		if ( $option_updated ) {
			\wp_send_json_success( [ 'message' => \esc_html__( 'Setting updated.', 'progress-planner' ) ] );
		}

		\wp_send_json_error( [ 'message' => \esc_html__( 'Failed to update setting.', 'progress-planner' ) ] );
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
			'priority' => 100,
			'html'     => '<a href="#" class="prpl-tooltip-action-text" role="button" onclick="document.getElementById(\'' . \esc_attr( $data['meta']['prpl_popover_id'] ) . '\')?.showPopover()">' . \esc_html__( 'Select locale', 'progress-planner' ) . '</a>',
		];

		return $actions;
	}
}
