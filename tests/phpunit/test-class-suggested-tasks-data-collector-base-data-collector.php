<?php
/**
 * Unit tests for Base_Data_Collector class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Mock data collector for testing.
 */
class Mock_Data_Collector extends Base_Data_Collector {
	/**
	 * The data key.
	 *
	 * @var string
	 */
	protected const DATA_KEY = 'test_data_key';

	/**
	 * Test data to return.
	 *
	 * @var mixed
	 */
	public $test_data = 'test_value';

	/**
	 * Calculate the data.
	 *
	 * @return mixed
	 */
	protected function calculate_data() {
		return $this->test_data;
	}
}

/**
 * Suggested_Tasks_Data_Collector_Base_Data_Collector test case.
 *
 * Tests the Base_Data_Collector abstract class that provides
 * caching and data collection functionality for task providers.
 */
class Suggested_Tasks_Data_Collector_Base_Data_Collector_Test extends WP_UnitTestCase {

	/**
	 * Mock data collector instance.
	 *
	 * @var Mock_Data_Collector
	 */
	private $collector;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->collector = new Mock_Data_Collector();

		// Clear any cached data.
		\progress_planner()->get_settings()->set( 'progress_planner_data_collector', [] );
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		// Clear cached data.
		\progress_planner()->get_settings()->set( 'progress_planner_data_collector', [] );
		parent::tearDown();
	}

	/**
	 * Test get_data_key returns correct key.
	 */
	public function test_get_data_key() {
		$this->assertEquals( 'test_data_key', $this->collector->get_data_key(), 'Should return DATA_KEY constant' );
	}

	/**
	 * Test init method exists and is callable.
	 */
	public function test_init_method_exists() {
		$this->assertTrue( method_exists( $this->collector, 'init' ), 'init method should exist' );
		$this->assertNull( $this->collector->init(), 'init should return null by default' );
	}

	/**
	 * Test collect method calculates and caches data.
	 */
	public function test_collect_calculates_and_caches() {
		$this->collector->test_data = 'fresh_data';

		$result = $this->collector->collect();

		$this->assertEquals( 'fresh_data', $result, 'Should return calculated data' );

		// Verify data was cached.
		$cached = \progress_planner()->get_settings()->get( 'progress_planner_data_collector', [] );
		$this->assertArrayHasKey( 'test_data_key', $cached, 'Data should be cached' );
		$this->assertEquals( 'fresh_data', $cached['test_data_key'], 'Cached data should match' );
	}

	/**
	 * Test collect returns cached data when available.
	 */
	public function test_collect_returns_cached_data() {
		// Set up cached data.
		\progress_planner()->get_settings()->set(
			'progress_planner_data_collector',
			[ 'test_data_key' => 'cached_value' ]
		);

		// Change test data (should not be used).
		$this->collector->test_data = 'new_value';

		$result = $this->collector->collect();

		$this->assertEquals( 'cached_value', $result, 'Should return cached data, not calculated data' );
	}

	/**
	 * Test collect handles null cached data correctly.
	 */
	public function test_collect_with_null_cache() {
		// Explicitly set null as cached value.
		\progress_planner()->get_settings()->set(
			'progress_planner_data_collector',
			[ 'test_data_key' => null ]
		);

		$this->collector->test_data = 'calculated';

		$result = $this->collector->collect();

		// Null is a valid cached value, so it should return null.
		$this->assertNull( $result, 'Should return cached null value' );
	}

	/**
	 * Test update_cache refreshes cached data.
	 */
	public function test_update_cache() {
		// Set initial cached data.
		\progress_planner()->get_settings()->set(
			'progress_planner_data_collector',
			[ 'test_data_key' => 'old_value' ]
		);

		// Update test data.
		$this->collector->test_data = 'updated_value';

		// Update cache.
		$this->collector->update_cache();

		// Verify cache was updated.
		$cached = \progress_planner()->get_settings()->get( 'progress_planner_data_collector', [] );
		$this->assertEquals( 'updated_value', $cached['test_data_key'], 'Cache should be updated with new value' );
	}

	/**
	 * Test get_filtered_public_taxonomies returns array.
	 */
	public function test_get_filtered_public_taxonomies() {
		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->collector );
		$method     = $reflection->getMethod( 'get_filtered_public_taxonomies' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->collector );

		$this->assertIsArray( $result, 'Should return array' );

		// Verify excluded taxonomies are not present.
		$this->assertArrayNotHasKey( 'post_format', $result, 'post_format should be excluded' );
		$this->assertArrayNotHasKey( 'prpl_recommendations_provider', $result, 'prpl_recommendations_provider should be excluded' );
	}

	/**
	 * Test get_filtered_public_taxonomies filter works.
	 */
	public function test_get_filtered_public_taxonomies_filter() {
		// Register a test taxonomy.
		register_taxonomy( 'test_taxonomy', 'post', [ 'public' => true ] );

		// Add filter to exclude our test taxonomy.
		add_filter(
			'progress_planner_exclude_public_taxonomies',
			function ( $excluded ) {
				$excluded[] = 'test_taxonomy';
				return $excluded;
			}
		);

		// Use reflection to call protected method.
		$reflection = new \ReflectionClass( $this->collector );
		$method     = $reflection->getMethod( 'get_filtered_public_taxonomies' );
		$method->setAccessible( true );

		$result = $method->invoke( $this->collector );

		$this->assertArrayNotHasKey( 'test_taxonomy', $result, 'Custom excluded taxonomy should not be present' );

		// Clean up.
		unregister_taxonomy( 'test_taxonomy' );
	}

	/**
	 * Test cached data persists across multiple collect calls.
	 */
	public function test_cache_persistence() {
		$this->collector->test_data = 'initial';

		// First collect - should calculate.
		$first = $this->collector->collect();
		$this->assertEquals( 'initial', $first, 'First collect should return calculated data' );

		// Change test data.
		$this->collector->test_data = 'changed';

		// Second collect - should return cached value.
		$second = $this->collector->collect();
		$this->assertEquals( 'initial', $second, 'Second collect should return cached data' );
	}

	/**
	 * Test collect with complex data types.
	 */
	public function test_collect_with_array_data() {
		$this->collector->test_data = [
			'key1' => 'value1',
			'key2' => [ 'nested' => 'data' ],
		];

		$result = $this->collector->collect();

		$this->assertIsArray( $result, 'Should handle array data' );
		$this->assertEquals( 'value1', $result['key1'], 'Array data should be preserved' );
		$this->assertEquals( 'data', $result['key2']['nested'], 'Nested array data should be preserved' );
	}

	/**
	 * Test multiple collectors don't interfere with each other.
	 */
	public function test_multiple_collectors_independence() {
		$collector1            = new Mock_Data_Collector();
		$collector1->test_data = 'collector1_data';

		// Create another mock class with different DATA_KEY.
		$collector2 = new class() extends Base_Data_Collector {
			protected const DATA_KEY = 'another_test_key';
			public $test_data        = 'collector2_data';
			protected function calculate_data() {
				return $this->test_data;
			}
		};

		$result1 = $collector1->collect();
		$result2 = $collector2->collect();

		$this->assertEquals( 'collector1_data', $result1, 'Collector 1 should return its own data' );
		$this->assertEquals( 'collector2_data', $result2, 'Collector 2 should return its own data' );

		// Verify both are cached independently.
		$cached = \progress_planner()->get_settings()->get( 'progress_planner_data_collector', [] );
		$this->assertEquals( 'collector1_data', $cached['test_data_key'], 'Collector 1 cache should be independent' );
		$this->assertEquals( 'collector2_data', $cached['another_test_key'], 'Collector 2 cache should be independent' );
	}
}
