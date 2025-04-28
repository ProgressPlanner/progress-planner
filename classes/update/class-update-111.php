<?php
/**
 * Update class for version 1.1.1.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

use Progress_Planner\Suggested_Tasks\Task_Factory;

/**
 * Update class for version 1.1.1.
 *
 * @package Progress_Planner
 */
class Update_111 {

	/**
	 * Tasks.
	 *
	 * @var array
	 */
	private $tasks = [];

	/**
	 * Whether local tasks have been changed.
	 *
	 * @var boolean
	 */
	private $tasks_changed = false;

	/**
	 * Run the update.
	 *
	 * @return void
	 */
	public function run() {
		// Migrate the `progress_planner_local_tasks` option.
		$this->migrate_local_tasks();

		// Migrate the `progress_planner_suggested_tasks` option.
		$this->migrate_suggested_tasks();

		// Convert local tasks.
		$this->convert_local_tasks();

		// Migrate to-do items.
		$this->migrate_todo_items();

		if ( $this->tasks_changed ) {
			\progress_planner()->get_settings()->set( 'tasks', $this->tasks );
		}

		// Migrate activities.
		$this->migrate_activities();

		// Now migrate 'create-post' and 'review-post' tasks.
		$this->tasks_changed = false;

		$this->migrate_create_post_tasks();
		$this->migrate_review_post_tasks();

		// Save the local tasks if they have been changed.
		if ( $this->tasks_changed ) {
			\progress_planner()->get_settings()->set( 'tasks', $this->tasks );
		}

		// Migrate the 'create-post' activities and 'review-post' activities.
		$this->migrate_create_post_activities();
		$this->migrate_review_post_activities();
	}

	/**
	 * Migrate the `progress_planner_suggested_tasks` option.
	 *
	 * @return void
	 */
	private function migrate_local_tasks() {
		$local_tasks_option = \get_option( 'progress_planner_local_tasks', [] );
		if ( ! empty( $local_tasks_option ) ) {
			foreach ( $local_tasks_option as $task_id ) {
				$task           = Task_Factory::create_task_from( 'id', $task_id )->get_data();
				$task['status'] = 'pending';

				if ( ! isset( $task['task_id'] ) ) {
					continue;
				}
				$this->add_local_task( $task );
				$this->tasks_changed = true;
			}
			\delete_option( 'progress_planner_local_tasks' );
		}
	}

	/**
	 * Migrate the `progress_planner_suggested_tasks` option.
	 *
	 * @return void
	 */
	private function migrate_suggested_tasks() {
		$suggested_tasks_option = \get_option( 'progress_planner_suggested_tasks', [] );
		if ( empty( $suggested_tasks_option ) ) {
			return;
		}
		foreach ( $suggested_tasks_option as $status => $tasks ) {
			foreach ( $tasks as $_task ) {
				$task_id        = is_string( $_task ) ? $_task : $_task['id'];
				$task           = Task_Factory::create_task_from( 'id', $task_id )->get_data();
				$task['status'] = $status;
				if ( 'snoozed' === $status && isset( $_task['time'] ) ) {
					$task['time'] = $_task['time'];
				}

				// Update the provider_id for update-post tasks.
				if ( isset( $task['provider_id'] ) && 'update-post' === $task['provider_id'] ) {
					$task['provider_id'] = 'review-post';
				}

				$this->add_local_task( $task );
				$this->tasks_changed = true;
			}
		}
		\delete_option( 'progress_planner_suggested_tasks' );
	}

	/**
	 * Add a local task.
	 *
	 * @param array $task The task to add.
	 *
	 * @return void
	 */
	private function add_local_task( $task ) {
		foreach ( $this->tasks as $key => $local_task ) {
			if ( isset( $local_task['task_id'] ) && $local_task['task_id'] === $task['task_id'] ) {
				$this->tasks[ $key ] = $task;
				return;
			}
		}
		$this->tasks[] = $task;
	}

