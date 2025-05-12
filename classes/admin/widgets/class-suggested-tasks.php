<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Admin\Widgets;

use Progress_Planner\Badges\Monthly;
use Progress_Planner\Suggested_Tasks\Task_Factory;
use Progress_Planner\Suggested_Tasks\Providers\Content_Review;

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

		return (int) min( Monthly::TARGET_POINTS, max( 0, floor( $score ) ) );
	}

	/**
	 * Enqueue the scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// Get tasks from task providers and pending_celebration tasks.
		$tasks             = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'post_status' => 'publish' ] );
		$delay_celebration = false;

		// Celebrate only on the Progress Planner Dashboard page.
		if ( \progress_planner()->is_on_progress_planner_dashboard_page() ) {

			// If there are newly added task providers, delay the celebration in order not to get confetti behind the popover.
			$delay_celebration = \progress_planner()->get_plugin_upgrade_tasks()->should_show_upgrade_popover();

			// If we're not delaying the celebration, we need to get the pending_celebration tasks.
			if ( ! $delay_celebration ) {
				$pending_celebration_tasks = \progress_planner()->get_cpt_recommendations()->get_by_params( [ 'post_status' => 'pending_celebration' ] );

				foreach ( $pending_celebration_tasks as $key => $task ) {
					$task_id = $task['task_id'];

					$task_provider = \progress_planner()->get_cpt_recommendations()->get_tasks_manager()->get_task_provider(
						Task_Factory::create_task_from_id( $task_id )->get_provider_id()
					);

					if ( $task_provider && $task_provider->capability_required() ) {
						$task_details = \progress_planner()->get_cpt_recommendations()->get_tasks_manager()->get_task_details( $task_id );

						if ( $task_details ) {
							$task_details['priority']    = 'high'; // Celebrate tasks are always on top.
							$task_details['action']      = 'celebrate';
							$task_details['post_status'] = 'pending_celebration';

							$tasks[] = $task_details;
						}

						$task_post = \progress_planner()->get_cpt_recommendations()->get_post( $task_id );
						if ( ! $task_post ) {
							continue;
						}

						// Mark the pending celebration tasks as completed.
						\progress_planner()->get_cpt_recommendations()->update_recommendation(
							$task_post['ID'],
							[ 'post_status' => 'trash' ]
						);
					}
				}
			}
		}

		$final_tasks = [];
		foreach ( $tasks as $task ) {
			$final_tasks[ $task['task_id'] ] = $task;
		}

		$final_tasks = array_values( $final_tasks );

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
			$max_items_per_category[ $task['category']->term_id ] = $task['category'] === ( new Content_Review() )->get_provider_category() ? 2 : 1;
		}

		// We want to hide user tasks.
		if ( isset( $max_items_per_category['user'] ) ) {
			$max_items_per_category['user'] = 0;
		}

		// Enqueue the script.
		\progress_planner()->get_admin__enqueue()->enqueue_script(
			'widgets/suggested-tasks',
			[
				'name' => 'prplSuggestedTasks',
				'data' => [
					'ajaxUrl'             => \admin_url( 'admin-ajax.php' ),
					'nonce'               => \wp_create_nonce( 'progress_planner' ),
					'tasks'               => array_values( $final_tasks ),
					'maxItemsPerCategory' => apply_filters( 'progress_planner_suggested_tasks_max_items_per_category', $max_items_per_category ),
					'delayCelebration'    => $delay_celebration,
				],
			]
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
			'progress-planner-web-components-prpl-suggested-task',
			constant( 'PROGRESS_PLANNER_URL' ) . '/assets/css/web-components/prpl-suggested-task.css',
			[],
			\progress_planner()->get_file_version( constant( 'PROGRESS_PLANNER_DIR' ) . '/assets/css/web-components/prpl-suggested-task.css' )
		);

		return [
			'progress-planner-web-components-prpl-suggested-task',
		];
	}
}
