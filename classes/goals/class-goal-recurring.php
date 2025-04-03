<?php
/**
 * A recurring goal.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Goals;

/**
 * A recurring goal.
 */
class Goal_Recurring {

	/**
	 * The goal object.
	 *
	 * @var \Progress_Planner\Goals\Goal
	 */
	private $goal;

	/**
	 * The goal frequency.
	 *
	 * @var string
	 */
	private $frequency;

	/**
	 * The start date.
	 *
	 * @var \DateTime
	 */
	private $start_date;

	/**
	 * The end date.
	 *
	 * @var \DateTime
	 */
	private $end_date;

	/**
	 * The number of breaks in the streak that are allowed.
	 *
	 * @var int
	 */
	private $allowed_break = 0;

	/**
	 * An array of occurences.
	 *
	 * @var \Progress_Planner\Goals\Goal[]
	 */
	private $occurences = [];

	/**
	 * An array of instances for this class.
	 *
	 * @var Goal_Recurring[]
	 */
	private static $instances = [];

	/**
	 * Get an instance of this class.
	 *
	 * @param string $id        The recurring goal ID.
	 * @param array  $goal_args The goal arguments.
	 * @param array  $args      The recurring goal arguments.
	 *
	 * @return Goal_Recurring
	 */
	public static function get_instance( $id, $goal_args, $args ) {
		if ( ! isset( self::$instances[ $id ] ) ) {
			self::$instances[ $id ] = new self(
				new $goal_args['class_name']( $goal_args ), // @phpstan-ignore-line argument.type
				$args
			);
		}
		return self::$instances[ $id ];
	}

	/**
	 * Constructor.
	 *
	 * @param \Progress_Planner\Goals\Goal $goal      The goal object.
	 * @param array                        $args      The arguments.
	 *                                     [
	 *                                       string    'frequency'     The goal frequency.
	 *                                       \DateTime 'start_date'    The start date.
	 *                                       \DateTime 'end_date'      The end date.
	 *                                       int       'allowed_break' The number of breaks in the streak that are allowed.
	 *                                     ].
	 */
	private function __construct( $goal, $args ) {
		$this->goal          = $goal;
		$this->frequency     = $args['frequency'];
		$this->start_date    = $args['start_date'];
		$this->end_date      = $args['end_date'];
		$this->allowed_break = $args['allowed_break'] ?? 0;
	}

	/**
	 * Get the goal title.
	 *
	 * @return \Progress_Planner\Goals\Goal
	 */
	public function get_goal() {
		return $this->goal;
	}

	/**
	 * Build an array of occurences for the goal.
	 *
	 * @return \Progress_Planner\Goals\Goal[]
	 */
	public function get_occurences() {
		if ( ! empty( $this->occurences ) ) {
			return $this->occurences;
		}
		$ranges = \progress_planner()->get_utils__date()->get_periods( $this->start_date, $this->end_date, $this->frequency );

		if ( empty( $ranges ) ) {
			return $this->occurences;
		}

		// If the last range ends before today, add a new range.
		if ( (int) gmdate( 'Ymd' ) > (int) end( $ranges )['end_date']->format( 'Ymd' ) ) {
			$ranges[] = \progress_planner()->get_utils__date()->get_range(
				end( $ranges )['end_date'],
				new \DateTime( 'tomorrow' )
			);
		}

		foreach ( $ranges as $range ) {
			$goal = clone $this->goal;
			$goal->set_start_date( $range['start_date'] );
			$goal->set_end_date( $range['end_date'] );
			$this->occurences[] = $goal;
		}

		return $this->occurences;
	}

	/**
	 * Get the streak for weekly posts.
	 *
	 * @return array
	 */
	public function get_streak() {
		// Reverse the order of the occurences.
		$occurences = $this->get_occurences();

		// Calculate the streak number.
		$streak_nr  = 0;
		$max_streak = 0;
		foreach ( $occurences as $occurence ) {
			/**
			 * Evaluate the occurence.
			 * If the occurence is true, then increment the streak number.
			 * Otherwise, reset the streak number.
			 */
			$evaluation = $occurence->evaluate();
			if ( $evaluation ) {
				++$streak_nr;
				$max_streak = max( $max_streak, $streak_nr );
				continue;
			}

			if ( $this->allowed_break > 0 ) {
				--$this->allowed_break;
				continue;
			}

			$streak_nr = 0;
		}

		return [
			'max_streak'     => $max_streak,
			'current_streak' => $streak_nr,
			'title'          => $this->get_goal()->get_details()['title'],
			'description'    => $this->get_goal()->get_details()['description'],
		];
	}
}
