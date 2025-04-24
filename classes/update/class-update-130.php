<?php
/**
 * Update class for version 1.3.0.
 *
 * @package Progress_Planner
 */

namespace Progress_Planner\Update;

use Progress_Planner\Suggested_Tasks\Local_Tasks\Local_Task_Factory;

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
		$this->migrate_tasks();
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
			error_log( 'Task not migrated - missing title: ' . wp_json_encode( $task ) ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			return;
		}

		// Check if we have an existing task with the same title.
		$posts = \get_posts(
			[
				'post_type'   => 'prpl_recommendations',
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

			case 'completed':
				$status = 'draft';
				break;

			default:
				$status = 'publish';
				break;
		}

		// Create a new task in the CPT.
		$post_id = \wp_insert_post(
			[
				'post_type'    => 'prpl_recommendations',
				'post_title'   => $task_details['title'],
				'post_content' => $task_details['description'] ?? '',
				'post_status'  => $status,
				'menu_order'   => $task_details['order'] ?? 0,
			]
		);

		// Add terms if they don't exist.
		foreach ( [ 'category', 'provider_id' ] as $context ) {
			$taxonomy_name = str_replace( '_id', '', $context );
			$term          = \get_term_by( 'name', $task_details[ $context ], "prpl_recommendations_$taxonomy_name" );
			if ( ! $term ) {
				\wp_insert_term( $task_details[ $context ], "prpl_recommendations_$taxonomy_name" );
			}
		}

		// Set the task category.
		\wp_set_post_terms( $post_id, $task_details['category'], 'prpl_recommendations_category' );

		// Set the task provider.
		\wp_set_post_terms( $post_id, $task_details['provider_id'], 'prpl_recommendations_provider' );

		// Set the task parent.
		if ( ! empty( $task_details['parent'] ) ) {
			$parent = \get_post( $task_details['parent'] );
			if ( $parent ) {
				\wp_update_post(
					[
						'ID'          => $post_id,
						'post_parent' => $parent->ID,
					]
				);
			}
		}

		// Set other meta.
		$default_keys = [
			'task_id',
			'title',
			'description',
			'status',
			'category',
			'provider_id',
			'parent',
			'order',
		];
		foreach ( $task_details as $key => $value ) {
			if ( in_array( $key, $default_keys, true ) ) {
				continue;
			}

			\update_post_meta( $post_id, "prpl_$key", $value );
		}

		\progress_planner()->get_settings()->set( 'local_tasks', [] );
	}
}
