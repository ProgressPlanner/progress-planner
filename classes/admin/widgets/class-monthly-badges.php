<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use DateTime;

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

		$target_points = 10; // TARGET_POINTS constant value.

		return [
			'score'        => (int) $score,
			'target'       => $target_points,
			'target_score' => (int) \min( $target_points, \max( 0, \floor( $score ) ) ),
		];
	}

	/**
	 * Get previous month badge.
	 *
	 * Note: This method is deprecated. Badge calculations are now handled in React.
	 * Returns empty array as badge data is fetched via REST API.
	 *
	 * @return array Empty array (badges are handled in React).
	 */
	public function get_previous_incomplete_months_badges() {
		// Badge calculations are now handled in React via REST API.
		// This method is kept for backward compatibility but returns empty array.
		return [];
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
