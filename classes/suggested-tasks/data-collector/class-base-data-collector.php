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
		$settings = \progress_planner()->get_settings();
		$data     = $settings->get( static::CACHE_KEY, [] );
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
		$settings     = \progress_planner()->get_settings();
		$data         = $settings->get( static::CACHE_KEY, [] );
		$data[ $key ] = $value;
		$settings->set( static::CACHE_KEY, $data );
	}
}
