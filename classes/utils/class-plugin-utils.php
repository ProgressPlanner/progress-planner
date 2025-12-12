<?php
/**
 * Plugin utility functions.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Plugin utility functions.
 */
class Plugin_Utils {

	/**
	 * Checks if plugin is installed.
	 *
	 * @param string $plugin_slug The slug of the plugin we want to check.
	 *
	 * @return bool
	 */
	public static function is_plugin_installed( $plugin_slug ) {
		return ! empty( self::get_plugin_path( $plugin_slug ) );
	}

	/**
	 * Checks if plugin is activated.
	 *
	 * @param string $plugin_slug The slug of the plugin we want to check.
	 *
	 * @return bool
	 */
	public static function is_plugin_activated( $plugin_slug ) {
		// Get the plugin path.
		$plugin_path = self::get_plugin_path( $plugin_slug );

		// If the plugin path is empty, return false.
		if ( empty( $plugin_path ) ) {
			return false;
		}

		// If the is_plugin_active function does not exist, include the necessary file.
		if ( ! \function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore-line
		}

		// Return if the plugin is activated.
		return \is_plugin_active( $plugin_path );
	}

	/**
	 * Get the path of the plugin.
	 *
	 * @param string $plugin_slug The slug of the plugin we want to get the path for.
	 *
	 * @return string
	 */
	public static function get_plugin_path( $plugin_slug ) {
		// If the plugin slug is empty, return an empty string.
		if ( empty( $plugin_slug ) ) {
			return '';
		}

		// If the get_plugins function does not exist, include the necessary file.
		if ( ! \function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php'; // @phpstan-ignore-line
		}

		// Return the plugin path.
		foreach ( \array_keys( \get_plugins() ) as $plugin ) {
			if ( \explode( '/', $plugin )[0] === $plugin_slug ) {
				return $plugin;
			}
		}

		// If the plugin path is not found, return an empty string.
		return '';
	}
}

