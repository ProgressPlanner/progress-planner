<?php
/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

use Progress_Planner\Suggested_Tasks\Task_Factory;
use Progress_Planner\Suggested_Tasks\Task;

/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */
class Update_130 {

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		$this->add_set_valuable_post_types_option();
		$this->migrate_badges();
		$this->restore_completed_tasks();
	}

	/**
	 * Add the set valuable post types option.
	 *
	 * @return void
	 */
	private function add_set_valuable_post_types_option() {
		\update_option( 'progress_planner_set_valuable_post_types', true );
	}

	/**
	 * Migrate the content badges.
	 *
	 * @return void
	 */
	private function migrate_badges() {
		$options = \get_option( \Progress_Planner\Settings::OPTION_NAME );

		$badges_renamed = [
			'wonderful-writer' => 'content-curator',
			'bold-blogger'     => 'revision-ranger',
			'awesome-author'   => 'purposeful-publisher',
		];

		if ( ! isset( $options['badges'] ) ) {
			return;
		}

		foreach ( $badges_renamed as $old_badge_name => $new_badge_name ) {
			if ( isset( $options['badges'][ $old_badge_name ] ) ) {
				$options['badges'][ $new_badge_name ] = $options['badges'][ $old_badge_name ];
				unset( $options['badges'][ $old_badge_name ] );
			}
		}

		\update_option( \Progress_Planner\Settings::OPTION_NAME, $options );
	}

	/**
	 * Restore the completed tasks.
	 *
	 * @return void
	 */
	private function restore_completed_tasks() {
		$local_tasks         = \progress_planner()->get_settings()->get( 'tasks', [] );
		$local_tasks_changed = false;

		// Migrate acgtivities saved in the progress_planner_activities table.
		foreach ( \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'completed',
			],
		) as $activity ) {

			$continue_main_loop = false;

			// Check if the task with the same task_id exists, it means that task was recreated (and has pending status now).
			foreach ( $local_tasks as $key => $local_task ) {
				if ( $local_task['task_id'] === $activity->data_id ) {
					// Set the status to completed.
					$local_tasks[ $key ]['status'] = 'completed';
					$local_tasks_changed           = true;
					$continue_main_loop            = true;

					// Break the inner loop.
					break;
				}
			}

			// Continue the main loop.
			if ( $continue_main_loop ) {
				continue;
			}

			// Generate the data from the task ID.
			$data = $this->get_data_from_task_id( $activity->data_id );

			// Don't import back tasks that don't have a provider_id or category.
			if ( empty( $data['provider_id'] ) || empty( $data['category'] ) ) {
				continue;
			}

			// Add the status to the data.
			$data['status'] = 'completed';

			// Insert the task.
			$local_tasks[] = $data;

			$local_tasks_changed = true;
		}

		if ( $local_tasks_changed ) {
			\progress_planner()->get_settings()->set( 'tasks', $local_tasks );
		}
	}

	/**
	 * Get the data from a task-ID.
	 * Copied from the Progress_Planner\Suggested_Tasks\Providers\Content class, since we might remove that function in the future.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return array The data.
	 */
	private function get_data_from_task_id( $task_id ) {

		$task_object = Task_Factory::create_task_from( 'id', $task_id );

		if ( 0 === strpos( $task_object->get_task_id(), 'create-post-' ) || 0 === strpos( $task_object->get_task_id(), 'create-post-short-' ) ) {
			$task_object = $this->handle_legacy_post_tasks( $task_object );
		}

		// Review post task is not recognized by the Task_Factory (because it changed from piped format: post_id/2949|type/update-post -> review-post-2949-202415).
		if ( 0 === strpos( $task_object->get_task_id(), 'review-post-' ) ) {
			$task_object = $this->handle_legacy_review_post_tasks( $task_object );
		}

		// Yoast SEO tasks and Comment Hacks tasks are not recognized by the Task_Factory, since they are added recently.
		if ( 0 === strpos( $task_object->get_task_id(), 'yoast-' ) || 0 === strpos( $task_object->get_task_id(), 'ch-comment' ) ) {
			$task_object = $this->handle_legacy_yoast_and_comment_hacks_tasks( $task_object );
		}

		return $task_object->get_data();
	}

	/**
	 * Handle legacy post tasks.
	 *
	 * @param Task $task_object The task object.
	 *
	 * @return Task The task object.
	 */
	private function handle_legacy_post_tasks( $task_object ) {
		// Handle legacy long post tasks, here we just need to set 'long' flag to true.
		if ( 0 === strpos( $task_object->get_task_id(), 'create-post-long-' ) ) {
			$data         = $task_object->get_data();
			$data['long'] = true;
			$task_object->set_data( $data );
		}

		// Handle legacy short post tasks, here we just need to set 'long' flag to false.
		if ( 0 === strpos( $task_object->get_task_id(), 'create-post-short-' ) ) {
			$data         = $task_object->get_data();
			$data['long'] = false;
			$task_object->set_data( $data );
		}

		return $task_object;
	}

	/**
	 * Handle legacy review post tasks.
	 *
	 * @param Task $task_object The task object.
	 *
	 * @return Task The task object.
	 */
	private function handle_legacy_review_post_tasks( $task_object ) {
		// Review provider.
		$task_provider = \progress_planner()->get_suggested_tasks()->get_tasks_manager()->get_task_provider( 'review-post' );

		// Get the post ID and date from the task ID.
		$parts = explode( '-', $task_object->get_task_id() );

		$data = [
			'task_id'     => $task_object->get_task_id(),
			'post_id'     => $parts[2],
			'date'        => $parts[3],
			'provider_id' => $task_provider ? $task_provider->get_provider_id() : 'review-post',
			'category'    => $task_provider ? $task_provider->get_provider_category() : 'content-update',
		];

		$task_object->set_data( $data );

		return $task_object;
	}

	/**
	 * Handle legacy Yoast SEO tasks.
	 *
	 * @param Task $task_object The task object.
	 *
	 * @return Task The task object.
	 */
	private function handle_legacy_yoast_and_comment_hacks_tasks( $task_object ) {

		$data = [
			'task_id'     => $task_object->get_task_id(),
			'provider_id' => $task_object->get_task_id(),
			'category'    => 'configuration',
		];

		$task_object->set_data( $data );

		return $task_object;
	}
}
