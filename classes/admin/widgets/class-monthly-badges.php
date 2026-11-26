<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use DateTime;
use Progress_Planner\Badges\Monthly;

/**
 * Monthly_Badges class.
 */
final class Monthly_Badges extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'monthly-badges';

	/**
	 * The popover data, computed once per request.
	 *
	 * @var array{months: int, badges: int, tasks: int, years: array<int, array{badges: int, tasks: int, items: array<int, array{badge: Monthly, progress: array, state: string}>}>}|null
	 */
	private $popover_stats = null;

	/**
	 * Get the score.
	 *
	 * @return array<string, int> The scores.
	 */
	public function get_score() {
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category'   => 'suggested_task',
				'start_date' => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-01' ) ),
				'end_date'   => \DateTime::createFromFormat( 'Y-m-d', \gmdate( 'Y-m-t' ) ),
			]
		);

		$score = 0;
		foreach ( $activities as $activity ) {
			$score += $activity->get_points( $activity->date );
		}

		return [
			'score'        => (int) $score,
			'target'       => (int) Monthly::TARGET_POINTS,
			'target_score' => (int) \min( Monthly::TARGET_POINTS, \max( 0, \floor( $score ) ) ),
		];
	}

	/**
	 * Get previous month badge.
	 *
	 * @return \Progress_Planner\Badges\Monthly[]
	 */
	public function get_previous_incomplete_months_badges() {
		$previous_incomplete_month_badges = [];

		$minus_one_month       = ( new DateTime() )->modify( 'first day of previous month' );
		$minus_one_month_badge = Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( $minus_one_month ) );
		if ( $minus_one_month_badge && $minus_one_month_badge->progress_callback()['progress'] < 100 ) {
			$previous_incomplete_month_badges[] = $minus_one_month_badge;
		}

		$minus_two_months       = ( new DateTime() )->modify( 'first day of previous month' )->modify( 'first day of previous month' );
		$minus_two_months_badge = Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( $minus_two_months ) );
		if ( $minus_two_months_badge && $minus_two_months_badge->progress_callback()['progress'] < 100 ) {
			$previous_incomplete_month_badges[] = $minus_two_months_badge;
		}

		return $previous_incomplete_month_badges;
	}

	/**
	 * Get everything the monthly badges popover shows.
	 *
	 * Each badge's progress is worked out once here; the template reads it
	 * from the result. Badges are the monthly badges earned; tasks are the
	 * completed tasks (recommendations and golden to-do tasks), counted from
	 * the first month that has a badge.
	 *
	 * @return array{months: int, badges: int, tasks: int, years: array<int, array{badges: int, tasks: int, items: array<int, array{badge: Monthly, progress: array, state: string}>}>}
	 */
	public function get_popover_stats() {
		if ( null !== $this->popover_stats ) {
			return $this->popover_stats;
		}

		$stats = [
			'months' => $this->get_months_since_activation(),
			'badges' => 0,
			'tasks'  => 0,
			'years'  => [],
		];

		foreach ( Monthly::get_instances() as $year => $year_badges ) {
			$year   = (int) $year;
			$badges = 0;
			$items  = [];
			foreach ( $year_badges as $badge ) {
				$progress = $badge->progress_callback();
				$items[]  = [
					'badge'    => $badge,
					'progress' => $progress,
					'state'    => $this->get_badge_state( $badge->get_id(), (int) $progress['progress'] ),
				];
				if ( 100 === (int) $progress['progress'] ) {
					++$badges;
				}
			}

			$tasks = 0;
			if ( ! empty( $year_badges ) ) {
				$tasks = \count(
					\progress_planner()->get_activities__query()->query_activities(
						[
							'category'   => 'suggested_task',
							'type'       => 'completed',
							'start_date' => new DateTime( \sprintf( '%d-%02d-01', $year, (int) $year_badges[0]->get_month() ) ),
							'end_date'   => new DateTime( "{$year}-12-31" ),
						]
					)
				);
			}

			$stats['years'][ $year ] = [
				'badges' => $badges,
				'tasks'  => $tasks,
				'items'  => $items,
			];
			$stats['badges']        += $badges;
			$stats['tasks']         += $tasks;
		}

		$this->popover_stats = $stats;
		return $stats;
	}

	/**
	 * Get the hover state of a badge in the monthly badges popover.
	 *
	 * - "missed": one of the previous two months, not complete, still earnable.
	 * - "in-progress": the current month, not complete yet.
	 * - "": no hover state (complete, future, or too old to earn).
	 *
	 * @param \Progress_Planner\Badges\Monthly $badge The badge.
	 *
	 * @return string
	 */
	public function get_popover_badge_state( $badge ) {
		return $this->get_badge_state( $badge->get_id(), (int) $badge->progress_callback()['progress'] );
	}

	/**
	 * Get a badge's hover state from its ID and progress.
	 *
	 * @param string $badge_id The badge ID.
	 * @param int    $progress The badge progress (0-100).
	 *
	 * @return string
	 */
	private function get_badge_state( $badge_id, $progress ) {
		if ( 100 <= $progress ) {
			return '';
		}

		$month = new DateTime( 'first day of this month' );
		if ( Monthly::get_badge_id_from_date( $month ) === $badge_id ) {
			return 'in-progress';
		}

		// The previous two months can still be earned.
		for ( $i = 0; $i < 2; $i++ ) {
			$month->modify( 'first day of previous month' );
			if ( Monthly::get_badge_id_from_date( $month ) === $badge_id ) {
				return 'missed';
			}
		}

		return '';
	}

	/**
	 * Get the number of months since the plugin was activated.
	 *
	 * Counts started months, so a site activated this month shows 1.
	 *
	 * @return int
	 */
	public function get_months_since_activation() {
		$activation = \progress_planner()->get_activation_date();
		$now        = new DateTime();
		$months     = ( (int) $now->format( 'Y' ) - (int) $activation->format( 'Y' ) ) * 12
			+ (int) $now->format( 'n' ) - (int) $activation->format( 'n' );

		return \max( 1, $months + 1 );
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		// Register styles for the web-component.
		\wp_register_style(
			'progress-planner-suggested-task',
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/suggested-task.css',
			[],
			\progress_planner()->get_file_version( \constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/suggested-task.css' )
		);

		return [
			'progress-planner-suggested-task',
		];
	}
}
