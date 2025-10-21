<?php
/**
 * Data collector for SEO plugin detection.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Data collector for SEO plugin detection.
 */
class SEO_Plugin extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'seo_plugin_installed';

	/**
	 * List of popular SEO plugins to check.
	 *
	 * @var array<string, array<string, mixed>>
	 */
	private $seo_plugins = [
		'wordpress-seo'       => [
			'name'      => 'Yoast SEO',
			'slug'      => 'wordpress-seo',
			'constants' => [ 'WPSEO_VERSION', 'WPSEO_FILE' ],
			'classes'   => [ 'WPSEO_Options', 'Yoast\WP\SEO\Main' ],
		],
		'seo-by-rank-math'    => [
			'name'      => 'Rank Math SEO',
			'slug'      => 'seo-by-rank-math',
			'constants' => [ 'RANK_MATH_VERSION', 'RANK_MATH_FILE' ],
			'classes'   => [ 'RankMath', 'RankMathPro\Plugin' ],
		],
		'all-in-one-seo-pack' => [
			'name'      => 'All in One SEO',
			'slug'      => 'all-in-one-seo-pack',
			'constants' => [ 'AIOSEO_VERSION', 'AIOSEO_FILE' ],
			'classes'   => [ 'AIOSEO\Plugin\AIOSEO', 'AIOSEOPro\Plugin\AIOSEO' ],
		],
	];

	/**
	 * Get the list of SEO plugins.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function get_seo_plugins() {
		return $this->seo_plugins;
	}

	/**
	 * Calculate data.
	 *
	 * @return bool Returns false if no SEO plugin is detected, true otherwise.
	 */
	protected function calculate_data() {
		// Check each SEO plugin.
		foreach ( $this->seo_plugins as $plugin_data ) {
			// First, check if the plugin is activated by slug.
			if ( \progress_planner()->get_plugin_installer()->is_plugin_activated( $plugin_data['slug'] ) ) {
				return true;
			}

			// Fallback: Check for plugin constants.
			if ( ! empty( $plugin_data['constants'] ) ) {
				foreach ( $plugin_data['constants'] as $constant ) {
					if ( \defined( $constant ) ) {
						return true;
					}
				}
			}

			// Fallback: Check for plugin classes.
			if ( ! empty( $plugin_data['classes'] ) ) {
				foreach ( $plugin_data['classes'] as $class ) {
					if ( \class_exists( $class ) ) {
						return true;
					}
				}
			}
		}

		return false;
	}
}
