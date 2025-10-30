<?php
/**
 * Base data collector.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Base data collector.
 */
abstract class Base_Data_Collector {

	/**
	 * The cache key.
	 *
	 * @var string
	 */
	protected const CACHE_KEY = 'progress_planner_data_collector';

	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = '';

	/**
	 * Calculate the data.
	 *
	 * @return mixed
	 */
	abstract protected function calculate_data();

	/**
	 * Get the data key.
	 *
	 * @return string
	 */
	public function get_data_key() {
		return static::DATA_KEY;
	}

	/**
	 * Initialize the data collector.
	 *
	 * @return void
	 */
	public function init() {}

	/**
	 * Collect the data.
	 *
	 * @return mixed
	 */
	public function collect() {
		// Try to get cached value.
		$data = $this->get_cached_data( $this->get_data_key() );
		if ( null !== $data ) {
			return $data;
		}

		// If no cache, calculate fresh value.
		$data = $this->calculate_data();

		// Store in cache.
		$this->set_cached_data( static::DATA_KEY, $data );

		return $data;
	}

	/**
	 * Update the cache.
	 *
	 * @return void
	 */
	public function update_cache() {
		$this->set_cached_data( $this->get_data_key(), $this->calculate_data() );
	}

	/**
	 * Get the cached data.
	 *
	 * @param string $key The key.
	 *
	 * @return mixed
	 */
	protected function get_cached_data( string $key ) {
		$data = \progress_planner()->get_settings()->get( static::CACHE_KEY, [] );
		return $data[ $key ] ?? null;
	}

	/**
	 * Set the cached data.
	 *
	 * @param string $key   The key.
	 * @param mixed  $value The value.
	 *
	 * @return void
	 */
	protected function set_cached_data( string $key, $value ) {
		$data         = \progress_planner()->get_settings()->get( static::CACHE_KEY, [] );
		$data[ $key ] = $value;
		\progress_planner()->get_settings()->set( static::CACHE_KEY, $data );
	}

	/**
	 * Get filtered public taxonomies.
	 *
	 * Returns public taxonomies with exclusions applied via filter.
	 *
	 * @return array<string, string> Array of public taxonomy names.
	 */
	protected function get_filtered_public_taxonomies() {
		/**
		 * Array of public taxonomy names where both keys and values are taxonomy names.
		 *
		 * @var array<string, string> $public_taxonomies
		 */
		$public_taxonomies = \get_taxonomies( [ 'public' => true ], 'names' );

		/**
		 * Array of public taxonomies to exclude from queries.
		 *
		 * @var array<string> $exclude_public_taxonomies
		 */
		$exclude_public_taxonomies = \apply_filters(
			'progress_planner_exclude_public_taxonomies',
			[
				'post_format',
				'product_shipping_class',
				'prpl_recommendations_provider',
				'gblocks_pattern_collections',
			]
		);

		foreach ( $exclude_public_taxonomies as $taxonomy ) {
			if ( isset( $public_taxonomies[ $taxonomy ] ) ) {
				unset( $public_taxonomies[ $taxonomy ] );
			}
		}

		return $public_taxonomies;
	}
}
