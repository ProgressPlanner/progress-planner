<?php
/**
 * Unit tests for Data_Collector_Manager class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\Suggested_Tasks\Data_Collector\Data_Collector_Manager;
use Progress_Planner\Suggested_Tasks\Data_Collector\Base_Data_Collector;

/**
 * Suggested_Tasks_Data_Collector_Data_Collector_Manager test case.
 *
 * Tests the Data_Collector_Manager class that manages all data collectors
 * and handles cache updates.
 */
class Suggested_Tasks_Data_Collector_Data_Collector_Manager_Test extends WP_UnitTestCase {

	/**
	 * Data_Collector_Manager instance.
	 *
	 * @var Data_Collector_Manager
	 */
	private $manager;

	/**
	 * Set up test environment.
	 */
	public function setUp(): void {
		parent::setUp();
		$this->manager = new Data_Collector_Manager();

		// Clear cache.
		\progress_planner()->get_utils__cache()->delete_all();
	}

	/**
	 * Tear down test environment.
	 */
	public function tearDown(): void {
		// Clear cache.
		\progress_planner()->get_utils__cache()->delete_all();
		parent::tearDown();
	}

	/**
	 * Test constructor instantiates data collectors.
	 */
	public function test_constructor_instantiates_collectors() {
		$manager = new Data_Collector_Manager();

		// Use reflection to access protected property.
		$reflection = new \ReflectionClass( $manager );
		$property   = $reflection->getProperty( 'data_collectors' );
		$property->setAccessible( true );

		$collectors = $property->getValue( $manager );

		$this->assertIsArray( $collectors, 'Should have array of collectors' );
		$this->assertNotEmpty( $collectors, 'Should have at least one collector' );

		// Verify all are Base_Data_Collector instances.
		foreach ( $collectors as $collector ) {
			$this->assertInstanceOf(
				Base_Data_Collector::class,
				$collector,
				'Each collector should extend Base_Data_Collector'
			);
		}
	}

	/**
	 * Test hooks are registered.
	 */
	public function test_hooks_registered() {
		// Check if plugins_loaded action is registered.
		$this->assertEquals(
			10,
			\has_action( 'plugins_loaded', [ $this->manager, 'add_plugin_integration' ] ),
			'plugins_loaded hook should be registered'
		);

		// Check if init action is registered.
		$this->assertEquals(
			99,
			\has_action( 'init', [ $this->manager, 'init' ] ),
			'init hook should be registered with priority 99'
		);

		// Check if admin_init action is registered.
		$this->assertEquals(
			10,
			\has_action( 'admin_init', [ $this->manager, 'update_data_collectors_cache' ] ),
			'admin_init hook should be registered'
		);
	}

	/**
	 * Test init method applies filter.
	 */
	public function test_init_applies_filter() {
		$filter_called = false;

		// Add filter to verify it's called.
		\add_filter(
			'progress_planner_data_collectors',
			function ( $collectors ) use ( &$filter_called ) {
				$filter_called = true;
				return $collectors;
			}
		);

		$this->manager->init();

		$this->assertTrue( $filter_called, 'progress_planner_data_collectors filter should be called' );
	}

	/**
	 * Test init method initializes all collectors.
	 */
	public function test_init_initializes_collectors() {
		// Create a mock collector that tracks init calls.
		$mock_collector = $this->getMockBuilder( Base_Data_Collector::class )
			->onlyMethods( [ 'calculate_data', 'init' ] )
			->getMock();

		$mock_collector->expects( $this->once() )
			->method( 'init' );

		// Add mock collector via filter.
		\add_filter(
			'progress_planner_data_collectors',
			function ( $collectors ) use ( $mock_collector ) {
				$collectors[] = $mock_collector;
				return $collectors;
			}
		);

		$this->manager->init();
	}

	/**
	 * Test add_plugin_integration method exists.
	 */
	public function test_add_plugin_integration_exists() {
		$this->assertTrue(
			\method_exists( $this->manager, 'add_plugin_integration' ),
			'add_plugin_integration method should exist'
		);
	}

