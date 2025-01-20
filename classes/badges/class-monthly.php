<?php
/**
 * Badge object.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Badges;

/**
 * Badge class.
 */
final class Monthly extends Badge {

	/**
	 * The target points.
	 *
	 * @var int
	 */
	const TARGET_POINTS = 10;

	/**
	 * The badge ID.
	 *
	 * @var string
	 */
	protected $id;

	/**
	 * An array of instances for this object (one/month).
	 *
	 * @var array
	 */
	protected static $instances = [];

	/**
	 * Contructor.
	 *
	 * @param string $id The badge ID.
	 */
	public function __construct( $id ) {
		$this->id = $id;
	}

	/**
	 * Get an array of instances (one for each month).
	 *
	 * @return array
	 */
	public static function init_badges() {

		if ( ! empty( self::$instances ) ) {
			return self::$instances;
		}

		$activation_date = \progress_planner()->get_base()->get_activation_date();
		$start_date      = $activation_date->modify( 'first day of this month' );

		// Year when plugin was released.
		$end_date = ( 2024 === (int) $start_date->format( 'Y' ) && 2024 === (int) \gmdate( 'Y' ) )
			? new \DateTime( 'last day of December next year' )
			: new \DateTime( 'last day of December this year' );

		$dates = iterator_to_array( new \DatePeriod( $start_date, new \DateInterval( 'P1M' ), $end_date ), false );

		// To make sure keys are defined only once and consistent.
		$self_months = array_keys( self::get_months() );

		foreach ( $dates as $date ) {
			$year  = (int) $date->format( 'Y' );
			$month = (int) $date->format( 'n' );
			$id    = 'monthly-' . $year . '-' . $self_months[ $month - 1 ];

			if ( ! isset( self::$instances[ $year ] ) ) {
				self::$instances[ $year ] = [];
			}

			self::$instances[ $year ][] = new self( $id );
		}

		return self::$instances;
	}

	/**
	 * Get an array of instances (one for each month).
	 *
	 * @return array
	 */
	public static function get_instances() {
		if ( empty( self::$instances ) ) {
			self::$instances = self::init_badges();
		}
		return self::$instances;
	}

	/**
	 * Get an array of instances (one for each month).
	 *
	 * @param int $year The year.
	 *
	 * @return array
	 */
	public static function get_instances_for_year( $year ) {
		if ( empty( self::$instances ) ) {
			self::$instances = self::init_badges();
		}
		return isset( self::$instances[ $year ] ) ? self::$instances[ $year ] : [];
	}

	/**
	 * Get an array of months.
	 *
	 * @return array
	 */
	public static function get_months() {
		/*
		 * Indexed months, The array keys are prefixed with an "m"
		 * so that they are strings and not integers.
		 */
		$months = [
			'm1'  => 'Jack January',
			'm2'  => 'Felix February',
			'm3'  => 'Mary March',
			'm4'  => 'Avery April',
			'm5'  => 'Matteo May',
			'm6'  => 'Jasmine June',
			'm7'  => 'Joey July',
			'm8'  => 'Abed August',
			'm9'  => 'Sam September',
			'm10' => 'Oksana October',
			'm11' => 'Noah November',
			'm12' => 'Daisy December',
		];
		return $months;
	}

	/**
	 * The badge name.
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->id
			? self::get_months()[ 'm' . $this->get_month() ]
			: '';
	}

	/**
	 * Get the badge description.
	 *
	 * @return string
	 */
	public function get_description() {
		return '';
	}

	/**
	 * Get the year for the month.
	 *
	 * @return string
	 */
	public function get_year() {
		return explode( '-', str_replace( 'monthly-', '', $this->id ) )[0];
	}

	/**
	 * Get the month for the badge.
	 *
	 * @return string
	 */
	public function get_month() {
		return str_replace( 'm', '', explode( '-', str_replace( 'monthly-', '', $this->id ) )[1] );
	}

	/**
	 * Progress callback.
	 *
	 * @return array
	 */
	public function progress_callback() {
		$saved_progress = $this->get_saved();

		// If we have a saved value, return it.
		if ( isset( $saved_progress['progress'] ) && isset( $saved_progress['remaining'] ) ) {
			return $saved_progress;
		}

		$month     = self::get_months()[ 'm' . $this->get_month() ];
		$year      = $this->get_year();
		$month_num = (int) $this->get_month();

		$start_date = \DateTime::createFromFormat( 'Y-m-d', "{$year}-{$month_num}-01" );
		$end_date   = \DateTime::createFromFormat( 'Y-m-d', "{$year}-{$month_num}-" . gmdate( 't', strtotime( $month ) ) );

		// Get the activities for the month.
		$activities = \progress_planner()->get_query()->query_activities(
			[
				'category'   => 'suggested_task',
				'start_date' => $start_date,
				'end_date'   => $end_date,
			],
		);

		$points = 0;
		foreach ( $activities as $activity ) {
			$points += $activity->get_points( $activity->date );
		}

		$return_progress = ( $points > self::TARGET_POINTS )
			? [
				'progress'  => 100,
				'remaining' => 0,
			] : [
				'progress'  => (int) max( 0, min( 100, floor( 100 * $points / self::TARGET_POINTS ) ) ),
				'remaining' => self::TARGET_POINTS - $points,
			];

		$this->save_progress( $return_progress );

		return $return_progress;
	}
}
