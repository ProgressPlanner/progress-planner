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
class Select_Locale extends Tasks {

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
}
