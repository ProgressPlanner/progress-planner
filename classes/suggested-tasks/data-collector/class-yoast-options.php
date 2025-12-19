<?php
/**
 * Yoast SEO options data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Yoast options data collector class.
 *
 * Returns combined wpseo and wpseo_titles options for React task evaluation.
 */
class Yoast_Options extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'yoast_options';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		// Update cache when Yoast options change.
		\add_action( 'update_option_wpseo', [ $this, 'update_cache' ] );
		\add_action( 'update_option_wpseo_titles', [ $this, 'update_cache' ] );
		// Update cache when site logo changes (used as fallback by Yoast).
		\add_action( 'update_option_site_logo', [ $this, 'update_cache' ] );
	}

	/**
	 * Calculate the Yoast options data.
	 *
	 * @return array<string, mixed>|null Yoast options or null if Yoast is not active.
	 */
	protected function calculate_data() {
		// Return null if Yoast SEO is not active.
		if ( ! \function_exists( 'YoastSEO' ) ) {
			return null;
		}

		$wpseo        = \get_option( 'wpseo', [] );
		$wpseo_titles = \get_option( 'wpseo_titles', [] );

		return [
			'wpseo'        => $wpseo,
			'wpseo_titles' => $wpseo_titles,
			'site_logo'    => $this->get_site_logo_id(),
		];
	}

	/**
	 * Get the site logo ID.
	 *
	 * Checks both the site_logo option and the custom_logo theme mod.
	 * Yoast SEO uses the site logo as a fallback for organization/person logo.
	 *
	 * @return int The site logo attachment ID, or 0 if not set.
	 */
	private function get_site_logo_id(): int {
		$site_logo_id = \get_option( 'site_logo' );
		if ( ! $site_logo_id ) {
			$site_logo_id = \get_theme_mod( 'custom_logo', false );
		}
		return (int) $site_logo_id;
	}
}
