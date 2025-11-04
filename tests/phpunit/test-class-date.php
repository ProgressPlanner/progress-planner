<?php
/**
 * Class Date_Test
 *
 * @package Progress_Planner\Tests
 */

namespace Progress_Planner\Tests;

/**
 * Date test case.
 */
class Date_Test extends \WP_UnitTestCase {

	/**
	 * Test get_range.
	 */
	public function test_get_range() {
		$start_date = new \DateTime( '2020-01-01' );
		$end_date   = new \DateTime( '2020-01-31' );
		$range      = \progress_planner()->get_utils__date()->get_range( $start_date, $end_date );
		$this->assertEquals( '2020-01-01', $range['start_date']->format( 'Y-m-d' ) );
		$this->assertEquals( '2020-01-30', $range['end_date']->format( 'Y-m-d' ) ); // Excludes end date.
	}

	/**
	 * Test get_periods.
	 *
	 * @dataProvider data_get_periods
	 *
	 * @param \DateTime $start_date The start date.
	 * @param \DateTime $end_date   The end date.
	 * @param string    $frequency  The frequency.
	 */
	public function test_get_periods( $start_date, $end_date, $frequency ) {
		$periods = \progress_planner()->get_utils__date()->get_periods( $start_date, $end_date, $frequency );
		$this->assertEquals( $start_date, $periods[0]['start_date'] );
		$this->assertEquals( $end_date, \end( $periods )['end_date']->modify( '+1 day' ) );
	}

	/**
	 * Data provider for test_get_periods.
	 */
	public function data_get_periods() {
		return [
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-12-31' ), 'daily' ],
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-12-31' ), 'weekly' ],
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-12-31' ), 'monthly' ],
			[ new \DateTime( '1987-01-04' ), new \DateTime( '2147-01-27' ), 'daily' ],
			[ new \DateTime( '1987-05-16' ), new \DateTime( '2147-05-12' ), 'weekly' ],
			[ new \DateTime( '1987-02-06' ), new \DateTime( '2147-03-08' ), 'monthly' ],
		];
	}

	/**
	 * Test get_days_between_dates.
	 *
	 * @dataProvider data_get_days_between_dates
	 *
	 * @param \DateTime $start_date The start date.
	 * @param \DateTime $end_date   The end date.
	 * @param int       $expected   The expected number of days.
	 */
	public function test_get_days_between_dates( $start_date, $end_date, $expected ) {
		$this->assertEquals(
			$expected,
			\progress_planner()->get_utils__date()->get_days_between_dates( $start_date, $end_date )
		);
	}

	/**
	 * Data provider for test_get_days_between_dates.
	 */
	public function data_get_days_between_dates() {
		return [
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-01-31' ), 30 ],
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-01-01' ), 0 ],
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-01-02' ), 1 ],
			[ new \DateTime( '2020-01-01' ), new \DateTime( '2020-01-03' ), 2 ],
			[ new \DateTime( '2020-01-04' ), new \DateTime( '2020-01-01' ), -3 ],
		];
	}
}
