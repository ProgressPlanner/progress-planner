<?php
/**
 * A widget class.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Widgets;

use Progress_Planner\Badges\Monthly;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

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
	 * The tasks.
	 *
	 * @var array|null
	 */
	protected $pending_tasks = null;

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
	 * Register scripts.
	 *
	 * @return void
	 */
	public function register_scripts() {
		$handle = 'progress-planner-' . $this->id;

		$pending_celebration = \progress_planner()->get_suggested_tasks()->get_pending_celebration();
		$pending_tasks       = $this->get_pending_tasks();
		$deps                = [
			'progress-planner-todo',
			'progress-planner-grid-masonry',
			'progress-planner-web-components-prpl-suggested-task',
			'progress-planner-document-ready',
		];

		// Check if need to load confetti for the local tasks.
		$load_confetti = ! empty( $pending_celebration );

		foreach ( $pending_tasks as $type => $tasks ) {
			foreach ( $tasks as $task ) {
				if ( isset( $task['dismissable'] ) && $task['dismissable'] ) {
					$load_confetti = true;
					break 2; // Break out of the foreach loops.
				}
			}
		}

		// Check if need to load confetti.
		if ( $load_confetti ) {
			$deps[] = 'particles-confetti';
		} else {
			// Check if there are remote tasks to inject, checking here as it might involve an API call.
			$remote_tasks = \progress_planner()->get_suggested_tasks()->get_remote_tasks();
			if ( ! empty( $remote_tasks ) ) {
				$deps[] = 'particles-confetti';
			}
		}

		\wp_register_script(
			$handle,
			PROGRESS_PLANNER_URL . '/assets/js/widgets/suggested-tasks.js',
			$deps,
			\progress_planner()->get_file_version( PROGRESS_PLANNER_DIR . '/assets/js/widgets/suggested-tasks.js' ),
			true
		);
	}

	/**
	 * Enqueue scripts.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		$handle = 'progress-planner-' . $this->id;

		// Enqueue the script.
		\wp_enqueue_script( $handle );

		// Get all saved tasks (completed, pending celebration, snoozed).
		$tasks = \progress_planner()->get_suggested_tasks()->get_saved_tasks();

		// Get pending tasks.
		$tasks['details'] = $this->get_pending_tasks();

		// Insert the pending celebration tasks as high priority tasks, so they are shown always.
		foreach ( $tasks['pending_celebration'] as $task_id ) {

			$task_object   = ( new Local_Task_Factory( $task_id ) )->get_task();
			$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $task_object->get_provider_id() );

			if ( $task_provider && $task_provider->capability_required() ) {
				$task_details = \progress_planner()->get_suggested_tasks()->get_local()->get_task_details( $task_id );

				if ( $task_details ) {
					$task_details['priority'] = 'high'; // Celebrate tasks are always on top.
					$task_details['action']   = 'celebrate';
					$task_details['type']     = 'pending_celebration';

					if ( ! isset( $tasks['details']['pending_celebration'] ) ) {
						$tasks['details']['pending_celebration'] = [];
					}

					$tasks['details']['pending_celebration'][] = $task_details;
				}

				// Mark the pending celebration tasks as completed.
				\progress_planner()->get_suggested_tasks()->transition_task_status( $task_id, 'pending_celebration', 'completed' );
			}
		}

		$max_items_per_type = [];
		foreach ( $tasks['details'] as $type => $items ) {
			$max_items_per_type[ $type ] = $type === 'content-update' ? 2 : 1;
		}

		// We want all pending_celebration' tasks to be shown.
		if ( isset( $max_items_per_type['pending_celebration'] ) ) {
			$max_items_per_type['pending_celebration'] = 99;
		}

		// Check if current date is between Feb 12-16.
		$confetti_options = [];
		$year             = \gmdate( 'Y' );
		$current_date     = $year . '-' . \gmdate( 'm-d' );

		// TODO: GET params just for testing.
		$start_date = $year . '-' . ( isset( $_GET['start_date'] ) ? \sanitize_text_field( \wp_unslash( $_GET['start_date'] ) ) : '02-12' );
		$end_date   = $year . '-' . ( isset( $_GET['end_date'] ) ? \sanitize_text_field( \wp_unslash( $_GET['end_date'] ) ) : '02-16' );

		if ( $current_date >= $start_date && $current_date <= $end_date ) {
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

		// Localize the script.
		\wp_localize_script(
			$handle,
			'progressPlannerSuggestedTasks',
			[
				'ajaxUrl'         => \admin_url( 'admin-ajax.php' ),
				'nonce'           => \wp_create_nonce( 'progress_planner' ),
				'tasks'           => $tasks,
				'maxItemsPerType' => apply_filters( 'progress_planner_suggested_tasks_max_items_per_type', $max_items_per_type ),
				'confettiOptions' => $confetti_options,
			]
		);
	}

	/**
	 * Get the tasks.
	 *
	 * @return array The tasks.
	 */
	public function get_pending_tasks() {

		if ( null === $this->pending_tasks ) {
			$tasks         = [];
			$pending_tasks = \progress_planner()->get_suggested_tasks()->get_tasks();

			// Sort them by type (channel).
			foreach ( $pending_tasks as $task ) {

				if ( ! isset( $tasks[ $task['type'] ] ) ) {
					$tasks[ $task['type'] ] = [];
				}

				$tasks[ $task['type'] ][] = $task;
			}

			$this->pending_tasks = $tasks;
		}

		return $this->pending_tasks;
	}
}
