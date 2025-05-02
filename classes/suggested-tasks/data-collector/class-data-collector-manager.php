<?php
/**
 * Data collector manager.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Suggested_Tasks\Data_Collector;

/**
 * Manages the collection and initialization of data collectors.
 */
class Data_Collector_Manager {

	/**
	 * The data collectors.
	 *
	 * @var array<Base_Data_Collector>
	 */
	protected array $data_collectors = [];

	/**
	 * Files to exclude from automatic loading.
	 *
	 * @var array<string>
	 */
	protected const EXCLUDED_FILES = [
		'class-data-collector-manager.php',
		'class-base-data-collector.php',
	];

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->load_data_collectors();
		$this->initialize_collectors();

		// Update the cache once per day.
		\add_action( 'admin_init', [ $this, 'update_data_collectors_cache' ] );
	}

	/**
	 * Load all data collectors from the directory.
	 *
	 * @return void
	 */
	protected function load_data_collectors() {
		$files = \glob( __DIR__ . '/*.php' );

		if ( ! $files ) {
			return;
		}

		foreach ( $files as $file ) {
			if ( $this->should_skip_file( $file ) ) {
				continue;
			}

			$class_name = $this->get_class_name_from_file( $file );
			$collector  = new $class_name();

			if ( ! $collector instanceof Base_Data_Collector ) {
				continue;
			}

			$this->data_collectors[] = $collector;
		}
	}

	/**
	 * Check if a file should be skipped during loading.
	 *
	 * @param string $file_path The full path to the file.
	 * @return bool
	 */
	protected function should_skip_file( string $file_path ) {
		return in_array( \basename( $file_path ), self::EXCLUDED_FILES, true );
	}

	/**
	 * Convert a file path to its corresponding class name.
	 *
	 * @param string $file_path The full path to the file.
	 * @return string The fully qualified class name.
	 */
	protected function get_class_name_from_file( string $file_path ) {
		$class_name = \basename( $file_path );
		$class_name = \str_replace( [ 'class-', '.php' ], '', $class_name );
		$class_name = implode( '_', array_map( 'ucfirst', explode( '-', $class_name ) ) );

		return '\\Progress_Planner\\Suggested_Tasks\\Data_Collector\\' . $class_name;
	}

	/**
	 * Initialize all loaded data collectors.
	 *
	 * @return void
	 */
	protected function initialize_collectors() {
		foreach ( $this->data_collectors as $collector ) {
			$collector->init();
		}
	}

	/**
	 * Update the data collectors cache once per day.
	 *
	 * @return void
	 */
	public function update_data_collectors_cache() {
		$update_recently_performed = \progress_planner()->get_utils__cache()->get( 'update_data_collectors_cache' );

		if ( $update_recently_performed ) {
			return;
		}

		foreach ( $this->data_collectors as $collector ) {
			$collector->update_cache();
		}

		\progress_planner()->get_utils__cache()->set( 'update_data_collectors_cache', true, DAY_IN_SECONDS );
	}
}
