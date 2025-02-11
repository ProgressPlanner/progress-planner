<?php
/**
 * Handler for suggested tasks activities.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Activities;

use Progress_Planner\Activity;

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
		$this->date    = new \DateTime();
		$this->user_id = \get_current_user_id();

		\progress_planner()->get_query()->insert_activity( $this );
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
		$points = 1;

		$data = \progress_planner()->get_suggested_tasks()->get_local()->get_data_from_task_id( $this->data_id );
		if ( isset( $data['type'] ) && ( 'create-post' === $data['type'] || 'review-post' === $data['type'] ) && isset( $data['long'] ) && true === $data['long'] ) {
			$points = 2;
		}

		$this->points[ $date_ymd ] = $points;

		return (int) $this->points[ $date_ymd ];
	}
}