	/**
	 * Convert task-IDs and add missing categories.
	 *
	 * @return void
	 */
	private function convert_local_tasks() {
		foreach ( $this->tasks as $key => $task ) {
			if ( isset( $task['type'] ) ) {
				unset( $this->tasks[ $key ]['type'] );
				$this->tasks_changed = true;
			}
			if ( ! isset( $task['task_id'] ) ) {
				continue;
			}
			$converted_task_id = $this->convert_task_id( $task['task_id'] );
			if ( $converted_task_id !== $task['task_id'] ) {
				$this->tasks[ $key ]['task_id'] = $converted_task_id;
				$this->tasks_changed            = true;
			}
		}
	}

	/**
	 * Migrate activities.
	 *
	 * @return void
	 */
	private function migrate_activities() {
		// Migrate acgtivities saved in the progress_planner_activities table.
		foreach ( \progress_planner()->get_activities__query()->query_activities(
			[ 'category' => 'suggested_task' ],
		) as $activity ) {
			$data_id     = $activity->data_id;
			$new_data_id = $this->convert_task_id( $data_id );
			if ( $new_data_id !== $data_id ) {
				$activity->data_id = $new_data_id;
				$activity->save();
			}
		}
	}

	/**
	 * Migrate to-do items.
	 *
	 * @return void
	 */
	private function migrate_todo_items() {
		$todo_items = \get_option( 'progress_planner_todo', [] );
		if ( empty( $todo_items ) ) {
			\delete_option( 'progress_planner_todo' );
			return;
		}
		foreach ( $todo_items as $todo_item ) {
			$this->add_local_task(
				[
					'task_id'     => 'user-task-' . md5( $todo_item['content'] ),
					'status'      => $todo_item['done'] ? 'completed' : 'pending',
					'provider_id' => 'user',
					'category'    => 'user',
					'title'       => $todo_item['content'],
				]
			);
		}

		$this->tasks_changed = true;

		\delete_option( 'progress_planner_todo' );
	}

	/**
	 * Convert a task ID.
	 *
	 * @param string $task_id The task ID to convert.
	 *
	 * @return string
	 */
	private function convert_task_id( $task_id ) {
		if ( ! str_contains( $task_id, '|' ) ) {
			return $task_id;
		}
		$task_id = str_replace( 'type', 'provider_id', $task_id );
		$task_id = str_replace( 'provider_id/update-post', 'provider_id/review-post', $task_id ); // Update the provider_id for update-post tasks.
		$parts   = \explode( '|', $task_id );
		\ksort( $parts );
		return \implode( '|', $parts );
	}

	/**
	 * Migrate the 'create-post' tasks, they are now repetitive tasks.
	 * Since the tasks were already migrated, we search for 'provider_id/create-post' (not 'type/create-post').
	 *
	 * @return void
	 */
	private function migrate_create_post_tasks() {

		// Migrate the 'create-post' completed tasks.
		if ( ! empty( $this->tasks ) ) {
			foreach ( $this->tasks as $key => $task ) {
				if ( ! isset( $task['task_id'] ) ) {
					continue;
				}
				if ( false !== strpos( $task['task_id'], 'provider_id/create-post' ) ) {

					// task_id needs to be unique, before we had 2 'create-post' tasks for the same week (short and long).
					// So for tasks which are completed or pending_celebration we will make the task_id like: create-post-short-202501,
					// and for pending tasks task_id will be (how it will be in the future, since we only have 1 type of create-post task per week): create-post-202501 .

					// Only add legacy part of the task_id if the task is not pending.
					if ( 'completed' === $task['status'] || 'pending_celebration' === $task['status'] ) {
						$this->tasks[ $key ]['task_id'] = $task['provider_id'] . '-' . ( $task['long'] ? 'long' : 'short' ) . '-' . $task['date'];
					} else {
						$this->tasks[ $key ]['task_id'] = $task['provider_id'] . '-' . $task['date'];
					}

					// We need to keep $task['long'] because it's used to calculate the points (and we don't know which post was created).

					$this->tasks_changed = true;
				}
			}
		}
	}

