<?php
/**
 * Handle TODO list items.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner;

use Progress_Planner\Suggested_Tasks\Scripts;
use Progress_Planner\Suggested_Tasks\Evaluation;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Update_Posts as Local_Tasks_Update_Posts;
use Progress_Planner\Suggested_Tasks\Local_Tasks\Update_Core as Local_Tasks_Update_Core;
use Progress_Planner\Activities\Suggested_Task as Suggested_Task_Activity;

/**
 * Settings class.
 */
class Suggested_Tasks {

	/**
	 * The name of the settings option.
	 *
	 * @var string
	 */
	const OPTION_NAME = 'progress_planner_suggested_tasks';

	/**
	 * Constructor.
	 *
	 * @return void
	 */
	public function __construct() {
		new Scripts();
		new Evaluation();
		new Local_Tasks_Update_Posts();
		new Local_Tasks_Update_Core();
		$this->maybe_unsnooze_tasks();
	}

	/**
	 * Mark a task as completed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public static function mark_task_as_completed( $task_id ) {
		$option            = \get_option( self::OPTION_NAME, [] );
		$activity          = new Suggested_Task_Activity();
		$activity->type    = 'completed';
		$activity->data_id = 0;
		$activity->date    = new \DateTime();
		$activity->user_id = \get_current_user_id();
		$activity->save();
		$completed           = $option['completed'] ?? [];
		$completed[]         = (string) $task_id;
		$option['completed'] = $completed;

		return \update_option( self::OPTION_NAME, $option );
	}

	/**
	 * Mark a task as snoozed.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return bool
	 */
	public static function mark_task_as_snoozed( $task_id ) {
		$option            = \get_option( self::OPTION_NAME, [] );
		$snoozed           = $option['snoozed'] ?? [];
		$snoozed[]         = [
			'id'   => (string) $task_id,
			'time' => \time() + \WEEK_IN_SECONDS,
		];
		$option['snoozed'] = $snoozed;

		return \update_option( self::OPTION_NAME, $option );
	}

	/**
	 * Maybe unsnooze tasks.
	 *
	 * @return void
	 */
	private function maybe_unsnooze_tasks() {
		$option = \get_option( self::OPTION_NAME, [] );
		if ( ! isset( $option['snoozed'] ) ) {
			return;
		}
		$current_time = \time();

		$update = false;
		foreach ( $option['snoozed'] as $key => $task ) {
			if ( $task['time'] < $current_time ) {
				unset( $option['snoozed'][ $key ] );
				$update = true;
			}
		}
		if ( $update ) {
			\update_option( self::OPTION_NAME, $option );
		}
	}
}
