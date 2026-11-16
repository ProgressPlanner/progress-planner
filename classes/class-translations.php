<?php
/**
 * Language packs from TranslationsPress.
 *
 * The plugin is no longer distributed through WordPress.org, so WordPress
 * cannot find language packs for it there. This class tells WordPress about
 * the language packs TranslationsPress builds for the plugin. WordPress then
 * downloads, installs and loads them in the same way as WordPress.org packs.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

/**
 * Translations class.
 */
class Translations {

	/**
	 * The plugin slug, which is also the text domain.
	 *
	 * @var string
	 */
	const SLUG = 'progress-planner';

	/**
	 * The base URL of the project on TranslationsPress.
	 *
	 * Language packs are only accepted when their URL starts with this.
	 *
	 * @var string
	 */
	const PACKAGES_BASE_URL = 'https://packages.translationspress.com/progress-planner/progress-planner/';

	/**
	 * The site transient that caches the list of language packs.
	 *
	 * @var string
	 */
	const CACHE_KEY = 'progress_planner_translation_packs';

	/**
	 * Constructor.
	 */
	public function __construct() {
		// This filter runs when WordPress stores the result of a plugin update
		// check. The remote request below therefore only happens in a context
		// that already makes remote requests, never on a normal page load.
		\add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'add_translation_updates' ] );
	}

	/**
	 * Add our language packs to the plugin update data.
	 *
	 * @param mixed $transient The value of the `update_plugins` site transient.
	 *
	 * @return mixed
	 */
	public function add_translation_updates( $transient ) {
		if ( ! $transient instanceof \stdClass ) {
			return $transient;
		}

		$locales = $this->get_locales();
		if ( empty( $locales ) ) {
			return $transient;
		}

		$packs = \array_intersect_key( $this->get_packs(), \array_flip( $locales ) );
		if ( empty( $packs ) ) {
			return $transient;
		}

		$translations = isset( $transient->translations ) && \is_array( $transient->translations )
			? $transient->translations
			: [];

		foreach ( $packs as $locale => $pack ) {
			if ( ! $this->is_newer_than_installed( $locale, $pack['updated'] ) ) {
				continue;
			}

			// Drop any pack already listed for this plugin and locale, so the
			// list never holds two packs for the same files.
			$translations = \array_filter(
				$translations,
				static function ( $translation ) use ( $locale ) {
					$translation = (array) $translation;
					return ! ( isset( $translation['type'], $translation['slug'], $translation['language'] )
						&& 'plugin' === $translation['type']
						&& self::SLUG === $translation['slug']
						&& $locale === $translation['language'] );
				}
			);

			$translations[] = [
				'type'       => 'plugin',
				'slug'       => self::SLUG,
				'language'   => $locale,
				'version'    => $pack['version'],
				'updated'    => $pack['updated'],
				'package'    => $pack['package'],
				'autoupdate' => true,
			];
		}

		$transient->translations = \array_values( $translations );

		return $transient;
	}

	/**
	 * Get the locales to look up language packs for.
	 *
	 * These are the languages installed on the site, which is also what
	 * WordPress itself asks WordPress.org for.
	 *
	 * @return string[]
	 */
	protected function get_locales() {
		$locales   = \get_available_languages();
		$locales[] = \get_locale();

		return \array_values( \array_diff( \array_unique( $locales ), [ 'en_US' ] ) );
	}

	/**
	 * Whether a language pack is newer than the installed translation.
	 *
	 * @param string $locale  The locale.
	 * @param string $updated The date the language pack was last updated.
	 *
	 * @return bool
	 */
	protected function is_newer_than_installed( $locale, $updated ) {
		$installed = $this->get_installed_date( $locale );
		if ( '' === $installed ) {
			return true;
		}

		$installed_time = \strtotime( $installed );
		$updated_time   = \strtotime( $updated );

		return false !== $updated_time && ( false === $installed_time || $updated_time > $installed_time );
	}

	/**
	 * Get the revision date of the installed translation for a locale.
	 *
	 * @param string $locale The locale.
	 *
	 * @return string The date, or an empty string when no translation is installed.
	 */
	protected function get_installed_date( $locale ) {
		$installed = \wp_get_installed_translations( 'plugins' );

		return isset( $installed[ self::SLUG ][ $locale ]['PO-Revision-Date'] )
			? (string) $installed[ self::SLUG ][ $locale ]['PO-Revision-Date']
			: '';
	}

	/**
	 * Get the language packs TranslationsPress has for the plugin.
	 *
	 * @return array<string, array{version: string, updated: string, package: string}> Packs, keyed by locale.
	 */
	public function get_packs() {
		$cached = \get_site_transient( self::CACHE_KEY );
		if ( \is_array( $cached ) ) {
			return $cached;
		}

		$response = \wp_remote_get( self::PACKAGES_BASE_URL . 'packages.json' );

		// Cache failures for a short time, so a broken connection is not retried on every update check.
		if ( \is_wp_error( $response ) || 200 !== (int) \wp_remote_retrieve_response_code( $response ) ) {
			\set_site_transient( self::CACHE_KEY, [], HOUR_IN_SECONDS );
			return [];
		}

		$data  = \json_decode( \wp_remote_retrieve_body( $response ), true );
		$packs = [];

		if ( \is_array( $data ) && isset( $data['translations'] ) && \is_array( $data['translations'] ) ) {
			foreach ( $data['translations'] as $translation ) {
				if ( ! \is_array( $translation )
					|| ! isset( $translation['language'], $translation['version'], $translation['updated'], $translation['package'] )
					|| ! \is_string( $translation['language'] )
					|| ! \is_string( $translation['version'] )
					|| ! \is_string( $translation['updated'] )
					|| ! \is_string( $translation['package'] )
					|| 1 !== \preg_match( '/^[a-z]{2,3}(_[A-Za-z0-9]+)*$/', $translation['language'] )
					// WordPress downloads and unpacks this file, so only accept our own project's packages.
					|| 0 !== \strpos( $translation['package'], self::PACKAGES_BASE_URL )
				) {
					continue;
				}

				$packs[ $translation['language'] ] = [
					'version' => $translation['version'],
					'updated' => $translation['updated'],
					'package' => $translation['package'],
				];
			}
		}

		\set_site_transient( self::CACHE_KEY, $packs, 12 * HOUR_IN_SECONDS );

		return $packs;
	}
}
