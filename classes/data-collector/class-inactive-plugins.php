<?php
/**
 * Inactive plugins data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Data_Collector;

use Progress_Planner\Data_Collector\Base_Data_Collector;

/**
 * Inactive plugins data collector class.
 */
class Inactive_Plugins extends Base_Data_Collector {

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'inactive_plugins_count';

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {
		\add_action( 'deleted_plugin', [ $this, 'update_inactive_plugins_cache' ], 10 );
		\add_action( 'update_option_active_plugins', [ $this, 'update_inactive_plugins_cache' ], 10 );
	}

	/**
	 * Update the cache when plugin is activated or deactivated.
	 *
	 * @return void
	 */
	public function update_inactive_plugins_cache() {
		$this->update_cache();
	}

	/**
	 * Calculate the inactive plugins count.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore requireOnce.fileNotFound
		}

		$plugins        = get_plugins();
		$plugins_active = 0;
		$plugins_total  = 0;

		// Loop over the available plugins and check their versions and active state.
		foreach ( array_keys( $plugins ) as $plugin_path ) {
			++$plugins_total;

			if ( is_plugin_active( $plugin_path ) ) {
				++$plugins_active;
			}
		}

		$unused_plugins = 0;
		if ( ! is_multisite() && $plugins_total > $plugins_active ) {
			$unused_plugins = $plugins_total - $plugins_active;
		}

		return $unused_plugins;
	}
}
