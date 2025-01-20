<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

use Progress_Planner\Widget;
use Progress_Planner\Goals\Goal_Recurring;
use Progress_Planner\Goals\Goal;

/**
 * A widget class.
 */
final class Activity_Scores extends Widget {

	/**
	 * The widget ID.
	 *
	 * @var string
	 */
	protected $id = 'activity-scores';

	/**
	 * The color callback.
	 *
	 * @param int       $number The number to calculate the color for.
	 * @param \DateTime $date   The date.
	 *
	 * @return string The color.
	 */
	public function get_color( $number, $date ) {
		// If monthly and the latest month, return gray (in progress).
		if (
			'monthly' === $this->get_frequency() &&
			\gmdate( 'Y-m-01' ) === $date->format( 'Y-m-01' )
		) {
			return 'var(--prpl-color-gray-2)';
		}

		// If weekly and the current week, return gray (in progress).
		if (
			'weekly' === $this->get_frequency() &&
			\gmdate( 'Y-W' ) === $date->format( 'Y-W' )
		) {
			return 'var(--prpl-color-gray-2)';
		}

		if ( $number > 90 ) {
			return 'var(--prpl-color-accent-green)';
		}
		if ( $number > 30 ) {
			return 'var(--prpl-color-accent-orange)';
		}
		return '#f43f5e';
	}

	/**
	 * Get the score.
	 *
	 * @return int The score.
	 */
	public function get_score() {
		$activities = \progress_planner()->get_query()->query_activities(
			[
				// Use 31 days to take into account
				// the activities score decay from previous activities.
				'start_date' => new \DateTime( '-31 days' ),
			]
		);

		$score        = 0;
		$current_date = new \DateTime();
		foreach ( $activities as $activity ) {
			$score += $activity->get_points( $current_date );
		}
		$score = min( 100, max( 0, $score ) );

		// Get the number of pending updates.
		$pending_updates = \wp_get_update_data()['counts']['total'];

		// Reduce points for pending updates.
		$score -= min( min( $score / 2, 25 ), $pending_updates * 5 );
		return (int) floor( $score );
	}

	/**
	 * Get the checklist results.
	 *
	 * @return array<string, bool> The checklist results.
	 */
	public function get_checklist_results() {
		$items   = $this->get_checklist();
		$results = [];
		foreach ( $items as $item ) {
			$results[ $item['label'] ] = $item['callback']();
		}
		return $results;
	}

	/**
	 * Get the checklist items.
	 *
	 * @return array The checklist items.
	 */
	public function get_checklist() {
		return [
			[
				'label'    => \esc_html__( 'published content', 'progress-planner' ),
				'callback' => function () {
					$events = \progress_planner()->get_query()->query_activities(
						[
							'start_date' => new \DateTime( '-7 days' ),
							'category'   => 'content',
							'type'       => 'publish',
						]
					);
					return count( $events ) > 0;
				},
			],
			[
				'label'    => \esc_html__( 'updated content', 'progress-planner' ),
				'callback' => function () {
					$events = \progress_planner()->get_query()->query_activities(
						[
							'start_date' => new \DateTime( '-7 days' ),
							'category'   => 'content',
							'type'       => 'update',
						]
					);
					return count( $events ) > 0;
				},
			],
			[
				'label'    => 0 === \wp_get_update_data()['counts']['total']
					? \esc_html__( 'performed all updates', 'progress-planner' )
					: '<a href="' . \esc_url( \admin_url( 'update-core.php' ) ) . '">' . \esc_html__( 'Perform all updates', 'progress-planner' ) . '</a>',
				'callback' => function () {
					return ! \wp_get_update_data()['counts']['total'];
				},
			],
		];
	}

	/**
	 * Get the gauge color.
	 *
	 * @param int $score The score.
	 *
	 * @return string The color.
	 */
	public function get_gauge_color( $score ) {
		if ( $score >= 75 ) {
			return 'var(--prpl-color-accent-green)';
		}
		if ( $score >= 50 ) {
			return 'var(--prpl-color-accent-orange)';
		}
		return 'var(--prpl-color-accent-red)';
	}

	/**
	 * Get the personal record goal.
	 *
	 * @return array
	 */
	public function personal_record_callback() {
		$goal = Goal_Recurring::get_instance(
			'weekly_post_record',
			[
				'class_name'  => Goal::class,
				'id'          => 'weekly_post',
				'title'       => \esc_html__( 'Write a weekly blog post', 'progress-planner' ),
				'description' => \esc_html__( 'Streak: The number of weeks this goal has been accomplished consistently.', 'progress-planner' ),
				'status'      => 'active',
				'priority'    => 'low',
				'evaluate'    => function ( $goal_object ) {
					return (bool) count(
						\progress_planner()->get_query()->query_activities(
							[
								'category'   => 'content',
								'type'       => 'publish',
								'start_date' => $goal_object->get_details()['start_date'],
								'end_date'   => $goal_object->get_details()['end_date'],
							]
						)
					);
				},
			],
			[
				'frequency'     => 'weekly',
				'start_date'    => new \DateTime( '-2 years' ),
				'end_date'      => new \DateTime(), // Today.
				'allowed_break' => 0, // Do not allow breaks in the streak.
			]
		);

		return $goal->get_streak();
	}
}
