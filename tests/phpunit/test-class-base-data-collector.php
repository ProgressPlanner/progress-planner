<?php
/**
 * Tests for the Base Data Collector class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Tests;

use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;
use WP_UnitTestCase;

/**
 * Test the Base Data Collector class.
 */
class Test_Base_Data_Collector extends WP_UnitTestCase {

	/**
	 * Test data collector instance.
	 *
	 * @var Test_Concrete_Data_Collector
	 */
	private $collector;

	/**
	 * Set up before each test.
	 */
	public function set_up() {
		parent::set_up();
		$this->collector = new Test_Concrete_Data_Collector();

		// Clear cache.
		\progress_planner()->get_settings()->set( 'progress_planner_data_collector', [] );
	}

	/**
	 * Tear down after each test.
	 */
	public function tear_down() {
		\progress_planner()->get_settings()->set( 'progress_planner_data_collector', [] );
		parent::tear_down();
	}

	/**
	 * Test get_data_key returns the correct key.
	 */
	public function test_get_data_key() {
		$this->assertEquals( 'test_data', $this->collector->get_data_key() );
	}

	/**
	 * Test collect returns calculated data when not cached.
	 */
	public function test_collect_calculates_when_not_cached() {
		$result = $this->collector->collect();

		$this->assertEquals( 'calculated_value', $result );
		$this->assertEquals( 1, $this->collector->get_calculate_call_count() );
	}

	/**
	 * Test collect returns cached data when available.
	 */
	public function test_collect_uses_cache() {
		// First call - calculates.
		$result1 = $this->collector->collect();
		$this->assertEquals( 'calculated_value', $result1 );
		$this->assertEquals( 1, $this->collector->get_calculate_call_count() );

		// Second call - uses cache.
		$result2 = $this->collector->collect();
		$this->assertEquals( 'calculated_value', $result2 );
		$this->assertEquals( 1, $this->collector->get_calculate_call_count() ); // Still 1, not recalculated.
	}

	/**
	 * Test update_cache forces recalculation.
	 */
	public function test_update_cache() {
		// Initial collect.
		$result1 = $this->collector->collect();
		$this->assertEquals( 'calculated_value', $result1 );
		$this->assertEquals( 1, $this->collector->get_calculate_call_count() );

		// Update cache.
		$this->collector->update_cache();
		$this->assertEquals( 2, $this->collector->get_calculate_call_count() );

		// Collect again - should use the updated cache.
		$result2 = $this->collector->collect();
		$this->assertEquals( 'calculated_value', $result2 );
		$this->assertEquals( 2, $this->collector->get_calculate_call_count() ); // Still 2.
	}

	/**
	 * Test caching different data types.
	 */
	public function test_cache_different_data_types() {
		$collector_array = new Test_Array_Data_Collector();
		$result          = $collector_array->collect();
		$this->assertEquals( [ 'foo' => 'bar' ], $result );

		$collector_int = new Test_Int_Data_Collector();
		$result        = $collector_int->collect();
		$this->assertEquals( 42, $result );
	}

	/**
	 * Test init method can be overridden.
	 */
	public function test_init_method() {
		$collector = new Test_Init_Data_Collector();
		$collector->init();
		$this->assertTrue( $collector->is_initialized() );
	}
}

/**
 * Concrete implementation for testing.
 */
class Test_Concrete_Data_Collector extends Base_Data_Collector {
	protected const DATA_KEY = 'test_data';

	/**
	 * Track the number of times calculate_data is called.
	 *
	 * @var int
	 */
	private $calculate_call_count = 0;

	/**
	 * Calculate the data.
	 *
	 * @return string
	 */
	protected function calculate_data() {
		++$this->calculate_call_count;
		return 'calculated_value';
	}

	/**
	 * Get the number of times calculate_data has been called.
	 *
	 * @return int
	 */
	public function get_calculate_call_count() {
		return $this->calculate_call_count;
	}
}

/**
 * Test collector that returns an array.
 */
class Test_Array_Data_Collector extends Base_Data_Collector {
	protected const DATA_KEY = 'test_array';

	/**
	 * Calculate the data.
	 *
	 * @return array<string, string>
	 */
	protected function calculate_data() {
		return [ 'foo' => 'bar' ];
	}
}

/**
 * Test collector that returns an integer.
 */
class Test_Int_Data_Collector extends Base_Data_Collector {
	protected const DATA_KEY = 'test_int';

	/**
	 * Calculate the data.
	 *
	 * @return int
	 */
	protected function calculate_data() {
		return 42;
	}
}

/**
 * Test collector with custom init.
 */
class Test_Init_Data_Collector extends Base_Data_Collector {
	protected const DATA_KEY = 'test_init';

	/**
	 * Track whether the collector has been initialized.
	 *
	 * @var bool
	 */
	private $initialized = false;

	/**
	 * Calculate the data.
	 *
	 * @return string
	 */
	protected function calculate_data() {
		return 'test';
	}

	/**
	 * Initialize the collector.
	 */
	public function init() {
		$this->initialized = true;
	}

	/**
	 * Check if the collector has been initialized.
	 *
	 * @return bool
	 */
	public function is_initialized() {
		return $this->initialized;
	}
}
