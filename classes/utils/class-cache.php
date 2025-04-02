<?php
/**
 * Progress Planner cache class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Cache class.
 */
class Cache {

	/**
	 * The cache prefix.
	 *
	 * @var string
	 */
	const CACHE_PREFIX = 'progress_planner_';

	/**
	 * Get a cached value.
	 *
	 * @param string $key The cache key.
	 *
	 * @return mixed|false The cached value or false if not found.
	 */
	public function get( $key ) {
		return \get_transient( self::CACHE_PREFIX . $key );
	}

	/**
	 * Set a cached value.
	 *
	 * @param string $key        The cache key.
	 * @param mixed  $value      The value to cache.
	 * @param int    $expiration The expiration time in seconds.
	 *
	 * @return void
	 */
	public function set( $key, $value, $expiration = WEEK_IN_SECONDS ) {
		\set_transient( self::CACHE_PREFIX . $key, $value, $expiration );
	}

	/**
	 * Delete a cached value.
	 *
	 * @param string $key The cache key.
	 *
	 * @return void
	 */
	public function delete( $key ) {
		\delete_transient( self::CACHE_PREFIX . $key );
	}

	/**
	 * Delete all cached values.
	 *
	 * @return void
	 */
	public function delete_all() {
		// Delete all transients with a key starting with the cache prefix.
		global $wpdb;
		$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"DELETE FROM $wpdb->options WHERE option_name LIKE %s",
				'_transient_' . self::CACHE_PREFIX . '%'
			)
		);
		$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"DELETE FROM $wpdb->options WHERE option_name LIKE %s",
				'_transient_timeout_' . self::CACHE_PREFIX . '%'
			)
		);
	}
}
