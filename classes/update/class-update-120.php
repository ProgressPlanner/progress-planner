<?php
/**
 * Update class for version 1.2.0
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

/**
 * Update class for version 1.2.0.
 *
 * @package Progress_Planner
 */
class Update_120 {

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->migrate_tasks();
	}

	/**
	 * Migrate the tasks.
	 *
	 * @return void
	 */
	private function migrate_tasks() {
		// Get all tasks.
		$tasks = \progress_planner()->get_settings()->get( 'local_tasks', [] );

		// Migrate the tasks.
		foreach ( $tasks as $task ) {
			$this->migrate_task( $task );
		}
	}

	/**
	 * Migrate a task.
	 *
	 * @param array $task The task to migrate.
	 *
	 * @return void
	 */
	private function migrate_task( $task ) {
		// Get the task details.
		$task_details = Local_Task_Factory::create_task_from( 'id', $task['task_id'] )->get_task_details();

		if ( empty( $task_details['title'] ) ) {
			return;
		}

		// Check if we have an existing task with the same title.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_suggested_task',
				'title'       => $task_details['title'],
				'post_status' => 'all',
				'numberposts' => 1,
			]
		);

		// If we have an existing task, skip.
		if ( ! empty( $posts ) ) {
			return;
		}

		$task_details['status'] = $task_details['status'] ?? 'published';
		switch ( $task_details['status'] ) {
			case 'pending_celebration':
				$status = 'trash';
				break;

			default:
				$status = 'published';
				break;
		}

		// Create a new task in the CPT.
		$post_id = \wp_insert_post(
			[
				'post_type'    => 'prpl_suggested_task',
				'post_title'   => $task_details['title'],
				'post_content' => $task_details['description'] ?? '',
				'post_status'  => $status,
			]
		);

		// Set the task category.
		\wp_set_post_terms( $post_id, $task_details['category'], 'prpl_suggested_task_category' );

		// Set the task provider.
		\wp_set_post_terms( $post_id, $task_details['provider_id'], 'prpl_suggested_task_provider' );
	}
}
