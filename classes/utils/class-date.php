<?php
/**
 * Helper object for date-related functions.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Utils;

/**
 * Date class.
 */
class Date {

	/**
	 * Get a range of dates.
	 *
	 * @param \DateTime $start_date The start date.
	 * @param \DateTime $end_date   The end date.
	 *
	 * @return array [
	 *                 'start_date' => \DateTime,
	 *                 'end_date'   => \DateTime,
	 *               ].
	 */
	public function get_range( $start_date, $end_date ) {
		$dates = \iterator_to_array( new \DatePeriod( $start_date, new \DateInterval( 'P1D' ), $end_date ), false );
		return [
			'start_date' => $dates[0],
			'end_date'   => \end( $dates ),
		];
	}

	/**
	 * Get an array of periods with start and end dates.
	 *
	 * @param \DateTime $start_date The start date.
	 * @param \DateTime $end_date   The end date.
	 * @param string    $frequency  The frequency. Can be 'daily', 'weekly', 'monthly'.
	 *
	 * @return array
	 */
	public function get_periods( $start_date, $end_date, $frequency ) {
		$end_date->modify( '+1 day' );

		switch ( $frequency ) {
			case 'daily':
				$interval = new \DateInterval( 'P1D' );
				break;

			case 'monthly':
				$interval = new \DateInterval( 'P1M' );
				break;

			default: // Default to weekly.
				$interval = new \DateInterval( 'P1W' );
				// Make sure we start and end on a Monday.
				$start_date->modify( 'last Monday' );
				$end_date->modify( 'next Monday' );
				break;
		}

		$period = \iterator_to_array( new \DatePeriod( $start_date, $interval, $end_date ), false );

		$date_ranges = [];
		foreach ( $period as $key => $date ) {
			if ( isset( $period[ $key + 1 ] ) ) {
				$date_ranges[] = $this->get_range( $date, $period[ $key + 1 ] );
			}
		}
		if ( empty( $date_ranges ) ) {
			return [];
		}
		if ( $end_date->format( 'z' ) !== \end( $date_ranges )['end_date']->format( 'z' ) ) {
			$final_end     = clone \end( $date_ranges )['end_date'];
			$date_ranges[] = $this->get_range( $final_end->modify( '+1 day' ), $end_date );
		}

		return $date_ranges;
	}

	/**
	 * Get DateTime object from a mysql date.
	 *
	 * @param string $date The date.
	 *
	 * @return \DateTime|false
	 */
	public function get_datetime_from_mysql_date( $date ) {
		return \DateTime::createFromFormat( 'U', (string) \mysql2date( 'U', $date ) );
	}

	/**
	 * Get number of days between two dates.
	 *
	 * @param \DateTime $date1 The first date.
	 * @param \DateTime $date2 The second date.
	 *
	 * @return int
	 */
	public function get_days_between_dates( $date1, $date2 ) {
		return (int) $date1->diff( $date2 )->format( '%R%a' );
	}
}
