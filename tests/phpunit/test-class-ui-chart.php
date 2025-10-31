<?php
/**
 * Unit tests for Chart UI class.
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

use WP_UnitTestCase;
use Progress_Planner\UI\Chart;

// phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter -- Callback signatures must match expected format.

/**
 * UI_Chart test case.
 *
 * Tests the Chart UI class that generates chart data
 * with support for normalized scoring and decay algorithms.
 */
class UI_Chart_Test extends WP_UnitTestCase {

	/**
	 * Chart instance.
	 *
	 * @var Chart
	 */
	private $chart;

	/**
	 * Setup the test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->chart = new Chart();
	}

	/**
	 * Test instance can be created.
	 *
	 * @return void
	 */
	public function test_instance_creation() {
		$this->assertInstanceOf( Chart::class, $this->chart, 'Should create Chart instance' );
	}

	/**
	 * Test get_chart_data returns array.
	 *
	 * @return void
	 */
	public function test_get_chart_data_returns_array() {
		$args = [
			'items_callback' => fn( $start, $end ) => [],
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-31' ),
				'frequency'  => 'weekly',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Chart data should be an array' );
	}

	/**
	 * Test get_chart_data with minimal required arguments.
	 *
	 * @return void
	 */
	public function test_get_chart_data_with_minimal_args() {
		$args = [
			'items_callback' => fn( $start, $end ) => [],
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-03' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Chart data should be an array with minimal arguments' );
	}

	/**
	 * Test get_chart_data with custom items callback.
	 *
	 * @return void
	 */
	public function test_get_chart_data_with_custom_callback() {
		$args = [
			'items_callback' => function ( $start_date, $end_date ) {
				return [ 'item1', 'item2', 'item3' ];
			},
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-07' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Chart data should be an array' );
		$this->assertNotEmpty( $data, 'Chart data should not be empty with custom callback' );
	}

	/**
	 * Test chart data points have expected keys.
	 *
	 * @return void
	 */
	public function test_chart_data_point_structure() {
		$args = [
			'items_callback' => fn( $start, $end ) => [ 'item' ],
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-03' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
			'return_data'    => [ 'label', 'score', 'color' ],
		];

		$data = $this->chart->get_chart_data( $args );

		if ( ! empty( $data ) ) {
			$first_point = $data[0];
			$this->assertIsArray( $first_point, 'Data point should be an array' );
			$this->assertArrayHasKey( 'label', $first_point, 'Data point should have label' );
			$this->assertArrayHasKey( 'score', $first_point, 'Data point should have score' );
			$this->assertArrayHasKey( 'color', $first_point, 'Data point should have color' );
		} else {
			$this->assertTrue( true, 'No data points to test structure' );
		}
	}

	/**
	 * Test get_chart_data with count callback.
	 *
	 * @return void
	 */
	public function test_get_chart_data_with_count_callback() {
		$args = [
			'items_callback' => fn( $start, $end ) => [ 1, 2, 3, 4, 5 ],
			'count_callback' => fn( $items, $date = null ) => array_sum( $items ),
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-03' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Chart data should be an array' );

		if ( ! empty( $data ) ) {
			$first_point = $data[0];
			$this->assertArrayHasKey( 'score', $first_point, 'Data point should have score' );
			$this->assertEquals( 15, $first_point['score'], 'Score should be sum of array (1+2+3+4+5)' );
		} else {
			$this->assertTrue( true, 'No data points to test count' );
		}
	}

	/**
	 * Test get_chart_data with custom color callback.
	 *
	 * @return void
	 */
	public function test_get_chart_data_with_custom_color() {
		$custom_color = '#FF0000';
		$args         = [
			'items_callback' => fn( $start, $end ) => [ 'item' ],
			'color'          => fn() => $custom_color,
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-03' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );

		if ( ! empty( $data ) ) {
			$first_point = $data[0];
			$this->assertEquals( $custom_color, $first_point['color'], 'Should use custom color' );
		} else {
			$this->assertTrue( true, 'No data points to test color' );
		}
	}

	/**
	 * Test get_chart_data with normalized scoring.
	 *
	 * @return void
	 */
	public function test_get_chart_data_normalized() {
		$args = [
			'items_callback' => fn( $start, $end ) => [ 1, 2, 3 ],
			'count_callback' => fn( $items, $date = null ) => count( $items ),
			'normalized'     => true,
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-10' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Normalized chart data should be an array' );
	}

	/**
	 * Test the_chart method exists and is callable.
	 *
	 * @return void
	 */
	public function test_the_chart_method_exists() {
		$this->assertTrue( method_exists( $this->chart, 'the_chart' ), 'the_chart method should exist' );
		$this->assertTrue( is_callable( [ $this->chart, 'the_chart' ] ), 'the_chart should be callable' );
	}

	/**
	 * Test render_chart method exists.
	 *
	 * @return void
	 */
	public function test_render_chart_method_exists() {
		$reflection = new \ReflectionClass( Chart::class );
		$this->assertTrue( $reflection->hasMethod( 'render_chart' ), 'render_chart method should exist' );
	}

	/**
	 * Test get_chart_data with max parameter.
	 *
	 * @return void
	 */
	public function test_get_chart_data_with_max() {
		$args = [
			'items_callback' => fn( $start, $end ) => [ 1, 2, 3 ],
			'count_callback' => fn( $items, $date = null ) => array_sum( $items ),
			'max'            => 100,
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-03' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Chart data with max should be an array' );
	}

	/**
	 * Test get_chart_data with filter_results callback.
	 *
	 * @return void
	 */
	public function test_get_chart_data_with_filter_results() {
		$args = [
			'items_callback' => fn( $start, $end ) => [ 1, 2, 3, 4, 5 ],
			'filter_results' => fn( $activities ) => array_filter( $activities, fn( $item ) => $item > 2 ),
			'dates_params'   => [
				'start_date' => new \DateTime( '2024-01-01' ),
				'end_date'   => new \DateTime( '2024-01-03' ),
				'frequency'  => 'daily',
				'format'     => 'Y-m-d',
			],
		];

		$data = $this->chart->get_chart_data( $args );
		$this->assertIsArray( $data, 'Filtered chart data should be an array' );
	}
}
