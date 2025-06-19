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
 * Suggested_Tasks class.
 */
final class Suggested_Tasks extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'suggested-tasks';

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
			'target_score' => (int) min( Monthly::TARGET_POINTS, max( 0, floor( $score ) ) ),
		];
	}

	/**
	 * Get previous month badge.
	 *
	 * @return \Progress_Planner\Badges\Monthly|null
	 */
	public function get_previous_incomplete_month_badge() {
		$minus_one_month       = ( new DateTime() )->modify( 'first day of previous month' );
		$minus_one_month_badge = Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( $minus_one_month ) );
		if ( $minus_one_month_badge && $minus_one_month_badge->progress_callback()['progress'] < 100 ) {
			return $minus_one_month_badge;
		}

		$minus_two_months       = ( new DateTime() )->modify( 'first day of previous month' )->modify( 'first day of previous month' );
		$minus_two_months_badge = Monthly::get_instance_from_id( Monthly::get_badge_id_from_date( $minus_two_months ) );
		if ( $minus_two_months_badge && $minus_two_months_badge->progress_callback()['progress'] < 100 ) {
			return $minus_two_months_badge;
		}

		return null;
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		parent::enqueue_scripts();

		// Enqueue the badge scroller script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'widgets/suggested-tasks-badge-scroller',
		);
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
			constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/suggested-task.css',
			[],
			\progress_planner()->get_file_version( constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/suggested-task.css' )
		);

		return [
			'progress-planner-suggested-task',
		];
	}
}
