<?php
/**
 * Handler for suggested tasks activities.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Activities;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Providers\Repetitive\Create;

/**
 * Handler for suggested tasks activities.
 */
class Suggested_Task extends Activity {

	/**
	 * Points configuration for suggested tasks activities.
	 *
	 * @var int
	 */
	public static $points_config = 1;

	/**
	 * Category of the activity.
	 *
	 * @var string
	 */
	public $category = 'suggested_task';

	/**
	 * Save the activity.
	 *
	 * @return void
	 */
	public function save() {
		if ( ! $this->date ) {
			$this->date = new \DateTime();
		}

		if ( ! $this->user_id ) {
			$this->user_id = \get_current_user_id();
		}

		if ( $this->id ) {
			\progress_planner()->get_activities__query()->update_activity( $this->id, $this );
			return;
		}

		\progress_planner()->get_activities__query()->insert_activity( $this );
		\do_action( 'progress_planner_activity_saved', $this );
	}

	/**
	 * Get the points for an activity.
	 *
	 * @param \DateTime $date The date for which we want to get the points of the activity.
	 *
	 * @return int
	 */
	public function get_points( $date ) {
		$date_ymd = $date->format( 'Ymd' );
		if ( isset( $this->points[ $date_ymd ] ) ) {
			return $this->points[ $date_ymd ];
		}

		// Default points for a suggested task.
		$task_provider = \progress_planner()->get_suggested_tasks()->get_local()->get_task_provider( $this->data_id );
		$points        = 1;

		if ( $task_provider ) {
			// Create post task provider had a different points system, this is for backwards compatibility.
			if ( $task_provider instanceof Create ) {
				$points = $task_provider->get_points_for_task( $this->data_id );
			} else {
				$points = $task_provider->get_points();
			}
		}

		$this->points[ $date_ymd ] = $points;

		return (int) $this->points[ $date_ymd ];
	}
}
