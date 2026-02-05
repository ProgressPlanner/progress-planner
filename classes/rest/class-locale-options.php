<?php
/**
 * Locale Options REST API controller.
 *
 * Returns locale/language options for use in select dropdowns.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Rest;

/**
 * Locale Options REST API controller.
 */
class Locale_Options extends Base {

	/**
	 * Register REST endpoint.
	 *
	 * @return void
	 */
	public function register_rest_endpoint() {
		\register_rest_route(
			'progress-planner/v1',
			'/locale-options',
			[
				[
					'methods'             => 'GET',
					'callback'            => [ $this, 'get_locale_options' ],
					'permission_callback' => [ $this, 'check_permissions' ],
				],
			]
		);
	}

	/**
	 * Check if the current user has permission to access this endpoint.
	 *
	 * @return bool
	 */
	public function check_permissions() {
		return \current_user_can( 'manage_options' );
	}

	/**
	 * Get locale options.
	 *
	 * @return \WP_REST_Response
	 */
	public function get_locale_options() {
		$options = $this->build_locale_options();

		return new \WP_REST_Response( $options, 200 );
	}

	/**
	 * Build locale options array.
	 *
	 * Uses WordPress's get_available_languages() and wp_get_available_translations()
	 * to build the list of available locales.
	 *
	 * @return array Array of locale option objects with 'value' and 'label' properties.
	 */
	private function build_locale_options() {
		if ( ! \function_exists( 'request_filesystem_credentials' ) ) {
			// @phpstan-ignore-next-line requireOnce.fileNotFound
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		if ( ! \function_exists( 'wp_get_available_translations' ) ) {
			// @phpstan-ignore-next-line requireOnce.fileNotFound
			require_once ABSPATH . 'wp-admin/includes/translation-install.php';
		}

		$languages    = \get_available_languages();
		$translations = \wp_get_available_translations();

		$options = [
			[
				'value' => '',
				'label' => 'English (United States)',
			],
		];

		foreach ( $languages as $locale ) {
			$label = isset( $translations[ $locale ] )
				? $translations[ $locale ]['native_name']
				: $locale;

			$options[] = [
				'value' => $locale,
				'label' => $label,
			];
		}

		// Include installable languages if user can install them.
		if ( \current_user_can( 'install_languages' ) && \wp_can_install_language_pack() ) {
			foreach ( $translations as $translation ) {
				if ( \in_array( $translation['language'], $languages, true ) ) {
					continue;
				}

				$options[] = [
					'value' => $translation['language'],
					'label' => $translation['native_name'],
				];
			}
		}

		return $options;
	}
}
