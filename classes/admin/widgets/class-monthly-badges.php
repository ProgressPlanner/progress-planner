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
			\constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/suggested-task.css',
			[],
			\progress_planner()->get_file_version( \constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/suggested-task.css' )
		);

		return [
			'progress-planner-suggested-task',
		];
	}
}