	/**
	 * Test update_data_collectors_cache respects cache.
	 */
	public function test_update_cache_respects_cache() {
		// Set cache to prevent update.
		\progress_planner()->get_utils__cache()->set( 'update_data_collectors_cache', true, DAY_IN_SECONDS );

		// Create mock that should NOT be called.
		$mock_collector = $this->getMockBuilder( Base_Data_Collector::class )
			->onlyMethods( [ 'calculate_data', 'update_cache' ] )
			->getMock();

		$mock_collector->expects( $this->never() )
			->method( 'update_cache' );

		// Add mock via filter.
		\add_filter(
			'progress_planner_data_collectors',
			function ( $collectors ) use ( $mock_collector ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
				return [ $mock_collector ];
			}
		);

		// Initialize to apply filter.
		$this->manager->init();

		// This should not update cache because it's already set.
		$this->manager->update_data_collectors_cache();
	}

	/**
	 * Test update_data_collectors_cache updates when cache is empty.
	 */
	public function test_update_cache_when_empty() {
		// Ensure cache is clear.
		\progress_planner()->get_utils__cache()->delete( 'update_data_collectors_cache' );

		// Create mock that SHOULD be called.
		$mock_collector = $this->getMockBuilder( Base_Data_Collector::class )
			->onlyMethods( [ 'calculate_data', 'update_cache' ] )
			->getMock();

		$mock_collector->expects( $this->once() )
			->method( 'update_cache' );

		// Add mock via filter.
		\add_filter(
			'progress_planner_data_collectors',
			function ( $collectors ) use ( $mock_collector ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
				return [ $mock_collector ];
			}
		);

		// Initialize to apply filter.
		$this->manager->init();

		// This should update cache.
		$this->manager->update_data_collectors_cache();

		// Verify cache was set.
		$this->assertTrue(
			\progress_planner()->get_utils__cache()->get( 'update_data_collectors_cache' ),
			'Cache should be set after update'
		);
	}

	/**
	 * Test update_data_collectors_cache sets cache with correct expiration.
	 */
	public function test_update_cache_sets_expiration() {
		// Clear cache.
		\progress_planner()->get_utils__cache()->delete( 'update_data_collectors_cache' );

		// Run update.
		$this->manager->update_data_collectors_cache();

		// Verify cache is set.
		$cached = \progress_planner()->get_utils__cache()->get( 'update_data_collectors_cache' );
		$this->assertTrue( $cached, 'Cache should be set to true' );
	}

	/**
	 * Test filter can add custom collectors.
	 */
	public function test_filter_can_add_collectors() {
		$custom_collector = new class() extends Base_Data_Collector {
			protected const DATA_KEY = 'custom_test';
			/**
			 * Calculate the data. Dummy function.
			 *
			 * @return string
			 */
			protected function calculate_data() {
				return 'custom';
			}
		};

		// Add custom collector via filter.
		\add_filter(
			'progress_planner_data_collectors',
			function ( $collectors ) use ( $custom_collector ) {
				$collectors[] = $custom_collector;
				return $collectors;
			}
		);

		$this->manager->init();

		// Use reflection to verify custom collector was added.
		$reflection = new \ReflectionClass( $this->manager );
		$property   = $reflection->getProperty( 'data_collectors' );
		$property->setAccessible( true );

		$collectors = $property->getValue( $this->manager );

		$found = false;
		foreach ( $collectors as $collector ) {
			if ( $collector === $custom_collector ) {
				$found = true;
				break;
			}
		}

		$this->assertTrue( $found, 'Custom collector should be added via filter' );
	}

	/**
	 * Test data collectors have unique data keys.
	 */
	public function test_collectors_have_unique_keys() {
		// Use reflection to access collectors.
		$reflection = new \ReflectionClass( $this->manager );
		$property   = $reflection->getProperty( 'data_collectors' );
		$property->setAccessible( true );

		$collectors = $property->getValue( $this->manager );

		$keys = [];
		foreach ( $collectors as $collector ) {
			$key = $collector->get_data_key();
			$this->assertNotContains( $key, $keys, "Data key '{$key}' should be unique" );
			$keys[] = $key;
		}

		$this->assertNotEmpty( $keys, 'Should have collected data keys' );
	}
}
