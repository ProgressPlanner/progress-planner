<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

use Progress_Planner\Badges\Monthly;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Create;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Review;

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
	 * @return int The score.
	 */
	public function get_score() {
		$activities = \progress_planner()->get_query()->query_activities(
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

		return (int) min( Monthly::TARGET_POINTS, max( 0, floor( $score ) ) );
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {

		// If there are newly added task providers, delay the celebration in order not to get confetti behind the popover.
		$delay_celebration = \progress_planner()->get_plugin_upgrade_tasks()->should_show_upgrade_popover();

		// Get tasks from task providers and pending_celebration tasks.
		$tasks = \progress_planner()->get_suggested_tasks()->get_pending_tasks_with_details();

		// If we're not delaying the celebration, we need to get the pending_celebration tasks.
		if ( ! $delay_celebration ) {
			$pending_celebration_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by_status( 'pending_celebration' );

			foreach ( $pending_celebration_tasks as $key => $task ) {
				$task_id = $task['task_id'];

				$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider(
					Local_Task_Factory::create_task_from( 'id', $task_id )->get_provider_id()
				);

				if ( $task_provider && $task_provider->capability_required() ) {
					$task_details = \progress_planner()->get_suggested_tasks()->get_local()->get_task_details( $task_id );

					if ( $task_details ) {
						$task_details['priority'] = 'high'; // Celebrate tasks are always on top.
						$task_details['action']   = 'celebrate';
						$task_details['status']   = 'pending_celebration';

						// Award 2 points if last created post was long.
						if ( ( new Create() )->get_provider_id() === $task_provider->get_provider_id() ) {
							$task_details['points'] = $task_provider->get_points( $task_id );
						}

						$tasks[] = $task_details;
					}

					// Mark the pending celebration tasks as completed.
					\progress_planner()->get_suggested_tasks()->transition_task_status( $task_id, 'pending_celebration', 'completed' );
				}
			}
		}

		$final_tasks = [];
		foreach ( $tasks as $task ) {
			$task['status']                  = $task['status'] ?? 'pending';
			$final_tasks[ $task['task_id'] ] = $task;
		}

		$final_tasks = array_values( $final_tasks );

		foreach ( $final_tasks as $key => $task ) {
			$final_tasks[ $key ]['providerID'] = $task['provider_id'] ?? $task['category']; // category is used for remote tasks.
		}

		// Sort the final tasks by priority. The priotity can be "high", "medium", "low", or "none".
		uasort(
			$final_tasks,
			function ( $a, $b ) {
				$priority = [
					'high'   => 0,
					'medium' => 1,
					'low'    => 2,
					'none'   => 3,
				];

				$a['priority'] = ! isset( $a['priority'] ) || ! isset( $priority[ $a['priority'] ] ) ? 'none' : $a['priority'];
				$b['priority'] = ! isset( $b['priority'] ) || ! isset( $priority[ $b['priority'] ] ) ? 'none' : $b['priority'];

				return $priority[ $a['priority'] ] - $priority[ $b['priority'] ];
			}
		);

		$max_items_per_category = [];
		foreach ( $final_tasks as $task ) {
			$max_items_per_category[ $task['category'] ] = $task['category'] === ( new Review() )->get_provider_category() ? 2 : 1;
		}

		// We want all pending_celebration' tasks to be shown.
		if ( isset( $max_items_per_category['pending_celebration'] ) ) {
			$max_items_per_category['pending_celebration'] = 99;
		}

		// Check if current date is between Feb 12-16 to use hearts confetti.
		$confetti_options = [];
		// February 12 will be (string) '0212', and when converted to int it will be 212.
		// February 16 will be (string) '0216', and when converted to int it will be 216.
		// The integer conversion makes it easier and faster to compare the dates.
		$date_md = (int) \gmdate( 'md' );

		if ( 212 <= $date_md && $date_md <= 216 ) {
			$confetti_options = [
				[
					'particleCount' => 50,
					'scalar'        => 2.2,
					'shapes'        => [ 'heart' ],
					'colors'        => [ 'FFC0CB', 'FF69B4', 'FF1493', 'C71585' ],
				],
				[
					'particleCount' => 20,
					'scalar'        => 3.2,
					'shapes'        => [ 'heart' ],
					'colors'        => [ 'FFC0CB', 'FF69B4', 'FF1493', 'C71585' ],
				],
			];
		}

		$localize_data = [
			'ajaxUrl'             => \admin_url( 'admin-ajax.php' ),
			'nonce'               => \wp_create_nonce( 'progress_planner' ),
			'tasks'               => array_values( $final_tasks ),
			'maxItemsPerCategory' => apply_filters( 'progress_planner_suggested_tasks_max_items_per_category', $max_items_per_category ),
			'confettiOptions'     => $confetti_options,
			'delayCelebration'    => $delay_celebration,
			'raviIconUrl'         => PROGRESS_PLANNER_URL . '/assets/images/icon_progress_planner.svg',
		];

		foreach ( $this->get_badge_urls() as $context => $url ) {
			$localize_data[ $context . 'IconUrl' ] = $url;
		}

		// Enqueue the script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'widgets/suggested-tasks',
			[
				'name' => 'prplSuggestedTasks',
				'data' => $localize_data,
			]
		);
	}

	/**
	 * Get the badge URLs.
	 *
	 * @return string[] The badge URLs.
	 */
	private function get_badge_urls() {
		// Get the monthly badge URL.
		$monthly_badge       = \progress_planner()->get_badges()->get_badge( Monthly::get_badge_id_from_date( new \DateTime() ) );
		$badge_urls['month'] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $monthly_badge->get_id();

		// Get the content and maintenance badge URLs.
		foreach ( [ 'content', 'maintenance' ] as $context ) {
			$set_badges        = \progress_planner()->get_badges()->get_badges( $context );
			$badge_url_context = '';
			foreach ( $set_badges as $key => $badge ) {
				$progress = $badge->get_progress();
				if ( $progress['progress'] > 100 ) {
					$badge_urls[ $context ] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $badge->get_id();
				}
			}
			if ( ! isset( $badge_urls[ $context ] ) ) {
				// Fallback to the first badge in the set if no badge is completed.
				$badge_urls[ $context ] = \progress_planner()->get_remote_server_root_url() . '/wp-json/progress-planner-saas/v1/badge-svg/?badge_id=' . $set_badges[0]->get_id();
			}
		}

		return $badge_urls;
	}
}
