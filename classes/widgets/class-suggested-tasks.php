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
	 * Get the localized data for the script.
	 *
	 * @return array<string, array|string>
	 */
	public function get_localized_data() {
		// If there are newly added task providers, delay the celebration in order not to get confetti behind the popover.
		$delay_celebration = \progress_planner()->get_plugin_upgrade_tasks()->should_show_upgrade_popover();

		// Get tasks from task providers and pending_celebration tasks.
		$tasks = \progress_planner()->get_suggested_tasks()->get_pending_tasks_with_details();

		// If we're not delaying the celebration, we need to get the pending_celebration tasks.
		if ( ! $delay_celebration ) {
			$pending_celebration_tasks = \progress_planner()->get_suggested_tasks()->get_tasks_by( 'status', 'pending_celebration' );

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

		// We want to hide user tasks.
		if ( isset( $max_items_per_category['user'] ) ) {
			$max_items_per_category['user'] = 0;
		}

		$localize_data = [
			'ajaxUrl'             => \admin_url( 'admin-ajax.php' ),
			'nonce'               => \wp_create_nonce( 'progress_planner' ),
			'tasks'               => array_values( $final_tasks ),
			'maxItemsPerCategory' => apply_filters( 'progress_planner_suggested_tasks_max_items_per_category', $max_items_per_category ),
			'delayCelebration'    => $delay_celebration,
		];

		return [
			'handle' => 'prplSuggestedTasks',
			'data'   => $localize_data,
		];
	}

	/**
	 * Get the stylesheet dependencies.
	 *
	 * @return array
	 */
	public function get_stylesheet_dependencies() {
		// Register styles for the web-component.
		\wp_register_style(
			'progress-planner-web-components-prpl-suggested-task',
			PROGRESS_PLANNER_URL . '/assets/css/web-components/prpl-suggested-task.css',
			[],
			\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/css/web-components/prpl-suggested-task.css' )
		);

		return [
			'progress-planner-web-components-prpl-suggested-task',
		];
	}
}
