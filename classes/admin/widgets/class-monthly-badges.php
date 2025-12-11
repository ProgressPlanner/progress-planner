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
	 * Enqueue scripts for this widget.
	 *
	 * @return void
	 */
	/**
	 * Get widget configuration.
	 *
	 * @return array Widget configuration.
	 */
	public function get_widget_config() {
		// Get widget title (may be custom branded or default).
		$widget_title = \progress_planner()->get_ui__branding()->get_widget_title(
			'monthly-badges',
			\esc_html__( 'Your monthly badge', 'progress-planner' )
		);

		return [
			'title' => $widget_title,
		];
	}
}
