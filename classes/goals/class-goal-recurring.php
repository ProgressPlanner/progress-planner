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
		if ( (int) \gmdate( 'Ymd' ) > (int) \end( $ranges )['end_date']->format( 'Ymd' ) ) {
			$ranges[] = \progress_planner()->get_utils__date()->get_range(
				\end( $ranges )['end_date'],
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
	 * Calculate streak statistics for recurring goals.
	 *
	 * Streak calculation algorithm:
	 * 1. Iterate through all goal occurrences in chronological order
	 * 2. For each occurrence, check if the goal was met (evaluate() returns true)
	 * 3. If met: Increment current streak counter and update max streak if needed
	 * 4. If not met: Check if "allowed breaks" remain
	 *    - If yes: Use one allowed break and continue streak (decrement allowed_break)
	 *    - If no: Reset current streak to 0 (streak is broken)
	 *
	 * Allowed breaks feature:
	 * - Provides flexibility by allowing streaks to survive missed goals
	 * - Example: With 1 allowed break, missing one week won't reset the streak
	 * - Breaks are counted on a copy, so every call gives the same result
	 * - Once all breaks are consumed, any further miss resets the streak
	 * - The current period is still running, so a miss in it is ignored
	 *
	 * Streak types:
	 * - Current streak: Consecutive goals met from the most recent occurrence backwards
	 * - Max streak: Longest consecutive run of met goals in the entire history
	 *
	 * Example:
	 * Goals: [✓, ✓, ✗, ✓, ✓, ✓] with 1 allowed break
	 * - Current streak: 3 (last 3 goals met)
	 * - Max streak: 5 (streak continues through the ✗ using the allowed break)
	 *
	 * @return array {
	 *     Streak statistics and goal metadata.
	 *
	 *     @type int    $max_streak     The longest streak achieved (consecutive goals met).
	 *     @type int    $current_streak Current active streak (from most recent backwards).
	 *     @type bool   $freeze_used    Whether the allowed break (streak freeze) was used.
	 *     @type int    $freeze_week    The streak length when the break was used, or null.
	 *     @type string $title          The goal title.
	 *     @type string $description    The goal description.
	 * }
	 */
	public function get_streak() {
		// Get all occurrences of this recurring goal.
		$occurences = $this->get_occurences();

		// Initialize streak counters.
		$streak_nr  = 0; // Current ongoing streak.
		$max_streak = 0; // Best streak ever achieved.

		// Work on a copy: this object is cached and shared, so using up the
		// break here must not change the result of the next call.
		$allowed_break = $this->allowed_break;
		$freeze_used   = false;
		$freeze_week   = null; // The streak length when the break was used.

		$last_index = \count( $occurences ) - 1;
		foreach ( $occurences as $index => $occurence ) {
			// Check if this occurrence's goal was met.
			$evaluation = $occurence->evaluate();

			if ( $evaluation ) {
				// Goal was met: Increment streak and track if it's a new record.
				++$streak_nr;
				$max_streak = \max( $max_streak, $streak_nr );
				continue;
			}

			// The current period is not over yet: a miss so far is not a miss.
			if ( $index === $last_index && $this->is_ongoing( $occurence ) ) {
				continue;
			}

			// Goal was not met: Check if we can use an allowed break.
			if ( $allowed_break > 0 ) {
				// Use one allowed break to keep the streak alive.
				// This prevents the streak from resetting for this missed goal.
				--$allowed_break;
				$freeze_used = true;
				$freeze_week = $streak_nr;
				continue;
			}

			// No allowed breaks remaining: Streak is broken, reset to 0.
			$streak_nr = 0;
		}

		return [
			'max_streak'     => $max_streak,
			'current_streak' => $streak_nr,
			'freeze_used'    => $freeze_used,
			'freeze_week'    => $freeze_week,
			'title'          => $this->get_goal()->get_details()['title'],
			'description'    => $this->get_goal()->get_details()['description'],
		];
	}

	/**
	 * Whether an occurrence's period includes today.
	 *
	 * @param \Progress_Planner\Goals\Goal $occurence The occurrence.
	 *
	 * @return bool
	 */
	private function is_ongoing( $occurence ) {
		$end_date = $occurence->get_details()['end_date'] ?? null;
		return $end_date instanceof \DateTime && (int) $end_date->format( 'Ymd' ) >= (int) \gmdate( 'Ymd' );
	}
}