	/**
	 * Migrate the 'create-post' activities, they are now repetitive tasks.
	 * Since the activities were already migrated, we search for 'provider_id/create-post' (not 'type/create-post').
	 *
	 * @return void
	 */
	private function migrate_create_post_activities() {
		// Migrate the 'create-post' activities.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'completed',
			]
		);

		if ( ! empty( $activities ) ) {
			foreach ( $activities as $activity ) {
				if ( false !== strpos( $activity->data_id, 'provider_id/create-post' ) ) {
					$data = $this->get_data_from_task_id( $activity->data_id );

					// NOTE: task_id needs to be unique, before we had 2 'create-post' tasks in the same week (short and long).
					$new_data_id = $data['provider_id'] . '-' . ( $data['long'] ? 'long' : 'short' ) . '-' . $data['date'];
					if ( $new_data_id !== $activity->data_id ) {
						$activity->data_id = $new_data_id;
						$activity->save();
					}
				}
			}
		}
	}

	/**
	 * Migrate the 'review-post' tasks, they are now repetitive tasks.
	 * Since the tasks were already migrated, we search for 'provider_id/review-post' (not 'type/review-post').
	 *
	 * @return void
	 */
	private function migrate_review_post_tasks() {

		// Migrate the 'create-post' completed tasks.
		if ( ! empty( $this->tasks ) ) {
			foreach ( $this->tasks as $key => $task ) {
				if ( ! isset( $task['task_id'] ) ) {
					continue;
				}
				if ( false !== strpos( $task['task_id'], 'provider_id/review-post' ) ) {

					$data = $this->get_data_from_task_id( $task['task_id'] );

					// Get the date from the activity.
					$date                           = $this->get_date_from_activity( $task['task_id'] );
					$this->tasks[ $key ]['task_id'] = $data['provider_id'] . '-' . $data['post_id'] . '-' . $date;
					$this->tasks[ $key ]['date']    = $date;

					$this->tasks_changed = true;
				}
			}
		}
	}

	/**
	 * Migrate the 'review-post' tasks, they are now repetitive tasks.
	 * Since the activities were already migrated, we search for 'provider_id/create-post' (not 'type/create-post').
	 *
	 * @return void
	 */
	private function migrate_review_post_activities() {
		// Migrate the 'create-post' activities.
		$activities = \progress_planner()->get_activities__query()->query_activities(
			[
				'category' => 'suggested_task',
				'type'     => 'completed',
			]
		);

		if ( ! empty( $activities ) ) {
			foreach ( $activities as $activity ) {
				if ( ! isset( $activity->data_id ) || ! isset( $activity->date ) ) {
					continue;
				}
				if ( false !== strpos( $activity->data_id, 'provider_id/review-post' ) ) {
					$data = $this->get_data_from_task_id( $activity->data_id );

					$new_data_id = $data['provider_id'] . '-' . $data['post_id'] . '-' . $activity->date->format( 'YW' );
					if ( $new_data_id !== $activity->data_id && \is_callable( [ $activity, 'save' ] ) ) {
						$activity->data_id = $new_data_id;
						$activity->save();
					}
				}
			}
		}
	}

	/**
	 * Get the date from an activity.
	 *
	 * @param string $task_id The task ID.
	 *
	 * @return string
	 */
	private function get_date_from_activity( $task_id ) {
		$activity = \progress_planner()->get_activities__query()->query_activities(
			[
				'data_id'  => $task_id,
				'type'     => 'completed',
				'category' => 'suggested_task',
			]
		);

		if ( ! empty( $activity ) ) {
			return $activity[0]->date->format( 'YW' );
		}

		return \gmdate( 'YW' );
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
		$parts = \explode( '|', $task_id );
		$data  = [];
		foreach ( $parts as $part ) {
			$part = \explode( '/', $part );
			if ( 2 !== \count( $part ) ) {
				continue;
			}
			$data[ $part[0] ] = ( \is_numeric( $part[1] ) )
				? (int) $part[1]
				: $part[1];
		}
		\ksort( $data );

		// Convert (int) 1 and (int) 0 to (bool) true and (bool) false.
		if ( isset( $data['long'] ) ) {
			$data['long'] = (bool) $data['long'];
		}

		return $data;
	}
}
