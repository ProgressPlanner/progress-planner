<?php
/**
 * Update class for version 1.6.1.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

/**
 * Update class for version 1.6.1.
 *
 * @package Progress_Planner
 */
class Update_161 extends Update {

	const VERSION = '1.6.1';

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Migrate the badges.
		$this->migrate_badges();

		// Migrate the tasks.
		$this->migrate_tasks();
	}

	/**
	 * Migrate the badges.
	 *
	 * @return void
	 */
	private function migrate_badges() {
		// Get all badges.
		$badges = \progress_planner()->get_settings()->get( 'badges', [] );

		foreach ( $badges as $badge_id => $badge ) {
			// We are only migrating monthly badges.
			if ( 0 !== \strpos( $badge_id, 'monthly-' ) ) {
				continue;
			}

			if ( ! isset( $badges[ $badge_id ]['points'] ) ) {
				// We are just adding the points to the badge, for the new data structure - 10 is the max points for a badge.
				$badges[ $badge_id ]['points'] = 10 - (int) $badge['remaining'];
			}
		}

		// Set the badges.
		\progress_planner()->get_settings()->set( 'badges', $badges );
	}

	/**
	 * Migrate the tasks.
	 *
	 * @return void
	 */
	private function migrate_tasks() {
		// Get all tasks.
		$tasks = \progress_planner()->get_settings()->get( 'tasks', [] );

		// Migrate the tasks.
		foreach ( $tasks as $task ) {
			$this->migrate_task( $task );
		}

		// Delete the tasks option.
		\progress_planner()->get_settings()->delete( 'tasks' );
	}

	/**
	 * Migrate a task.
	 *
	 * @param array $task The task to migrate.
	 *
	 * @return void
	 */
	private function migrate_task( $task ) {
		// Skip tasks which don't have a provider ID or status.
		if ( ! isset( $task['status'] ) || ! isset( $task['provider_id'] ) ) {
			return;
		}

		// Only migrate user tasks. Other tasks are now handled by React.
		if ( 'user' !== $task['provider_id'] ) {
			return;
		}

		// User tasks have different data structure, so we can copy directly.
		$task_details = [
			'post_title'  => isset( $task['title'] ) ? $task['title'] : '',
			'description' => '',
			'points'      => isset( $task['points'] ) ? $task['points'] : 0,
			'provider_id' => 'user',
			'category'    => 'user',
			'task_id'     => isset( $task['task_id'] ) ? $task['task_id'] : '',
			'post_status' => 'pending' === $task['status'] ? 'publish' : $task['status'],
			'dismissable' => true,
			'snoozable'   => false,
		];

		// Add the task to the database.
		\progress_planner()->get_suggested_tasks_db()->add( $task_details );
	}
}
